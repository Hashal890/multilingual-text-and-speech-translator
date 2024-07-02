const express = require("express");
const giveTranslatedText = require("../controller/Translation.contoller");

const translationRouter = express.Router();

translationRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to my text and speech translator backend deployment!",
  });
});
translationRouter.post("/translate-text", giveTranslatedText);

module.exports = translationRouter;
