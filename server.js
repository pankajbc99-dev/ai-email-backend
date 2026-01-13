const express = require("express");
const cors = require("cors");
require("dotenv").config();

const generateRoute = require("./routes/generate");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/generate", generateRoute);

app.get("/", (req, res) => {
  res.send("AI Email Generator Backend is Running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
