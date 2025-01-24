const { User, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

exports.signup = async (req, res) => {
  try {
      const user = await User.create({
          ...req.body
      });
    
      res.status(201).json(user);
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
            { userId: user.id, userRole: user.role },
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