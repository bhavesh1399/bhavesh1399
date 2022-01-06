require('dotenv').config()
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    //cross-origin resource sharing (restricts cross-origin HTTP reauests with other servers)
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT
io.on("connection", (socket) => {
  //socket.on listens for specific events to collect data

  socket.emit("me", socket.id); //socket.emit Creates events to send data

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded"); //broadcast use for sending message to client
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
        signal: data.signalData,
        from: data.from,
        name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(port, () => console.log(`server is running on port ${port}`));
