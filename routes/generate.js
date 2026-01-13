const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/HuggingFaceH4/zephyr-7b-beta",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      generatedText: response.data[0].generated_text
    });

  } catch (err) {
    console.error("hf error:", err.response?.data || err.message);
    res.status(500).json({ error: "Hugging Face generation failed" });
  }
});

module.exports = router;
