var express 	= require('express');
var user        = require('./models/user');

var routes = express.Router();

routes.get("/",                 function (req, res) {
    res.json({"success":true, "message": "Welcome to the Pifpafpouf API"});
});

routes.post("/register",        user.register);
routes.post("/authenticate",    user.authenticate);

// =================================================================
// authenticated routes ============================================
// =================================================================
routes.use(user.tokenMiddleware);
routes.get("/", function(req, res) { res.json({message: 'Hi ' + req.user.login}); }); // Say hi to the authenticate user

routes.route("/users")
    .get(user.getAll);
routes.route("/users/:id")
    .get(user.get)
    .put(user.put)
    .delete(user.delete);


module.exports = routes;