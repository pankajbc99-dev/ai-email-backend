const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.generateEmail = async (req, res) => {
  try {
    const { emailType, recipient, purpose, tone } = req.body;

    if (!emailType || !recipient || !purpose || !tone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const prompt = `
Write a ${tone} ${emailType}.
Recipient: ${recipient}
Purpose: ${purpose}
Limit: 150 words.
`;

    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 250,
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

    const generatedText =
      hfResponse.data?.[0]?.generated_text || "No response generated.";

    await supabase.from("email_logs").insert([
      { email_type: emailType }
    ]);

    res.json({
      success: true,
      email: generatedText
    });

  } catch (error) {
    console.error("Generation Error:", error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: "Failed to generate email. Please try again."
    });
  }
};
