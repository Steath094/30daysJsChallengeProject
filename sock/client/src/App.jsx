import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import {Container, Typography, TextField ,Button,Box, Stack} from "@mui/material"
function App() {
  const socket = useMemo(()=>{
    return io("http://localhost:3000/")
  },[])
  const [messages,setMessages] = useState([]);
  
  const [message,setMessage] = useState("");
  const [room,setRoom] = useState("");
  const [socketId,setSocketID] = useState("");
  const [roomName,setRoomName] = useState("");
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    socket.emit("message", {message,room});

    setMessage("");
  }
  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName);
    setRoomName("");
  }
  useEffect(()=>{
    socket.on("connect",()=>{
      setSocketID(socket.id)
      console.log("connected"+ socket.id);
    })
    socket.on("welcome",(s)=>{
      console.log(s);

    })
    socket.on("recieve-message",(data)=>{
      console.log(data);
      setMessages((messages)=>[...messages,data])
    })
    return ()=>{
      socket.disconnect();
    }
  },[])
  return (
    <Container>
      {/* <Typography variant='h1' component="div" gutterBottom>
      Welcome to Socket.io
      </Typography> */}
      <Box sx={{ height: 100}} />
      <Typography variant='h6' component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
      <TextField value={roomName} onChange={e=>setRoomName(e.target.value)} id='outlined-basic' label="Room name" variant="outlined" />
      <Button type='submit' variant="contained" color="primary">Join</Button>
      </form>
    <form onSubmit={handleSubmit}>
      <TextField value={message} onChange={e=>setMessage(e.target.value)} id='outlined-basic' label="Message" variant="outlined" />
      <TextField value={room} onChange={e=>setRoom(e.target.value)} id='outlined-basic' label="Room" variant="outlined" />
      <Button type='submit' variant="contained" color="primary">Send</Button>
    </form>
      <Stack>
        {messages.map((m,i)=>(
          <Typography key={i} variant='h6' component="div" gutterBottom>
            {m}
          </Typography>
        ))
          
        }
      </Stack>


    </Container>
  )
}

export default App
