const { Class } = require('../../models'); // Assurez-vous que le modèle Item est correctement importé

// Récupérer tous les items
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        res.status(200).json(Class);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des classes.', error });
    }
};

// Récupérer un item par son ID
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