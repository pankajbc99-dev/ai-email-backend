const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");
const generateRoute = require("./routes/generate");

const app = express();

/* =======================
   SUPABASE SETUP (HERE)
   ======================= */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Supabase environment variables missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Make supabase available in routes
app.locals.supabase = supabase;

/* ======================= */

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Email Generator Backend is running");
});

/* 🔍 TEST SUPABASE CONNECTION */
app.get("/test-supabase", async (req, res) => {
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
