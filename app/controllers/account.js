const { User } = require('../models');

/**
 * @module UserController
 */

/**
 * Récupère les informations du compte de l'utilisateur connecté, y compris l'inventaire actif.
 *
 * @function readAccount
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la récupération des informations de l'utilisateur.
 */
exports.readAccount = async (req, res) => {
    try {
        const userId = req.auth.userId;// Récupérer l'ID de l'utilisateur depuis les paramètres JWT

        // Trouver l'utilisateur par ID avec findOne
        const user = await User.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Une erreur est survenue lors de la récupération des comptes.'
        });
    }
};

/**
 * Récupère les informations d'un utilisateur par son ID.
 *
 * @function read
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la récupération de l'utilisateur.
 */
exports.read = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] } // Exclure le champ 'password'
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Une erreur est survenue lors de la récupération du compte.'
        });
    }
};

/**
 * Récupère tous les utilisateurs, en excluant le champ 'password'.
 *
 * @function readAll
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la récupération des utilisateurs.
 */
exports.readAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'email'] }  // Adjust exclusions as needed
        });        

        if (!users) {
            return res.status(404).json({ message: "Users not found" });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Une erreur est survenue lors de la récupération des comptes.'
        });
    }
};

/**
 * Supprime un utilisateur et son avatar.
 *
 * @function delete
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la suppression de l'utilisateur.
 */
exports.delete = async (req, res) => {
    try {
        const userId = req.auth.userId;// Récupérer l'ID de l'utilisateur depuis les paramètres JWT

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Trouver l'utilisateur par ID
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });

        // Supprimer l'utilisateur
        await user.destroy();

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Une erreur est survenue lors de la suppression du compte.'
        });
    }
};