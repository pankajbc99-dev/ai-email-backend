exports.generateEmail = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // ✅ Get supabase from app.locals
    const supabase = req.app.locals.supabase;

    if (!supabase) {
      return res.status(500).json({
        error: "Supabase not initialized"
      });
    }

    // (AI logic will go here later)
    const generatedEmail = `Generated email for: ${prompt}`;

    // ✅ Save to Supabase
    const { error } = await supabase.from("emails").insert([
      {
        prompt: prompt,
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
    res.status(500).json({ error: err.message });
  }
};
