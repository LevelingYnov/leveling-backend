const { Class } = require('../../models'); // Assurez-vous que le modèle Item est correctement importé

// Récupérer toutes les classes
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.status(200).json(Class);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des classes.', error });
    }
};

// Récupérer une classe par son ID
exports.getClassById = async (req, res) => {
    const { id } = req.params;
    try {
        const classe = await Class.findByPk(id);
        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvé.' });
        }
        res.status(200).json(classe);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la classe.', error });
    }
};

// Créer une nouvelle classe
exports.createClass = async (req, res) => {
    const { name, type } = req.body;
    try {
        const newClass = await Class.create({ name, type });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création de la classe.', error });
    }
};

// Mettre à jour une classe existant
exports.updateClass = async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    try {
        const classe = await Class.findByPk(id);
        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvé.' });
        }
        await classe.update({ name, bonus });
        res.status(200).json(classe);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la classe.', error });
    }
};

// Supprimer une classe
exports.deleteClass = async (req, res) => {
    const { id } = req.params;
    try {
        const classe = await Class.findByPk(id);
        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvé.' });
        }
        await classe.destroy();
        res.status(200).json({ message: 'Classe supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la classe.', error });
    }
};