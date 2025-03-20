const jwt = require('jsonwebtoken');
const { Token } = require('../models');

/**
 * Middleware d'authentification qui vérifie le Bearer Token.
 */
module.exports = async (req, res, next) => {
    try {
        // Récupérer le token dans l'en-tête Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Token missing or malformed');
        }

        const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"

        // Vérifier et décoder le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Vérifier si le token est valide dans la base de données
        const storedToken = await Token.findOne({
            where: {
                user_id: decodedToken.userId,
                access_token: token
            },
        });

        if (!storedToken) {
            return res.status(401).json({ error: 'Invalid token. Please log in again.' });
        }

        // Ajouter les infos d'authentification à la requête
        req.auth = {
            userId: decodedToken.userId,
            userRole: decodedToken.userRole
        };

        next(); // Continuer vers le middleware suivant ou le contrôleur
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please refresh.' });
        }

        res.status(401).json({ error: 'Unauthorized request!' });
    }
};