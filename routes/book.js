var express = require("express");
var router = express.Router();
const validate = require("../middlewares/validate");
const { Book, bookSchema } = require("../models/book");

router.get("/", async function (req, res, next) {
  const books = await Book.find();
  res.json(books);
});

router.post("/", validate(bookSchema), async function (req, res, next) {
  const { title, author, genre, price } = req.body;
  const book = new Book({ title, author, genre, price, available: true });
  const newBook = await book.save();
  res.json(newBook);
});

router.delete("/:id", async function (req, res, next) {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  res.json(deletedBook);
});

router.put("/edit/:id", validate(bookSchema), async function (req, res, next) {
  const { id } = req.params;
  const oldBook = await Book.findByIdAndUpdate(id, {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    price: req.body.price,
  });
  res.send(oldBook.title + " has been updated !");
});

router.get("/findByGenre/:genre", async function (req, res, next) {
  const books = await Book.find({ genre: req.params.genre });
  res.json(books);
});

router.put("/buyWithDiscount/:id", async function (req, res, next) {
  const { id } = req.params;
  const { discountPercentage } = req.body; 
  const book = await Book.findById(id);

  if (!book.available) {
    return res.json({ message: "Book non disponible pour achat." });
  }
  const newPrice = book.price - (book.price * (discountPercentage / 100));
  book.price = newPrice;
  book.available = false;
  await book.save();
  res.json(book);
});

router.get('/availableBooks', async (req, res,next) => {
  try {
    const availableBooks = await Book.find({available:true})
    res.json({ count: availableBooks });
  } catch (error) {
    res.json({ message: 'Erreur de reception book', error });
  }
})

router.get("/getAvailableBooks", (req, res,next) => {
  res.render("books");
});


module.exports = router;
