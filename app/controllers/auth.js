const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path')
const CryptoJS = require('crypto-js');
const env = process.env.NODE_ENV || 'development';

exports.signup = async (req, res) => {
    try {
        // Créer un utilisateur avec les données de la requête
        const user = await User.create({
            ...req.body
        });

        // Vérifier si un avatar a été généré
        if (req.avatarData) {
            const { circleColor, pathColor, uniqueAvatarName } = req.avatarData;
            
            // Lire le modèle de base de l'avatar
            const defaultAvatarPath = path.join(__dirname, '../../uploads/profiles/default/default_avatar.svg');
            const userAvatarPath = path.join(__dirname, '../../uploads/profiles/avatars', uniqueAvatarName);

            let svgContent = fs.readFileSync(defaultAvatarPath, 'utf8');

            // Modifier le SVG avec les nouvelles couleurs
            svgContent = svgContent.replace(/<rect[^>]*fill="[^"]*"[^>]*>/, `<rect width="720" height="720" rx="100" fill="${circleColor}"/>`);
            svgContent = svgContent.replace(/<path[^>]*fill="[^"]*"[^>]*>/, `<path d="M261.132 485.558L176 381.616L185.199 286.919L340.495 158.714C340.495 158.714 366.378 137.322 360.329 77L433.702 204.943L256.682 351.085L277.349 355.543L322.067 410.142L261.132 485.549V485.558Z" fill="${pathColor}"/>`);

            // Enregistrer le SVG modifié
            fs.writeFileSync(userAvatarPath, svgContent);

            // Ajouter le chemin de l'avatar à l'utilisateur
            user.avatar = `${req.protocol}://${req.get("host")}/uploads/profiles/avatars/${uniqueAvatarName}`;
            await user.save();
        }

        res.status(201).json(user);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({ message: messages });
        }
        res.status(500).json({
            message: "Erreur interne lors de la création de l'utilisateur.",
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // Vérifiez que le champ 'identifier' et le mot de passe sont fournis
        if (!identifier) {
            return res.status(400).json({ message: "Votre identifiant est requis." });
        }

        if (!password) {
            return res.status(400).json({ message: "Votre mot de passe est requis." });
        }

        // Chercher l'utilisateur par email ou nom d'utilisateur
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: identifier },{ username: identifier }]
            }
        });

        if (!user) {
          return res.status(404).json({ message: "Votre identifiant ou votre mot de passe est incorrect" });
        }

        // Comparer le mot de passe
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Votre identifiant ou votre mot de passe est incorrect" });
        }

        // Générer les tokens
        const accessToken = jwt.sign(
            { userId: user.id, userRole: user.role, avatar: user.avatar, username: user.username, points: user.points },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '30d' }
        );

        res.cookie('token', accessToken, {
            httpOnly: true,  // Empêche l'accès au cookie via JS
            secure: process.env.NODE_ENV === 'production',  // Seulement en HTTPS en production
            sameSite: 'Strict',  // Empêche l'envoi du cookie pour les requêtes cross-site
            maxAge: 10 * 60 * 60 * 1000,  // Expire dans 10 heures
        });

        // Stockez le Refresh Token dans un cookie sécurisé
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
        });        

        await Token.create({
            user_id: user.id,
            avatar: user.avatar,
            username: user.username,
            points: user.points,
            access_token: accessToken,
            refresh_token: refreshToken,
            access_token_expires_at: new Date(Date.now() + 10 * 60 * 60 * 1000),
            refresh_token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({ accessToken, refreshToken, user });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred during login'
        });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token manquant !" });
        }

        // Vérifier la validité du Refresh Token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Vérifier si le token est présent dans la base de données
        const tokenRecord = await Token.findOne({
            where: {
                refresh_token: refreshToken,
                user_id: decoded.userId,
            },
        });

        if (!tokenRecord) {
            return res.status(403).json({ message: "Refresh token invalide !" });
        }

        // Générer un nouveau Access Token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, userRole: decoded.userRole },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        // Mettre à jour le token dans la base de données
        tokenRecord.access_token = newAccessToken;
        tokenRecord.access_token_expires_at = new Date(Date.now() + 10 * 60 * 60 * 1000);
        await tokenRecord.save();

        // Définir un nouveau cookie pour le Access Token
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 10 * 60 * 60 * 1000,
        });

        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: "Erreur lors du renouvellement du token." });
    }
};

exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await Token.destroy({
                where: {
                    refresh_token: refreshToken,
                },
            });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la déconnexion." });
    }
};

/**
 * Demande une réinitialisation de mot de passe en envoyant un e-mail avec un lien de réinitialisation.
 *
 * @function requestPasswordReset
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de l'envoi de l'e-mail.
 *
 * @example
 * // Exemple de requête
 * POST /api/auth/request-password-reset
 * {
 *   "email": "utilisateur@example.com"
 * }
 */
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "L'adresse email fournie est invalide" });
        }

        const user = await User.findOne({ where: { email } });
 
        if (!user) {
            return res.status(404).json({ message: "Vous n'êtes pas inscrit sur la plateforme" });
        }

        // Générer un token unique
        const token = CryptoJS.lib.WordArray.random(20).toString();

        const hashedToken = CryptoJS.SHA256(token).toString();

        // Enregistrer le token haché et l'expiration (15 minutes)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Créer un lien de réinitialisation
        const resetLink = `${env === 'production' ? process.env.ORIGIN_PROD : process.env.ORIGIN}/reset/?token=${token}`;
        console.log(resetLink)
        // Lire le template d'email
        // const emailTemplatePath = path.join(__dirname, '../../templates/reset-password-email.html');
        // let htmlContent = fs.readFileSync(emailTemplatePath, 'utf8');
        // htmlContent = htmlContent.replace(/{{resetLink}}/, resetLink);

        // // Envoyer l'email
        // await req.mailer.sendEmail(
        //     user.email,
        //     'Réinitialisation de votre mot de passe',
        //     '',
        //     htmlContent
        // );

        res.status(200).json({ message: 'Email envoyé pour la réinitialisation de votre mot de passe' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Impossible d’initier la réinitialisation du mot de passe' });
    }
};

/**
 * Réinitialise le mot de passe de l'utilisateur.
 *
 * @function resetPassword
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la réinitialisation du mot de passe.
 *
 * @example
 * // Exemple de requête
 * POST /api/auth/reset-password?token=<TOKEN>
 * {
 *   "password": "NouveauMotDePasse123!",
 *   "confirmPassword": "NouveauMotDePasse123!"
 * }
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { password, confirmPassword } = req.body;
    
        if (!password) {
            return res.status(400).json({ message: "Le mot de passe est requis" });
        }
    
        if (!confirmPassword) {
            return res.status(400).json({ message: "Le mot de passe de confirmation est requis" });
        }
    
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
        }

        // Vérifier que le mot de passe respecte la regex définie dans le modèle
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹])[A-Za-z\d!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹]{12,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Mot de passe : 12 caractères min, avec majuscules, minuscules, chiffres et caractères spéciaux"
            });
        }
        
        // Hacher le token fourni pour la comparaison
        const hashedToken = CryptoJS.SHA256(token).toString();

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Votre session est invalide ou a expiré" });
        }

        // Hash le nouveau mot de passe
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null; // Réinitialiser le token
        user.resetPasswordExpires = null; // Réinitialiser l'expiration
        await user.save();

        // Envoyer un email de confirmation
        // const confirmationEmailTemplatePath = path.join(__dirname, '../../templates/reset-password-confirmation-email.html');
        // let confirmationHtmlContent = fs.readFileSync(confirmationEmailTemplatePath, 'utf8');
        // confirmationHtmlContent = confirmationHtmlContent.replace(/{{username}}/, user.username);

        // await req.mailer.sendEmail(
        //     user.email,
        //     'Votre mot de passe a été réinitialisé',
        //     '',
        //     confirmationHtmlContent
        // );

        // Invalider le cookie contenant le token JWT
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Impossible de réinitialiser le mot de passe' });
    }
};