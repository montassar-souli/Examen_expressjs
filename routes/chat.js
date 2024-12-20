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

router.get("/chat", (req, res) => {
  res.render("chat");
});

router.get("/chatdb", (req, res) => {
  res.render("chatdb");
});

module.exports = router;
