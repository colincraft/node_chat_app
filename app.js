var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames = [];

// app.set("view engine", "ejs")

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// all socket code goes inside io.on
io.on('connection', function(socket){
  socket.on('new user', function(data, callback){
    if (usernames.indexOf(data) != -1){
      callback(false);
    } else {
      callback(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });

  function updateUsernames(){
    io.emit('usernames', usernames);
  }

  socket.on('chat message', function(data){
    io.emit('new message', {msg: data, user : socket.username});
  });

  socket.on('disconnect', function(data){
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});