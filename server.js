// server.js
const express = require("express");
const path = require("path");
const app = express();

// 1) Serve a static "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 2) Simple test route
app.get("/test", (req, res) => {
  res.send("Server says: Hello!");
});

// 3) Start listening
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
