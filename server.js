console.log("start express");

const express = require('express');
const app = express(); 
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.use(express.static('static'));

//const socket = require('socket.io')(5000)
//const io = socket(server)

const io = require('socket.io')(5000)


io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)
  console.log("socket connection");



  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})