const axios = require("axios");

exports.generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Supabase instance
    const supabase = req.app.locals.supabase;
    if (!supabase) {
      return res.status(500).json({ error: "Supabase not initialized" });
    }

    // 🔹 Hugging Face API call
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        inputs: `Write a professional email about: ${prompt}`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedEmail =
      hfResponse.data?.[0]?.generated_text || "No response generated";

    // 🔹 Save to Supabase
    const { error } = await supabase.from("emails").insert([
      {
        prompt,
        generated_email: generatedEmail
      }
    ]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      email: generatedEmail
    });

  } catch (err) {
    console.error("AI Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
