// require express
var express = require("express");
// path module -- try to figure out where and why we use this
var path = require("path");

// create the express app
var app = express();

//Server Variables
var users = {};
var messages = [];
var count = 0;

// static content
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
 res.render("index");
})


// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

//Tell the socket var to listen to the server
var io = require('socket.io').listen(server);
//

io.sockets.on('connection', function(socket){
    socket.on('new_user', function(data){
        console.log(socket.id);
        users[socket.id] = data;

        console.log(users[socket.id]);
        io.emit('welcome_user', messages);
    })
    socket.on('disconnect', function(){
        console.log('User ' + users[socket.id] + ' has left the chat room.')
        io.emit('update_chat', users[socket.id] + " has disconnected");
        delete users[socket.id];

    })
    socket.on('send_message', function(message){
        console.log(socket.id + " " + message);
        messages[count] = users[socket.id] + ': ' + message;
        console.log(messages[count]);
        io.emit('update_chat', messages[count]);
        count += 1;

    })

})
