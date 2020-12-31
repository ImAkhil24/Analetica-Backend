const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/health", (req, res, next) => {
  res.json({ status: "UP" });
});

app.listen(3000, () => {
  console.log("listening to port 3000");
});
