const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      // Vérification des champs obligatoires
      if (!username || !email || !password) {
        return res.status(400).json({
          message: "Tous les champs (username, email, password) sont obligatoires.",
        });
      }
  
      // Vérification si l'utilisateur ou l'email existe déjà
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
        },
      });
  
      if (existingUser) {
        return res.status(400).json({
          message: "Nom d'utilisateur ou email déjà utilisé.",
        });
      }
  
      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Création de l'utilisateur
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });
  
      // Réponse JSON sans le mot de passe
      res.status(201).json({
        message: "Utilisateur créé avec succès.",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      // Gestion des erreurs Sequelize
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json({ message: messages });
      }
  
      console.error(error);
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
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
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

        // Générer le token JWT
        const token = jwt.sign(
            { userId: user.id, userRole: user.roles }, 
            process.env.JWT_SECRET, 
            { expiresIn: '10h' }
        );

        res.cookie('token', token, {
            httpOnly: true,  // Empêche l'accès au cookie via JS
            secure: process.env.NODE_ENV === 'production',  // Seulement en HTTPS en production
            sameSite: 'Strict',  // Empêche l'envoi du cookie pour les requêtes cross-site
            maxAge: 10 * 60 * 60 * 1000,  // Expire dans 10 heures
        });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred during login'
        });
    }
}

// exports.logout = (req, res) => {
//     try {
//         // Invalider le cookie contenant le token JWT
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//         });

//         // Envoyer une réponse de succès
//         res.status(200).json({ message: "Successfully logged out" });
//     } catch (error) {
//         res.status(500).json({ message: error.message || 'Logout failed' });
//     }
// };


// exports.requestPasswordReset = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
//         if (!emailRegex.test(email)) {
//             return res.status(400).json({ message: "L'adresse email fournie est invalide" });
//         }

//         const user = await User.findOne({ where: { email } });
 
//         if (!user) {
//             return res.status(404).json({ message: "Vous n'êtes pas inscrit sur la plateforme" });
//         }

//         // Générer un token unique
//         const token = CryptoJS.lib.WordArray.random(20).toString();

//         const hashedToken = CryptoJS.SHA256(token).toString();

//         // Enregistrer le token haché et l'expiration (15 minutes)
//         user.resetPasswordToken = hashedToken;
//         user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
//         await user.save();

//         // Créer un lien de réinitialisation
//         const resetLink = `${env === 'production' ? process.env.ORIGIN_PROD : process.env.ORIGIN}/reset/?token=${token}`;

//         // Lire le template d'email
//         const emailTemplatePath = path.join(__dirname, '../../templates/reset-password-email.html');
//         let htmlContent = fs.readFileSync(emailTemplatePath, 'utf8');
//         htmlContent = htmlContent.replace(/{{resetLink}}/, resetLink);

//         // Envoyer l'email
//         await req.mailer.sendEmail(
//             user.email,
//             'Réinitialisation de votre mot de passe',
//             '',
//             htmlContent
//         );

//         res.status(200).json({ message: 'Email envoyé pour la réinitialisation de votre mot de passe' });
//     } catch (error) {
//         return res.status(500).json({ message: error.message || 'Impossible d’initier la réinitialisation du mot de passe' });
//     }
// };


// exports.resetPassword = async (req, res) => {
//     try {
//         const { token } = req.query;
//         const { password, confirmPassword } = req.body;
    
//         if (!password) {
//             return res.status(400).json({ message: "Le mot de passe est requis" });
//         }
    
//         if (!confirmPassword) {
//             return res.status(400).json({ message: "Le mot de passe de confirmation est requis" });
//         }
    
//         if (password !== confirmPassword) {
//             return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
//         }

//         // Vérifier que le mot de passe respecte la regex définie dans le modèle
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹])[A-Za-z\d!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹]{12,}$/;
//         if (!passwordRegex.test(password)) {
//             return res.status(400).json({ 
//                 message: "Mot de passe : 12 caractères min, avec majuscules, minuscules, chiffres et caractères spéciaux"
//             });
//         }
        
//         // Hacher le token fourni pour la comparaison
//         const hashedToken = CryptoJS.SHA256(token).toString();

//         const user = await User.findOne({
//             where: {
//                 resetPasswordToken: hashedToken,
//                 resetPasswordExpires: { [Op.gt]: Date.now() } // Vérifier si le token est toujours valide
//             }
//         });

//         if (!user) {
//             return res.status(400).json({ message: "Votre session est invalide ou a expiré" });
//         }

//         // Hash le nouveau mot de passe
//         user.password = await bcrypt.hash(password, 10);
//         user.resetPasswordToken = null; // Réinitialiser le token
//         user.resetPasswordExpires = null; // Réinitialiser l'expiration
//         await user.save();

//         // Envoyer un email de confirmation
//         const confirmationEmailTemplatePath = path.join(__dirname, '../../templates/reset-password-confirmation-email.html');
//         let confirmationHtmlContent = fs.readFileSync(confirmationEmailTemplatePath, 'utf8');
//         confirmationHtmlContent = confirmationHtmlContent.replace(/{{username}}/, user.username);

//         await req.mailer.sendEmail(
//             user.email,
//             'Votre mot de passe a été réinitialisé',
//             '',
//             confirmationHtmlContent
//         );

//         // Invalider le cookie contenant le token JWT
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//         });

//         res.status(200).json({ message: 'Le mot de passe a été réinitialisé avec succès' });
//     } catch (error) {
//         res.status(500).json({ message: error.message || 'Impossible de réinitialiser le mot de passe' });
//     }
// };