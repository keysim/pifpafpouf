
var gamepad = new Gamepad();
gamepad.start();

var GAME = {
    SCREEN_W: 1170,
    SCREEN_H: 780,
    W:6,
    H:13,
    SIZE:65,
    DEFAULT_X:3,
    DEFAULT_Y:1,
    TIC:10,
    SPEED:40,
    DIR : {"right": {x: 1, y: 0}, "left": {x: -1, y: 0}},
    TYPES: 4,
    ROCK:1,
    COLORS : ['black', 'black', 'steelblue', 'red', 'orange', 'green'], // TODO Add difficulty color in MENU
    STACK: generateStack(4), // Don't forget (first param = TYPES)
    SOUNDS: ["pif", "paf", "pouf", "poufff"]
};

function generateStack(number) {
    var stack = [];
    for(var i = 0; i < 1000; i++)
        stack.push(Math.floor((Math.random() * number) + 2));
    return stack;
}

if(GAME.TYPES > GAME.COLORS.length)
    console.log("[ERROR] Too much type. please fill more color or decrease the Types number.");

for(var sound of GAME.SOUNDS)
    $.createSound(sound, 'game/sounds/' + sound + '.wav');

$.createSound("music", '/game/sounds/wil.mp3');

class Game {
    constructor(players){
        this.paused = true;
        this.game = $("#game");
        this.canvas = $("#canvas");
        this.canvas.prop({width:GAME.SCREEN_W, height:GAME.SCREEN_H});
        this.players = players;
        this.loop = -1;
        this.canvas.drawRect({
            fillStyle: "#337ab7",
            strokeStyle: 'black',
            strokeWidth: 1,
            x: 0, y: 0,
            fromCenter: false,
            width: GAME.SCREEN_W,
            height: GAME.SCREEN_H
        });
        this.frameNo = 0;
    }
    toggleMenu(){
        $("#menu").toggle();
        this.paused = !this.paused;
        this.pause(this.paused);
        if(!this.paused) {
            $.unpauseSound("music");
        }
        else {
            $.pauseSound("music");
        }
    }
    sound(on){
        if(on)
            $.muteSound("music", false);
        else
            $.muteSound('music', true);
    }
    show(){
        this.game.show();
    }
    hide(){
        this.game.hide();
    }
    // start() {
    //     if(this.loop === -1) {
    //         this.loop = setInterval(this.update, GAME.TIC, this);
    //     }
    // }
    restart() {
        for (var i = 0; this.players[i]; i++)
            this.players[i].reset();
        this.toggleMenu();
        $.playSound("music");
        //this.start();
    }
    pause(state){
        this.paused = state;
        if(state === undefined)
            this.paused = true;
        if(this.paused)
            clearInterval(this.loop);
        else
            this.loop = setInterval(this.update, GAME.TIC, this);
        if(this.paused)
            this.canvas.css("opacity", 0.5);
        else
            this.canvas.css("opacity", 1);
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
        if (that.everyInterval(80)) { // FALLING
            for (i = 0; that.players[i]; i++)
                that.players[i].piece.fall();
        }
        if (that.everyInterval(10)) { // MOVING RIGHT / LEFT
            for (i = 0; that.players[i]; i++)
                that.players[i].inputHandler();
            for (i = 0; that.players[i]; i++)
                that.players[i].fall();
        }
        if (that.everyInterval(8)) {
            for (i = 0; that.players[i]; i++)
                that.players[i].fall();
        }
        if (that.everyInterval(20)) {
            for (i = 0; that.players[i]; i++)
                that.players[i].explode(that.players);
        }
        that.canvas.clearCanvas();
        for (var i = 0; that.players[i]; i++)
            that.players[i].update(that);
        that.frameNo++;
    }
}