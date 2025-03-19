const multer = require("multer");
const fs = require('fs');

//On définit les extensions selon le mime type.
const MIME_TYPES = {
"image/jpg" : "jpg",
"image/jpeg" : "jpg",
"image/gif" : "gif",
"image/png" : "png",
"image/webp" : "webp",
"image/svg+xml": "svg"
};

/**
 * Crée le dossier de téléchargement s'il n'existe pas.
 *
 * @function
 */
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// On crée dynamiquement le dossier uploads s'il n'existe pas
const createDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };

// diskStorage => destination du fichier / générer un nom de fichier unique
const storage = multer.diskStorage({
     /**
     * Définit la destination de sauvegarde du fichier.
     *
     * @param {Object} req - L'objet de requête Express.
     * @param {Object} file - L'objet fichier.
     * @param {Function} callback - La fonction de rappel pour indiquer la destination.
     */
    destination: (req, file, callback) => {
        // Détecter le contexte de la route pour déterminer le dossier
        let folder = 'uploads';  // dossier par défaut

        if (req.baseUrl.includes('/auth') || req.baseUrl.includes('/account') || req.baseUrl.includes('/admin')) {
            folder = 'uploads/profiles/avatars';
        }

        createDirectory(folder);  // créer le dossier si nécessaire
        callback(null, folder);
    },
     /**
     * Définit le nom du fichier à sauvegarder.
     *
     * @param {Object} req - L'objet de requête Express.
     * @param {Object} file - L'objet fichier.
     * @param {Function} callback - La fonction de rappel pour indiquer le nom de fichier.
     */
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
        callback(null, uniqueName);

    },
});

// On exporte le module avec ces paramètres en précisant
// qu'on attend un champ "image"
module.exports = multer({storage: storage}).single("image");