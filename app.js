const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
const socketioJwt = require('socketio-jwt');



// Connect to mongo
mongo.connect('mongodb://127.0.0.1/component', function (err, db) {
    if (err) {
        throw err;
    }

    console.log('MongoDB connected...');

    // Connect to Socket.io
    client.on('connection', socketioJwt.authorize({
        secret: '123',
        timeout: 15000 //15 segundos para enviar el mensaje de autenticación
    })).on('authenticated', function (socket) {
        let chat = db.collection('componentes');

        // Handle input events
        socket.on('input', function (data) {
            console.log(data);
            let name = data.name;
            let message = data.message;

            // Check for name and message

            // Insert message
            chat.insert({ name: name, message: message }, function () {
                client.emit('output', [data]); 
            });

        });

        console.log('hello! ' + socket.decoded_token.name);
    });


});
