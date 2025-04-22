const { Defi, User, Mission, UserMission } = require("../models");
const { Sequelize } = require("sequelize");
const { assignMissionToUser } = require("./missions");

exports.create = async (req, res) => {
  try {
    const { code_defi } = req.body;
    const fk_user1 = req.auth.userId;

    const existingUserDefi = await Defi.findOne({
      where: {
        fk_user1: fk_user1,
        status: { [Sequelize.Op.ne]: "FINISHED" }
      }
    });

    if (existingUserDefi && existingUserDefi.code_defi !== code_defi) {
      return res.status(400).json({
        message: "Vous avez déjà un défi en cours. Terminez-le avant d'en créer un nouveau."
      });
    }

    // Vérifier si un défi avec ce code existe déjà
    let existingDefi = await Defi.findOne({
      where: {
        code_defi,
        status: { [Sequelize.Op.ne]: "FINISHED" },
      },
    });

    if (!existingDefi) {
      // Sélectionner une mission aléatoire avec status "defi"
      const mission = await Mission.findOne({
        where: { status: "defi" },
        order: Sequelize.literal("rand()"),
        limit: 1,
      });

      if (!mission) {
        return res
          .status(404)
          .json({ message: "Aucune mission disponible pour le défi." });
      }

      // Créer un nouveau défi avec uniquement user1
      const newDefi = await Defi.create({
        code_defi,
        fk_user1,
        fk_user2: null,
        fk_mission: mission.id,
        status: "PENDING",
      });

      return res.status(201).json({
        message: "Défi en attente d'un deuxième joueur.",
        defi: newDefi,
      });
    }

    // Vérifier si le défi est déjà complet
    if (existingDefi.fk_user2) {
      return res.status(400).json({ message: "Ce défi est déjà complet." });
    }

    // Vérifier que user1 ≠ user2
    if (existingDefi.fk_user1 === fk_user1) {
      return res
        .status(400)
        .json({ message: "Vous êtes déjà inscrit à ce défi." });
    }

    // Ajouter le deuxième joueur au défi
    existingDefi.fk_user2 = fk_user1;
    await existingDefi.save();

    req.body.missionType = "defi";
    req.body.defiId = existingDefi.id;

    await existingDefi.update({ status: "ACTIVE" });

    await assignMissionToUser(req, res);
  } catch (error) {
    console.error("Erreur lors de la création du défi :", error);
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors.map(e => e.message),
    });
  }
  res.status(500).json({ error: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const defi = await Defi.findByPk(id, {
      include: [
        { model: User, as: "user1", attributes: ["id", "username"] },
        { model: User, as: "user2", attributes: ["id", "username"] },
        { model: Mission, as: "mission", attributes: ["id", "name"] },
      ],
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
      return res.status(404).json({ message: "Défi non trouvé." });
    }

    if (![defi.fk_user1, defi.fk_user2].includes(userId)) {
      return res
        .status(403)
        .json({
          message: "Accès interdit : vous ne faites pas partie de ce défi.",
        });
    }

    const userMission = await UserMission.findOne({
      where: { fk_missions: userMissionId, fk_users: userId },
      include: ["mission", "difficulty"],
      raw: false,
    });

    if (!userMission) {
      return res.status(404).json({ message: "Mission non trouvée." });
    }

    const { mission, difficulty } = userMission;
    const now = new Date();
    const elapsedTime = (now - new Date(defi.createdAt)) / 1000;

    if (elapsedTime < mission.minimum_time) {
      return res
        .status(200)
        .json({ message: "La mission ne peut pas encore être validée." });
    }

    if (defi.winner !== null) {
      return res.status(200).json({
        message:
          defi.winner === userId
            ? "Vous avez gagné le défi !"
            : "Vous avez perdu le défi.",
        status: defi.winner === userId ? "PASSED" : "FAILED",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    let newPoints = user.points + mission.points * difficulty.multiplicator;
    await user.update({ points: newPoints });

    if (defi.winner === null) {
      const loserId = userId === defi.fk_user1 ? defi.fk_user2 : defi.fk_user1;

      // Mettre à jour les statuts des missions
      const winnerMission = await UserMission.findOne({
        where: {
          fk_users: userId,
          fk_missions: defi.fk_mission
        },
        order: [['id', 'DESC']] 
      });      

      const loserMission = await UserMission.findOne({
        where: {
          fk_users: loserId,
          fk_missions: userMissionId
        },
        order: [['id', 'DESC']]
      }); 

      if (winnerMission) {
        winnerMission.status = "PASSED";
        await winnerMission.save();
      }

      if (loserMission) {
        loserMission.status = "FAILED";
        await loserMission.save();
      }

      // Mettre à jour les points du perdant
      const loserUser = await User.findByPk(loserId);
      if (loserUser) {
        await loserUser.update({
          points: Math.max(
            0,
            loserUser.points - Math.floor(mission.points / 2)
          ),
        });
        await require("./inventories").deleteUserInventoryIfNoPoints(loserId);
      }

      await defi.update({ winner: userId, status: "FINISHED" });

      return res.status(200).json({
        message: "Vous avez gagné le défi !",
        status: "PASSED",
        totalPoints: newPoints,
      });
    }
  } catch (error) {
    console.error("Error updating mission status:", error);
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
      return res.status(400).json({
        message: "Le joueur doit être l'un des deux utilisateurs du défi.",
      });
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
