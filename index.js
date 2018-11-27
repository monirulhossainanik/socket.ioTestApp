let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let users = [];

app.get('/', (req, res) => {
    // res.send('<h1>Hello World</h1>');
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(Object.keys(io.sockets.connected).length);

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('Created', (data) => {
        // io.emit('Created', data);
        socket.broadcast.emit('Created', data);
    });

    socket.on('new-message', (message) => {
        socket.broadcast.emit('new-message', message);
    });

    socket.on('typing', (user) => {
        socket.broadcast.emit('typing', user);
    });

    socket.on('not-typing', (user) => {
        socket.broadcast.emit('not-typing', user);
    });

    socket.on('joining', (user) => {
        users.push(user);
        socket.broadcast.emit('joining', user);
        io.emit('current-user', users);
    });

    socket.on('leaving', (user) => {
        let index = -1;
        for (let i = 0; i < users.length && index < 0; i++) {
            if (users[i] === user)
                index = i;
        }
        if (index >= 0) {
            users.splice(index, 1);
            io.emit('leaving', user);
        }
        io.emit('current-user', users);
    });
});
