var jwt				= require('jsonwebtoken');
var config		    = require('./config');
//var COLLECTION_NAME = "log";
//var Collection	= require('./models/model')[COLLECTION_NAME];
var playerSockets = [];

class SocketHandler {
    constructor(io){
        this.io = io;
    }
    handshake(){
        var io = this.io;
        io.use(function(socket, next) {
            var token = socket.handshake.query.token;
            if(!token) {
                console.log("Socket refused : token missing");
                return null;
            }
            var decoded = jwt.decode(token, config.secret);
            if(!decoded){
                console.log("Socket refused : wrong token");
                return null;
            }
            var login = decoded._doc.login;
            if(playerSockets[login] && io.sockets.connected[playerSockets[login]])
                io.sockets.connected[playerSockets[login]].disconnect();
            playerSockets[login] = socket.id;
            socket.login = login;
            return next();
        });
    }
    start(){
        var events = ['picture', 'text', 'switch', 'battery', 'playlist', 'player', 'light', 'mood', 'mode'];
        this.handshake();
        var io = this.io;
        io.on('connection', function(socket){
            console.log("++++ Player", socket.login, "connected ++++");
            for (var event of events) {
                socket.on(event, function (data) {
                    io.emit(data);
                });
            }
            socket.on('disconnect', function (){
                console.log("++++ Player", socket.login, "disconnect ++++");
            });
        });
    }
}

module.exports = SocketHandler;