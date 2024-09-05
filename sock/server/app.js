import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        // allowedHeaders: ["Content-Type", "Authorization"]
    }
})
app.get("/",(req,res)=>{
    res.send("Hello World");
})

io.on("connection", (socket) => {
    console.log("User connected");
    console.log("Id:"+socket.id);
    socket.on("message",({message,room})=>{
        console.log({message,room});
        io.to(room).emit("recieve-message",message);
        
    })
    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`user joined ${room}`);
        
        
    })
    socket.emit("welcome",`welcome to the server`);
    socket.broadcast.emit("welcome",`${socket.id} joined to the server`);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})