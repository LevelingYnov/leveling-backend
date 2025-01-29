const { Class, UserClass, User } = require('../models');

/**
 * @module ClassController
 */

// Créer une classe
exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Vérifier si une classe avec le même nom existe déjà
        const existingClass = await Class.findOne({ where: { name } });

        if (existingClass) {
            return res.status(400).json({ message: "Une classe avec ce nom existe déjà." });
        }

        // Créer la nouvelle classe
        const newClass = await Class.create({ name, description });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la création de la classe." });
    }
};

// Lire une classe par ID
exports.read = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const userClass = await UserClass.findOne({ where: { fk_users: userId }, include: { model: Class, as: 'class' } });
        
        if (!userClass) return res.status(404).json({ message: "Classe non trouvée" });
        res.status(200).json(userClass.class);
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la récupération de la classe de l'utilisateur." });
    }
};

// Lire toutes les classes
exports.readAll = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la récupération des classes." });
    }
};

// Mettre à jour une classe
exports.update = async (req, res) => {
    try {
        // Vérifier si une autre classe existe avec le même nom, mais un ID différent
        if (req.body.name) {
            const existingClass = await Class.findOne({
                where: { 
                    name: req.body.name 
                }
            });

            // Si une autre classe existe et que ce n'est pas la classe actuelle
            if (existingClass && existingClass.id !== req.params.id) {
                return res.status(400).json({ message: "Une classe avec ce nom existe déjà." });
            }
        }

        // Mettre à jour la classe si le nom est unique
        const updated = await Class.update(req.body, { where: { id: req.params.id } });
        
        if (!updated[0]) {
            return res.status(404).json({ message: "Classe non trouvée" });
        }
        
        res.status(200).json({ message: "Classe mise à jour avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la mise à jour de la classe." });
    }
};

// Supprimer une classe
exports.delete = async (req, res) => {
    try {
        const deleted = await Class.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: "Classe non trouvée" });
        res.status(200).json({ message: "Classe supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de la suppression de la classe." });
    }
};

// Permet à l'utilisateur de choisir sa classe
exports.assignClass = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const fk_classes = req.params.classId;

        const existingClass = await Class.findByPk(fk_classes);

        if (!existingClass) {
            return res.status(404).json({ message: "Classe non trouvée." });
        }

        // Vérifier si l'utilisateur a déjà une classe
        const existingUserClass = await UserClass.findOne({ where: { fk_users: userId } });

        if (existingUserClass) {
            return res.status(400).json({ message: "L'utilisateur appartient déjà à une classe." });
        }

        // Assigner la nouvelle classe
        const newUserClass = await UserClass.create({ fk_users: userId, fk_classes });
        res.status(201).json(newUserClass);
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de l'auto-assignation de l'utilisateur à la classe." });
    }
};

// Ajouter un utilisateur à une classe (Admin)
exports.assignUserToClass = async (req, res) => {
    try {
        const { fk_users, fk_classes } = req.body;

        const existingClass = await Class.findByPk(fk_classes);

        if (!existingClass) {
            return res.status(404).json({ message: "Classe non trouvée." });
        }

        // Vérifier si l'utilisateur a déjà une classe
        const existingUserClass = await UserClass.findOne({ where: { fk_users } });

        if (existingUserClass) {
            return res.status(400).json({ message: "Cet utilisateur appartient déjà à une classe." });
        }

        // Assigner la classe à l'utilisateur
        const newUserClass = await UserClass.create({ fk_users, fk_classes });
        res.status(201).json(newUserClass);
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors de l'assignation de l'utilisateur à la classe." });
    }
};


// Récupérer les utilisateurs d'une classe
// Récupérer les utilisateurs d'une classe
exports.getUsersByClass = async (req, res) => {
    try {
        const users = await UserClass.findAll({ 
            where: { fk_classes: req.params.classId },
            include: { model: User, as: 'user' }
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé pour cette classe." });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error(error);  // Afficher l'erreur pour faciliter le débogage
        res.status(500).json({ message: error.message || "Erreur lors de la récupération des utilisateurs de la classe." });
    }
};


// Retirer un utilisateur d'une classe
exports.removeUserFromClass = async (req, res) => {
    try {
        const userClass = await UserClass.findOne({ 
            where: { fk_users: req.params.userId, fk_classes: req.params.classId } 
        });

        if (!userClass) {
            return res.status(404).json({ message: "L'utilisateur n'est pas assigné à cette classe." });
        }

        await userClass.destroy();
        res.status(200).json({ message: "Utilisateur retiré de la classe avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message || "Erreur lors du retrait de l'utilisateur de la classe." });
    }
};