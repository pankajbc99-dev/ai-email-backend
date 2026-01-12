const axios = require("axios");

exports.generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        inputs: `Write a professional email:\n${prompt}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const output =
      response.data?.[0]?.generated_text ||
      response.data?.generated_text ||
      "No response generated";

    res.json({ email: output });
  } catch (error) {
    console.error("HF ERROR:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || error.message
    });
  }
};
