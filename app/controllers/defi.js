const { Defi, User, Mission, UserMission } = require('../models');
const { Sequelize } = require('sequelize');
const { assignMissionToUser } = require('./missions');

exports.create = async (req, res) => {
    try {
        const { code_defi } = req.body;
        const fk_user1 = req.auth.userId;

        // Vérifier si un défi avec ce code existe déjà
        let existingDefi = await Defi.findOne({
            where: {
                code_defi,
                status: { [Sequelize.Op.ne]: 'FINISHED' },
            }
        });

        if (!existingDefi) {
            // Sélectionner une mission aléatoire avec status "defi"
            const mission = await Mission.findOne({ where: { status: "defi" }, order: Sequelize.literal('rand()'), limit: 1 });

            if (!mission) {
                return res.status(404).json({ message: "Aucune mission disponible pour le défi." });
            }

            // Créer un nouveau défi avec uniquement user1
            const newDefi = await Defi.create({
                code_defi,
                fk_user1,
                fk_user2: null,
                fk_mission: mission.id,
                status: 'PENDING'
            });

            return res.status(201).json({
                message: "Défi en attente d'un deuxième joueur.",
                defi: newDefi
            });
        }

        // Vérifier si le défi est déjà complet
        if (existingDefi.fk_user2) {
            return res.status(400).json({ message: "Ce défi est déjà complet." });
        }

        // Vérifier que user1 ≠ user2
        if (existingDefi.fk_user1 === fk_user1) {
            return res.status(400).json({ message: "Vous êtes déjà inscrit à ce défi." });
        }

        // Ajouter le deuxième joueur au défi
        existingDefi.fk_user2 = fk_user1;
        await existingDefi.save();

        req.body.missionType = "defi";
        req.body.defiId = existingDefi.id;

        await existingDefi.update({ status: 'ACTIVE' });

        await assignMissionToUser(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.read = async (req, res) => {
    try {
        const { id } = req.params;
        const defi = await Defi.findByPk(id, {
            include: [
                { model: User, as: 'user1', attributes: ['id', 'username'] },
                { model: User, as: 'user2', attributes: ['id', 'username'] },
                { model: Mission, as: 'mission', attributes: ['id', 'name'] }
            ]
        });

        if (!defi) {
            return res.status(404).json({ message: "Défi non trouvé." });
        }

        res.status(200).json(defi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.checkDefiUsers = async (req, res) => { 
    try {
        const userId = req.auth.userId;
        const { defiId, userMissionId } = req.body;

        const defi = await Defi.findByPk(defiId);

        if (!defi) {
            return res.status(404).json({ message: 'Défi non trouvé.' });
        }

        if (![defi.fk_user1, defi.fk_user2].includes(userId)) {
            return res.status(403).json({ message: 'Accès interdit : vous ne faites pas partie de ce défi.' });
        }

        const userMission = await UserMission.findOne({
            where: { fk_missions: userMissionId, fk_users: userId },
            include: ['mission', 'difficulty']
        });

        if (!userMission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }

        const { mission, difficulty, starttime } = userMission;
        const now = new Date();
        const elapsedTime = (now - new Date(starttime)) / 1000;

        if (elapsedTime > mission.limit_time || elapsedTime < mission.minimum_time) {
            return res.status(200).json({ message: 'La mission ne peut pas encore être validée.' });
        }

        if (defi.winner !== null) {
            return res.status(200).json({ 
                message: defi.winner === userId ? 'Vous avez gagné le défi !' : 'Vous avez perdu le défi.',
                status: defi.winner === userId ? 'PASSED' : 'FAILED'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        let newPoints = user.points + mission.points * difficulty.multiplicator;
        await user.update({ points: newPoints });

        // 🔹 Vérifier si un gagnant existe déjà
        if (defi.winner === null) {
            // ✅ Le premier utilisateur à valider devient le gagnant
            await defi.update({ winner: userId, status: 'FINISHED' });

            await userMission.update({ status: 'PASSED' });

            // 🔹 Récupérer l'autre utilisateur et marquer sa mission comme échouée
            const loserId = userId === defi.fk_user1 ? defi.fk_user2 : defi.fk_user1;
            const loserMission = await UserMission.findOne({
                where: { fk_missions: userMissionId, fk_users: loserId }
            });

            if (loserMission) {
                await loserMission.update({ status: 'FAILED' });
            }
            
            const loserUser = await User.findByPk(loserId);
            if (loserUser) {
                await loserUser.update({ points: Math.max(0, loserUser.points - Math.floor(mission.points / 2)) });
            }

            return res.status(200).json({
                message: 'Vous avez gagné le défi !',
                status: 'PASSED',
                totalPoints: newPoints
            });
        } else {
            // Si un gagnant a déjà été défini, ce joueur a perdu
            await userMission.update({ status: 'FAILED' });

            return res.status(200).json({
                message: 'Vous avez perdu le défi.',
                status: 'FAILED',
                totalPoints: newPoints
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.auth.userId;

        // Vérifier que le défi existe
        const defi = await Defi.findByPk(id);
        if (!defi) {
            return res.status(404).json({ message: "Défi non trouvé." });
        }

        // Vérifier que le gagnant est bien l'un des deux joueurs
        if (![defi.fk_user1, defi.fk_user2].includes(userId)) {
            return res.status(400).json({ message: "Le joueur doit être l'un des deux utilisateurs du défi." });
        }

        req.body.defiId = id;
        req.body.userMissionId = defi.fk_mission;

        await exports.checkDefiUsers(req, res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const defi = await Defi.findByPk(id);
        if (!defi) {
            return res.status(404).json({ message: "Défi non trouvé." });
        }

        await defi.destroy();
        res.status(200).json({ message: "Défi supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};