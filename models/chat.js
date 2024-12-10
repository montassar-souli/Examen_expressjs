const mongoose = require("mongoose");
const yup = require("yup");

const chat = new mongoose.Schema({
  id: String,
  username: String,
  messages: String,
});

const chatSchema = yup.object({
  body: yup.object({
    username: yup.string().required(),
   // messages: yup.array().of(yup.string()),
  }),
});

const Chat = mongoose.model("Chat", chat);
module.exports = { chatSchema, Chat };