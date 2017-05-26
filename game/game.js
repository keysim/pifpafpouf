
var gamepad = new Gamepad();

gamepad.start();

var GAME = {
    SCREEN_W: 1080,
    SCREEN_H: 720,
    W:6,
    H:13,
    SIZE:60,
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


for(var sound of GAME.SOUNDS)
    $.createSound(sound, 'game/sounds/' + sound + '.wav');
$.createSound("music", '/game/sounds/wil.mp3');
//$.playSound("music", 1);
class Game {
    constructor(players){
        this.canvas = $("#canvas");
        this.players = players;
    }
    start() {
        this.canvas.width(GAME.SCREEN_W);
        this.canvas.height(GAME.SCREEN_H);
        this.canvas.prop({width:GAME.SCREEN_W, height:GAME.SCREEN_H});
        this.frameNo = 0;
        setInterval(this.update, GAME.TIC, this);
    }
    drawMenu() { // TODO Menu with bootstrap
    }
    drawBlock(x, y, type){
        if(type == 0)
            return;
        this.canvas.drawRect({
            fillStyle: GAME.COLORS[type],
            strokeStyle: 'black',
            strokeWidth: 1,
            x: x + 10, y: y + 10,
            fromCenter: false,
            width: GAME.SIZE - 20,
            height: GAME.SIZE - 20
        });
    }
    everyInterval(n) {
        return ((this.frameNo / n) % 1 == 0);
    }
    update(that) {
        gamepad.update();
        if(that.everyInterval(80)) { // FALLING
            for(i = 0; that.players[i]; i++)
                that.players[i].piece.fall();
        }
        if(that.everyInterval(10)) { // MOVING RIGHT / LEFT
            for(i = 0; that.players[i]; i++)
                that.players[i].inputHandler();
            for(i = 0; that.players[i]; i++)
                that.players[i].fall();
        }
        if(that.everyInterval(8)) {
            for(i = 0; that.players[i]; i++)
                that.players[i].fall();
        }
        if(that.everyInterval(20)) {
            for(i = 0; that.players[i]; i++)
                that.players[i].explode();
        }
        that.canvas.clearCanvas();
        for(var i = 0; that.players[i]; i++)
            that.players[i].update(that );
        that.frameNo++;
    }
}