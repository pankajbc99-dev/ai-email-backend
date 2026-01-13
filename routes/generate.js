const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 300
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 60000
      }
    );

    res.json({
      generatedText: hfResponse.data[0]?.generated_text || "No output"
    });

  } catch (err) {
    console.error("HF ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Hugging Face generation failed",
      hf: err.response?.data || err.message
    });
  }
});

module.exports = router;
