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
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText =
      response.data.choices?.[0]?.message?.content || "No response";

    res.json({ generatedText });
  } catch (err) {
    console.error("HF ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "Hugging Face generation failed",
      hf: err.response?.data || err.message
    });
  }
});

module.exports = router;
