// const express = require("express");
// const http  = require("http");
// const path = require("path");
// const { Server } = require("socket.io");

// const app = express();
// const server =http.createServer(app);
// const io = new Server(server);

// //socket.io
// io.on("connection", (socket) => {
//     socket.on("user-message", (message) => {
//         // console.log(`Message: ${msg}`);
//         io.emit("message", message);
//     });
// });
// app.use(express.static(path.resolve("./public")));
// app.get('/',(req,res)=>{
//     return res.sendFile("/public/index.html")
// })
// server.listen(9000,()=>console.log(`Server Started at PORT: 9000`));