const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ CORRECT MODEL
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({
      success: true,
      email: response,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      error: "Gemini generation failed",
      details: error.message,
    });
  }
});

module.exports = router;
