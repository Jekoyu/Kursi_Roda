const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();

// Get all route files in the directory
const routeFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".route.js"));

// Import all route files
routeFiles.forEach((file) => {
  const route = require(path.join(__dirname, file));
  router.use("/", route);
});

module.exports = router;
