// importing packages...
const express = require('express');
const path = require('path');
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//importing local package...
const indexRoute = require(path.join(__dirname, 'routes/index'));
const loginPage = require('./routes/login');
const registerPage = require('./routes/register');

//initating express...
const app = express();

mongoose
  .connect('mongodb://localhost:27017/DiscussionApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('database connected');
  })
  .catch((err) => {
    console.log(err);
  });

// listening on localhost:3000
const server = app.listen(3000);
const io = socket(server);

let clients = 0;
const users = {};
io.on('connection', (socket) => {
  console.log('new connection = ' + socket.id);

  //new client
  socket.on('NewClient', (name) => {
    if (clients < 7) {
      if (clients === 3) {
        socket.emit('CreatePeer');
      }
      users[socket.id] = name;
      socket.broadcast.emit('user-connected', name);
    } else {
      socket.emit('SessionActive');
    }
    clients++;
  });

  socket.on('Offer', (offer) => {
    socket.broadcast.emit('BackOffer', offer);
  });
  socket.on('Answer', (answer) => {
    socket.broadcast.emit('BackAnswer', answer);
  });

  socket.on('send-chat-message', (message) => {
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    if (clients > 0) {
      if (clients <= 3) {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        console.log(users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('Disconnect');
      }
      clients--;
    }

    //console.log(clients);
  });

  //white board
  socket.on('path', (paths) => {
    socket.broadcast.emit('mouse', paths);
    //console.log(paths);
  });
});

// configuring view engine...
app.set('view engine', 'ejs');
app.set('views', 'views');

//configuring bodyParser...
app.use(bodyParser.urlencoded({ extended: false }));

// configuring public folder...
app.use(express.static(path.join(__dirname, 'public')));

// routes...
app.use('/home', indexRoute);
app.use('/register', registerPage);
app.use('/', loginPage);
