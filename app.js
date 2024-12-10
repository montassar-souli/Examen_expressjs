const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const bookRoutes = require("./routes/book");
const chatRoutes = require("./routes/chat");
const { Book } = require("./models/book");
const { Chat } = require("./models/chat");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
//DB
const mongoose = require("mongoose");
const configDb = require("./config/db.json");
// Configurer Twig
app.set("view engine", "twig");
app.set("views", "./views");

app.use(bodyParser.json());
app.use("/books", bookRoutes);
app.use("/chat", chatRoutes);

//Books
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("availableBooks", async () => {
    const availableBooksCount = await Book.countDocuments({ available: true });
    socket.emit("availableBooks", availableBooksCount);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//Chat1
// io.on("connection", (socket) => {
//   const username = socket.handshake.query.username;  
//   io.emit("msg", username + " is connected");
//   socket.on("msg", (data) => {
//     io.emit("msg", username + " : " + data);
//   });
//   socket.on("disconnect", () => {
//     io.emit("msg", username + " disconnected");
//   });
// });

//Chat2
io.on('connection', (socket) => {
  console.log('A user connected');
  const username = socket.handshake.query.username;
  io.emit("new_connection", username + " is connected");
  // Send existing messages to the newly connected user
  Chat.find().then(messages => {
    socket.emit('load_messages', messages);
  });

  // Listen for new messages
  socket.on('new_message', (data) => {
    const { messages } = data;

    // Save message to database
    const message = new Chat({ username, messages });
    message.save().then(() => {
      // Broadcast the message to all connected users
      io.emit('new_message', { username, messages }); // Ensure the broadcasted message includes username and messages
    }).catch(err => console.error(err));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    io.emit("new_connection", username + " disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/getAvailableBooks", (req, res) => {
  res.render("books");
});
app.get("/chat", (req, res) => {
  res.render("chat");
});
app.get("/chatdb", (req, res) => {
  res.render("chatdb");
});

mongoose.connect(configDb.mongo.url);
