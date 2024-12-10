const mongoose = require("mongoose");
const yup = require("yup");

const book = new mongoose.Schema({
  id: String,
  title: String,
  author: String,
  genre: String,
  price: Number,
  available: Boolean,
});

const bookSchema = yup.object({
  body: yup.object({
    title: yup.string().required(),
    author: yup.string().required(),
    genre: yup.string().required(),
    price: yup.number().required().positive(),
    available: yup.boolean(),
  }),
});

const Book = mongoose.model("Book", book);
module.exports = { Book, bookSchema };
