const express = require("express");
const router = express.Router();
const { generateEmail } = require("../controllers/aiController");

router.get("/", (req, res) => {
  res.send("Generate API is working. Use POST request.");
});

router.post("/", generateEmail);

module.exports = router;
const express = require("express");
const router = express.Router();
const { generateEmail } = require("../controllers/aiController");

router.get("/", (req, res) => {
  res.send("Generate API is working. Use POST request.");
});

router.post("/", generateEmail);

module.exports = router;
