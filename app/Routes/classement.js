const express = require('express');
const router = express();
const classementCtrl = require("../controllers/classement.js");

router.post('/', classementCtrl.refresh);
router.get("/", classementCtrl.readAll);
router.get("/:id", classementCtrl.read);

module.exports = router;