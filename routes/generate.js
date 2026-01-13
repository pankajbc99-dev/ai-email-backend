const express = require("express");
const axios = require("axios");

const router = express.Router();

/**
 * POST /api/generate
 * Body: { prompt: "write an email..." }
 */
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const hfResponse = await axios.post(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-large",
      {
        inputs: prompt
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      generatedText: hfResponse.data[0].generated_text
    });

  } catch (error) {
    console.error("hf error:", error.response?.data || error.message);

    res.status(500).json({
      error: "AI generation failed"
    });
  }
});

module.exports = router;
