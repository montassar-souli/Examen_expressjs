const express = require("express");
const router = express.Router();
const { Chat } = require("../models/chat");

router.delete("/all", async (req, res, next) => {
  const deletedChat = await Chat.deleteMany();
  res.json(deletedChat);
});

router.get("/", async (req, res) => {
  const chat = await Chat.find();
  res.json(chat);
});

module.exports = router;
