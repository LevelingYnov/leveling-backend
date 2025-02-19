const { User } = require('../models');
const bcrypt = require('bcrypt');

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
            attributes: { exclude: ['password', 'email', 'poids', 'taille', 'role', 'registration_date'] } // Exclure le champ 'password'
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
            attributes: { exclude: ['password', 'email', 'poids', 'taille', 'role', 'registration_date'] }  // Adjust exclusions as needed
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
 * Met à jour les informations d'un utilisateur.
 *
 * @function update
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la mise à jour de l'utilisateur.
 *
 * @example
 * // Exemple de requête
 * PATCH /api/users/update
 * {
 *   "datas": {
 *     "username": "nouveau_nom",
 *     "email": "nouvel_email@example.com",
 *     "avatar": "delete"
 *   }
 * }
 */
exports.update = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const datas = JSON.parse(req.body.datas);
        const { username, email, poids, taille } = datas;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Trouver l'utilisateur par ID
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Mise à jour des informations de l'utilisateur
        if (username) {
            // Valider le username
            const usernameRegex = /^(?=.*[a-zA-Z])(?=^[A-Za-z0-9_-]{3,15}$)/; // Regex pour le username
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: "Nom d'utilisateur : 3 à 15 caractères, min une lettre, et peut contenir des chiffres, des tirets et des tirets du bas"
                });
            }
            user.username = username;
        }

        if(email) user.email = email;

        if(poids) user.poids = poids;

        if(taille) user.taille = taille;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'Une erreur est survenue lors de la mise à jour du compte.'
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

/**
 * Met à jour le mot de passe d'un utilisateur.
 *
 * @function updatePassword
 * @async
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP.
 * @throws {Error} En cas d'erreur lors de la mise à jour du mot de passe.
 */
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.auth.userId; // Récupérer l'ID de l'utilisateur via JWT
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Vérification des champs
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires." });
        }

        // Vérifier que le nouveau mot de passe correspond à la confirmation
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "Les nouveaux mots de passe ne correspondent pas." });
        }

        // Regex pour valider le mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹])[A-Za-z\d!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹]{12,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: "Mot de passe : 12 caractères min, avec majuscules, minuscules, chiffres et caractères spéciaux" });
        }

        // Trouver l'utilisateur dans la base de données
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Vérifier que le mot de passe actuel est correct
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Mot de passe actuel incorrect." });
        }

        // Hacher le nouveau mot de passe
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Mettre à jour le mot de passe de l'utilisateur
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Une erreur est survenue lors de la mise à jour du mot de passe."
        });
    }
};