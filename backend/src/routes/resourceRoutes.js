const express = require("express");
const router = express.Router();
const { createResource } = require("../controllers/resourceController");

router.post("/create-resource", createResource);

module.exports = router;
