const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const generateRoute = require("./routes/generate");

const app = express();

app.use(cors());
app.use(express.json());

// ===== DEBUG ENV (VERY IMPORTANT) =====
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_ANON_KEY EXISTS:", !!process.env.SUPABASE_ANON_KEY);

// ===== SUPABASE INIT (SAFE) =====
let supabase = null;

if (
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_URL.startsWith("https://") &&
  process.env.SUPABASE_ANON_KEY
) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  console.log("✅ Supabase client initialized");
} else {
  console.log("❌ Supabase NOT initialized (check env vars)");
}

app.locals.supabase = supabase;

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("AI Email Generator Backend is running");
});

app.get("/test-supabase", async (req, res) => {
  if (!req.app.locals.supabase) {
    return res.status(500).json({
      error: "Supabase not initialized. Check environment variables."
    });
  }

  const { data, error } = await req.app.locals.supabase
    .from("emails")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Supabase connected successfully", data });
});

app.use("/api/generate", generateRoute);

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
