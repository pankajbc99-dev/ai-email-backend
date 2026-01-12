const axios = require("axios");

exports.generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt missing" });
    }

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-base",
      {
        inputs: `Write a professional email:\n${prompt}`,
        parameters: {
          max_new_tokens: 200
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

    const output =
      response.data?.[0]?.generated_text || "No output generated";

    res.json({ email: output });
  } catch (error) {
    console.error("HF ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
};
