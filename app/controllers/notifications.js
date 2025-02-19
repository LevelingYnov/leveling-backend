const { User, Notifications } = require('../models');

exports.read = async (req, res) => {
    try {
       
        res.status(200).json({ message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur" });
    }
};

exports.readAll = async (req, res) => {
    try {
       
        res.status(200).json({ message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur" });
    }
};

exports.create = async (req, res) => {
    try {
       
        res.status(200).json({ message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur" });
    }
};

exports.update = async (req, res) => {
    try {
       
        res.status(200).json({ message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur" });
    }
};

exports.delete = async (req, res) => {
    try {
       
        res.status(200).json({ message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur" });
    }
};