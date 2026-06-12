const express = require("express");
const router = express.Router();
const { createResource, listResources } = require("../controllers/resourceController");

router.post("/create-resource", createResource);
router.get("/", listResources);

module.exports = router;
