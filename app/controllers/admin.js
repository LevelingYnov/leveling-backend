const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * @module userController
 * @description Ce module contient des fonctions pour gérer les données des utilisateurs, y compris la création, la mise à jour, la suppression d'utilisateurs et l'envoi de rapports.
 */

/**
 * Créer un nouvel utilisateur.
 * 
 * @async
 * @function create
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @throws {Object} 403 - Interdit si l'utilisateur n'a pas la permission de créer un utilisateur.
 * @throws {Object} 400 - Mauvaise requête si des champs requis sont manquants ou invalides.
 * @returns {Object} 201 - Objet utilisateur créé.
 * @returns {Object} 500 - Erreur interne du serveur si une erreur se produit lors de la création de l'utilisateur.
 */
exports.create = async (req, res) => {
    try {
        const datas = JSON.parse(req.body.datas);
        const { username, email, password, role } = datas;

        // Validation des champs requis
        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required." });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

         // Regex pour valider le mot de passe
         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹])[A-Za-z\d!@#$%^&*()_+=\-[\]{};:,.<>?/\\|`~"'£¤§µ¢₹]{12,}$/;
         if (!passwordRegex.test(password)) {
             return res.status(400).json({ message: "Mot de passe : 12 caractères min, avec majuscules, minuscules, chiffres et caractères spéciaux" });
         }

        // Vérifier si l'utilisateur tente de créer un rôle autre que 'USER'
        if (role && role !== 'User') {
            // Vérifier si le rôle de l'utilisateur qui fait la requête est SUPER_ADMIN
            if (req.auth.userRole !== 'SuperAdmin') {
                return res.status(403).json({ message: "Seul SUPER_ADMIN peut attribuer des rôles autres que USER." });
            }
        }

        // Création de l'utilisateur avec les informations fournies
        const newUser = await User.create({
            username,
            email,
            password: password,
            role: role || 'USER'
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while creating the user.'
        });
    }
};

/**
 * Mettre à jour un utilisateur existant.
 * 
 * @async
 * @function update
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @throws {Object} 403 - Interdit si l'utilisateur n'a pas la permission d'accéder à cette page.
 * @throws {Object} 404 - Non trouvé si l'utilisateur n'existe pas.
 * @throws {Object} 400 - Mauvaise requête si des champs requis sont invalides.
 * @returns {Object} 200 - Objet utilisateur mis à jour.
 * @returns {Object} 500 - Erreur interne du serveur si une erreur se produit lors de la mise à jour de l'utilisateur.
 */
exports.update = async (req, res) => {
    try {
        const userId = req.params.id;
        const datas = JSON.parse(req.body.datas);
        const { username, email, password, role } = datas;

        // Récupération de l'utilisateur cible
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Vérification des permissions
        if (req.auth.userRole === 'Admin' && user.role !== 'User') {
            return res.status(403).json({ message: "Les administrateurs ne peuvent modifier que les utilisateurs dotés du rôle User." });
        }

        // Mise à jour des informations de l'utilisateur
        if (username) {
            // Valider le username
            const usernameRegex = /^(?=.*[a-zA-Z])(?=^[A-Za-z0-9_-]{3,15}$)/; // Regex pour le username
            if (!usernameRegex.test(username)) {
                return res.status(400).json({
                    message: "Le nom d'utilisateur doit contenir entre 3 et 15 caractères, inclure au moins une lettre, et peut contenir des chiffres, des tirets et des tirets du bas."
                });
            }
            user.username = username;
        }
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        // Vérifier si l'utilisateur tente de créer un rôle autre que 'USER'
        if (role && role !== 'User') {
            // Vérifier si le rôle de l'utilisateur qui fait la requête est SUPER_ADMIN
            if (req.auth.userRole !== 'SuperAdmin') {
                return res.status(403).json({ message: "Seul le SUPER_ADMIN peut attribuer des rôles autres que User" });
            }
        }
        if (role) user.role = role;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while updating the user.' });
    }
};

/**
 * Supprimer un utilisateur existant.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @throws {Object} 403 - Interdit si l'utilisateur n'a pas la permission de supprimer un utilisateur.
 * @throws {Object} 404 - Non trouvé si l'utilisateur n'existe pas.
 * @returns {Object} 200 - Message de succès indiquant que l'utilisateur a été supprimé.
 * @returns {Object} 500 - Erreur interne du serveur si une erreur se produit lors de la suppression de l'utilisateur.
 */
exports.delete = async (req, res) => {
    try {
        const userId = req.params.id;

        // Récupération de l'utilisateur cible
        const user = await User.findOne({ where: { id: userId } });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Vérification des permissions
        if (req.auth.userRole === 'Admin' && user.role !== 'User') {
            return res.status(403).json({ message: "Les administrateurs ne peuvent supprimer que les utilisateurs dotés du rôle User." });
        }

        await user.destroy();

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message || 'An error occurred while deleting the user.' });
    }
};