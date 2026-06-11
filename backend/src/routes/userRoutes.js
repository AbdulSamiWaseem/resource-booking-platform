const express = require("express");
const router = express.Router();
const { findOrCreateUser } = require("../controllers/userController");

router.post("/", findOrCreateUser);

module.exports = router;
