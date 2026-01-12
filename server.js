const express = require("express");
const cors = require("cors");
require("dotenv").config();

const generateRoute = require("./routes/generate");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Email Generator Backend is running");
});

app.use("/api/generate", generateRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
