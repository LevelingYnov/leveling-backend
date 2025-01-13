const express = require('express');
const app = express();
const router = require("./app/Routes/index.js");
const path = require('path');


const db = require("./app/models/index.js");
db.sequelize
    .authenticate()
    .then(() => console.log("Database connected ..."))
    .catch((err) => console.log(err));

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", router);


//Item
const itemRoutes = require('./Routes/Item');
app.use(express.json());
app.use('/api', itemRoutes);

//Mission
const missionRoutes = require('./Routes/Mission');
app.use(express.json());
app.use('/api', missionRoutes);

//MissionsDifficulty
const missionsDifficultyRoutes = require('./Routes/MissionsDifficulty');
app.use(express.json());
app.use('/api', missionsDifficultyRoutes);

//Notification
const notificationRoutes = require('./Routes/Notification');
app.use(express.json());
app.use('/api', notificationRoutes);

//Pallier
const pallierRoutes = require('./Routes/Pallier');
app.use(express.json());
app.use('/api', pallierRoutes);

//PallierUser
const pallierUserRoutes = require('./Routes/PallierUser');
app.use(express.json());
app.use('/api', pallierUserRoutes);

//User
const userRoutes = require('./Routes/User');
app.use(express.json());
app.use('/api', userRoutes);

//UserClass
const userClassRoutes = require('./Routes/UserClass');
app.use(express.json());
app.use('/api', userClassRoutes);

//UserMission
const userMissionRoutes = require('./Routes/UserMission');
app.use(express.json());
app.use('/api', userMissionRoutes);


module.exports = app;