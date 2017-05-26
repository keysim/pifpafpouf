
var gamepad = new Gamepad();

gamepad.start();

var GAME = {
    SCREEN_W: 900,
    SCREEN_H: 600,
    W:6,
    H:13,
    SIZE:50,
    DEFAULT_X:3,
    DEFAULT_Y:1,
    TIC:10,
    SPEED:40,
    DIR : {"right": {x: 1, y: 0}, "left": {x: -1, y: 0}},
    TYPES: 4,
    COLORS : ['black', 'steelblue', 'red', 'orange', 'green'], // TODO Add difficulty color in MENU
    STACK: generateStack(4), // Don't forget (first param = TYPES)
    SOUNDS: ["pif", "paf", "pouf", "poufff"]
};
function generateStack(number) {
    var stack = [];
    for(var i = 0; i < 1000; i++)
        stack.push(Math.floor((Math.random() * number) + 1));
    return stack;
}
if(GAME.TYPES > GAME.COLORS.length)
    console.log("[ERROR] Too much type. please fill more color or decrease the Types number.");

var players = [];
players.push(new Player(0, -50, "right"));
//players.push(new Player(450, -50, "right"));

for(var sound of GAME.SOUNDS)
    $.createSound(sound, '/assets/sounds/' + sound + '.wav');

class Game {
    constructor(){
        this.canvas = $("#game");
    }
    start() {
        this.canvas.width(GAME.SCREEN_W);
        this.canvas.height(GAME.SCREEN_H);
        this.canvas.prop({width:GAME.SCREEN_W, height:GAME.SCREEN_H});
        this.frameNo = 0;
        setInterval(Game.update, GAME.TIC);
    }
    drawMenu() { // TODO Menu with bootstrap
    }
    drawBlock(x, y, type){
        if(type == 0)
            return;
        game.canvas.drawRect({
            fillStyle: GAME.COLORS[type],
            strokeStyle: 'black',
            strokeWidth: 1,
            x: x + 10, y: y + 10,
            fromCenter: false,
            width: GAME.SIZE - 20,
            height: GAME.SIZE - 20
        });
    }
    static update() {
        gamepad.update();

        //padListener();
        if(everyInterval(80)) { // FALLING
            for(i = 0; players[i]; i++)
                players[i].piece.fall();
        }
        if(everyInterval(10)) { // MOVING RIGHT / LEFT
            for(i = 0; players[i]; i++)
                players[i].inputHandler();
            for(i = 0; players[i]; i++)
                players[i].fall();
        }
        if(everyInterval(8)) {
            for(i = 0; players[i]; i++)
                players[i].fall();
        }
        if(everyInterval(20)) {
            for(i = 0; players[i]; i++)
                players[i].explode();
        }
        game.canvas.clearCanvas();
        for(var i = 0; players[i]; i++)
            players[i].update();
        game.frameNo++;
    }
}
var game = new Game();
game.start();

function everyInterval(n) {
    return ((game.frameNo / n) % 1 == 0);
}

// TODO Music and Pause