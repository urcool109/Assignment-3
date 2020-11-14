var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

const { text } = require('express');

//allows for use of moment from npm library
const moment = require('moment');

//array of chat history
const chatLog = [];

//function that replaces text with unicode for respective emojis
//returns a messages user, text, and time
function messageData(user, text){
  text = text.replace(':)', '\uD83D\uDE00')
  text = text.replace(':(', '\uD83D\uDE41')
  text = text.replace(':o', '\uD83D\uDE2E')
  return{
    user, 
    text,
    time: moment().format('h:mm a')
  }
}



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//on connection, sets var to socket.id, emits chatlog (chat history), and emits userJoin
io.on('connection', function(socket){ 
  let uniqueUser = socket.id; 
  socket.emit('history', chatLog);
  console.log('a user has connected');
  console.table(uniqueUser);
  io.emit('userJoin', uniqueUser);

//chat message emit updated with added info from messageData function
  socket.on('chat message', function(msg){
    io.emit('chat message', messageData(uniqueUser, msg));
    chatLog.push(messageData(uniqueUser, msg));
    console.table(chatLog);
  });

  //function on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('userLeft', uniqueUser);
  });

});



http.listen(port, function(){
  console.log('listening on *:' + port);
});


