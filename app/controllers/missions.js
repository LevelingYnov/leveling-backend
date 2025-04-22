const { User, UserMission, Mission, Difficulty, Inventorie, Item, InventorieItems, Defi } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');
const { addItem } = require('./inventories');
const { Event } = require('../models');
const { MissionsDifficulty } = require('../models');

exports.assignMissionToUser = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const user = await User.findByPk(userId);
        const { missionType, defiId } = req.body;

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur a déjà une mission en cours
        const existingMission = await UserMission.findOne({
            where: {
                fk_users: userId,
                status: null
            }
        });

        let mission;
        let defi;

        if (missionType === "defi") {
            defi = await Defi.findByPk(defiId);
 
            if (!defi) {
                return res.status(404).json({ message: "Défi introuvable" });
            }
            mission = await Mission.findByPk(defi.fk_mission);
        } else {
            if (existingMission) {
                return res.status(400).json({ message: 'Une mission est déjà en cours.' });
            }

            const missions = await Mission.findAll({
                where: {
                    status: missionType,
                    points: { [Op.lte]: user.points }
                }
            });

            if (missions.length === 0) {
                return res.status(400).json({ message: 'Aucune mission disponible' });
            }

            mission = missions[Math.floor(Math.random() * missions.length)];
        }

        if (!mission) {
            return res.status(404).json({ message: "Aucune mission trouvée." });
        }

        const missionDifficulty = await MissionsDifficulty.findOne({
            where: { fk_missions: mission.id },
            include: { model: Difficulty, as: 'difficulty' }
        });

        if (!missionDifficulty || !missionDifficulty.difficulty) {
            return res.status(400).json({ message: 'Difficulté non définie pour cette mission.' });
        }

        if (missionType === "defi") {
            // Créer la mission pour l'utilisateur 1
            await UserMission.create({
                fk_users: defi.fk_user1, // Utilisateur 1 du défi
                fk_missions: mission.id,
                fk_difficulty: missionDifficulty.difficulty.id,
                starttime: new Date(),
                status: null
            });

            // Créer la mission pour l'utilisateur 2
            await UserMission.create({
                fk_users: defi.fk_user2, // Utilisateur 2 du défi
                fk_missions: mission.id,
                fk_difficulty: missionDifficulty.difficulty.id,
                starttime: new Date(),
                status: null
            });

            res.status(201).json({
                message: `Défi créé avec succès, prêt à être joué.`,
                mission,
                difficulty: missionDifficulty.difficulty
            });
        } else {
            // Créer une nouvelle entrée dans UserMission pour assigner cette mission à l'utilisateur
            await UserMission.create({
                fk_users: userId,
                fk_missions: mission.id,
                fk_difficulty: missionDifficulty.difficulty.id,
                starttime: new Date(),
                status: null
            });

            res.status(201).json({
                message: `Mission de type ${missionType} assignée avec succès`,
                mission: mission,
                difficulty: {
                    id: missionDifficulty.difficulty.id,
                    name: missionDifficulty.difficulty.name,
                    multiplicator: missionDifficulty.difficulty.multiplicator
                }
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.triggerMissionFromEvent = async (req, res) => {
    try {
        const userId = req.auth.userId; // Récupérer l'utilisateur connecté via le JWT
        const { event_type } = req.body;

        if (!event_type) {
            return res.status(400).json({ message: 'Le type d\'événement est obligatoire.' });
        }

        // Trouver l'événement associé à l'utilisateur et au type d'événement (MISSION ou PENALITY)
        const event = await Event.findOne({
            where: {
                id_users: userId,
                event_type,
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Aucun événement valide trouvé pour cet utilisateur.' });
        }

        let missionType = event_type === 'PENALITY' ? 'penality' : 'quest';

        req.body.missionType = missionType;

        await exports.assignMissionToUser(req, res);
    } catch (error) {
        console.error('Erreur dans le déclenchement des missions à partir des événements :', error.message);
        res.status(500).json({ error: error.message });
    }
};


exports.checkMissionStatus = async (req, res) => {
    try {
        const userId = req.auth.userId; // ID de l'utilisateur connecté
        const userMissionId = req.params.id; // ID de la mission de l'utilisateur

        // Récupérer la mission de l'utilisateur avec la mission et la difficulté associées
        const userMission = await UserMission.findByPk(userMissionId, {
            include: ['mission', 'difficulty']
        });

        if (!userMission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }

        if (userMission.fk_users !== userId) {
            return res.status(403).json({ message: 'Cette mission ne vous appartient pas.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const { mission, difficulty, status, starttime } = userMission;
        const now = new Date();
        const elapsedTime = (now - new Date(starttime)) / 1000; // Temps écoulé en secondes

        if (status !== null) {
            return res.status(200).json({ message: 'Mission déjà vérifiée.', status });
        }

        let newPoints = user.points;

        if (elapsedTime > mission.limit_time || elapsedTime < mission.minimum_time) {
            await userMission.update({ status: 'FAILED' });

            newPoints -= Math.floor(mission.points / 2);
            await user.update({ points: newPoints });

            const inventoryDeletionMessage = await require('./inventories').deleteUserInventoryIfNoPoints(userId);

            if (mission.status !== 'penality') {
                req.body.event_type = 'PENALITY';
                await exports.triggerMissionFromEvent(req, res);
                return;
            }

            return res.status(200).json({
                message: 'Mission échouée',
                status: 'FAILED',
                pointsLost: Math.floor(mission.points / 2),
                totalPoints: newPoints,
                inventoryUpdate: inventoryDeletionMessage
            });
        } else if (elapsedTime >= mission.minimum_time) {
            await userMission.update({ status: 'PASSED' });

            const pointsEarned = mission.points * difficulty.multiplicator;
            newPoints += pointsEarned;

            await user.update({ points: newPoints });

            let droppedItemMessage = null;

            if (req.droppedItem) {
                const droppedItem = req.droppedItem;
                const fk_items = droppedItem.id;

                // Ajouter l'item à l'inventaire de l'utilisateur
                let inventory = await Inventorie.findOne({ where: { fk_user: userId } });
                if (!inventory) {
                    inventory = await Inventorie.create({ fk_user: userId });
                }

                let inventoryItem = await InventorieItems.findOne({
                    where: {
                        fk_inventory: inventory.id,
                        fk_item: fk_items
                    }
                });

                if (inventoryItem) {
                    inventoryItem.quantity += 1;
                    await inventoryItem.save();
                    droppedItemMessage = `Quantité de l'item '${droppedItem.name}' mise à jour.`;
                } else {
                    await inventory.addItem(droppedItem);
                    droppedItemMessage = `Item '${droppedItem.name}' ajouté à l'inventaire.`;
                }
            }

            return res.status(200).json({
                message: 'Mission réussie',
                status: 'PASSED',
                pointsEarned,
                totalPoints: newPoints,
                droppedItem: req.droppedItem ? req.droppedItem.name : null,
                inventoryUpdate: droppedItemMessage
            });
        }

        return res.status(200).json({ message: 'Mission en cours, pas encore vérifiée.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.logsUserMission = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const userMissions = await UserMission.findAll({
            where: {
                fk_users: userId,
                status: { [Op.not]: null } // Filtrer uniquement celles qui ont un statut (PASSED ou FAILED)
            },
            include: ['mission'], // Inclure les informations de la mission
            order: [['starttime', 'DESC']] // Trier par date de début, de la plus récente à la plus ancienne
        });

        if (userMissions.length === 0) {
            return res.status(404).json({ message: 'Aucune mission effectuée pour cet utilisateur.' });
        }

        res.status(200).json({
            message: 'Missions effectuées récupérées avec succès.',
            data: userMissions.map(um => ({
                missionName: um.mission.name,
                description: um.mission.description,
                points: um.mission.points,
                status: um.status,
                starttime: um.starttime,
                endtime: um.endtime
            }))
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.read = async (req, res) => {
    try {
        const missionId = req.params.id; // ID de la mission passé en paramètre

        // Récupérer la mission via son ID
        const mission = await Mission.findByPk(missionId);

        // Vérifier si la mission existe
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }

        // Retourner les détails de la mission
        res.status(200).json({ mission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readAll = async (req, res) => {
    try {
        const missions = await Mission.findAll();

        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, description, points, status, minimum_time, limit_time, difficultyId } = req.body;

        if (!name || !description || !points || !status || !minimum_time || !limit_time || !difficultyId) {
            return res.status(400).json({ message: 'Toutes les informations de la mission doivent être fournies.' });
        }

        // Vérifier si la difficulté existe
        const difficulty = await Difficulty.findByPk(difficultyId);

        if (!difficulty) {
            return res.status(400).json({ message: 'Difficulté non trouvée.' });
        }

        const existingMission = await Mission.findOne({ where: { name, status } });

        if (existingMission) {
            return res.status(400).json({ message: 'Une mission avec ce nom et ce statut existe déjà.' });
        }

        // Créer une nouvelle mission
        const newMission = await Mission.create({
            name,
            description,
            points,
            status,
            minimum_time,
            limit_time
        });

        // Associer la mission à la difficulté
        await MissionsDifficulty.create({
            fk_missions: newMission.id,
            fk_difficulty: difficultyId
        });

        res.status(201).json({ message: 'Mission créée avec succès', mission: newMission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const missionId = req.params.id;
        const { name, description, points, status, minimum_time, limit_time } = req.body;

        const mission = await Mission.findByPk(missionId);

        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }

        await mission.update({
            name,
            description,
            points,
            status,
            minimum_time,
            limit_time
        });

        res.status(200).json({ message: 'Mission mise à jour avec succès', mission });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.delete = async (req, res) => {
    try {
        const missionId = req.params.id;

        // Trouver la mission
        const mission = await Mission.findByPk(missionId);

        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée.' });
        }

        // Supprimer la mission
        await mission.destroy();

        res.status(200).json({ message: 'Mission supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};