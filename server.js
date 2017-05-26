var http        = require('http');
var io          = require('socket.io');
var config      = require('./api/config.js');
var routes		= require('./api/router');
var express 	= require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var app         = express();
var Handler 	= require('./api/sockets.js');
var server      = http.createServer(app);
io			    = io.listen(server);
var socketHandler = new Handler(io);

socketHandler.start();
// var bodyParser  = require('body-parser');

mongoose.connect(config.db.url, function(err) {
    if(!err)
        return console.log("Connected to MongoDB !");
    console.log("Unable to connect MongoDB to", config.db.url);
    process.exit();
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    next();
});
app.use('/api', routes);
app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/game", express.static(__dirname + '/game'));
app.use("/", express.static(__dirname + '/site'));

app.use("/*", express.static(__dirname + '/site/index.html'));

server.listen(config.port, "0.0.0.0");
console.log("Server started. Waiting for a connexion...");