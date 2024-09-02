const socket = io();
const sendBtn = document.getElementById('sendButton')
const messageInput = document.getElementById("message")
const allMessages = document.getElementById("messages")


socket.on('message',(msg)=>{
    const p = document.createElement('p')
    p.innerText = msg;
    allMessages.appendChild(p);
})
sendBtn.addEventListener('click', () => {
    if(messageInput.value !== '') {
        socket.emit('user-message', messageInput.value)
        messageInput.value = ''
    }
})