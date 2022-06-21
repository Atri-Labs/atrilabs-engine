const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: "*" }));
const path = require("path");

app.use((req, res, next) => {
  console.log("rec");
  next();
});
app.get("/main.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "main.js"));
});

app.get("/251.js", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "dist", "251.js"));
});
const listener = app.listen(4003, "localhost", function () {
  console.log(
    "... port %d in %s mode",
    listener.address().port,
    listener.address().address
  );
});
