const configSocket = (app, data, attachSockets) => {
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        attachSockets(io, socket, data);
    });

    return server;
};

module.exports = configSocket;