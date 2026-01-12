const express = require("express");
const router = express.Router();
const { generateEmail } = require("../controllers/aiController");

router.post("/", generateEmail);

module.exports = router;
