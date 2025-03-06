const express = require("express");
require("dotenv").config();
require("./database/mongo.connection");
const authRoutes = require("./route/auth.route");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});