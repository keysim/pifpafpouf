
var gamepad = new Gamepad();



gamepad.start();

var GAME = {
    SCREEN_W: 800,
    SCREEN_H: 600,
    W:6,
    H:13,
    SIZE:50,
    DEFAULT_X:3,
    DEFAULT_Y:1,
    TIC:10,
    SPEED:40,
    DIR : {"right": {x: 1, y: 0}, "left": {x: -1, y: 0}}
};

function Player (offset_x, offset_y) {
    var background = [];
    var x, y;
    for (y = 0; y < GAME.H; y++) {
        for (x = 0; x < GAME.W; x++) {
            background.push({
                strokeStyle: '#ccc',
                strokeWidth: 1,
                x: offset_x + x * GAME.SIZE, y: offset_y + y * GAME.SIZE,
                fromCenter: false,
                width: GAME.SIZE,
                height: GAME.SIZE,
                cornerRadius: 0
            });
        }
    }
    var grid = [];
    for (y = 0; y < GAME.H; y++) {
        if(!grid[y])
            grid.push([]);
        for (x = 0; x < GAME.W; x++)
            grid[y].push(0);
    }
    return {
        offset: {x:offset_x, y:offset_y},
        grid: grid,
        background: background,
        lose:false,
        update: function () {
            for (var cell of this.background) // BACKGROUND
                game.canvas.drawRect(cell);

            for (var y = 0; y < GAME.H; y++) // GRID PRINT
                for (var x = 0; x < GAME.W; x++)
                    game.canvas.drawRect(Component(this.offset.x + (x * GAME.SIZE), this.offset.y + (y * GAME.SIZE), this.grid[y][x]));

            if(!this.inMove && !generate(this)) // GENERATION
                this.lose = true;
        },
        move: function (vec) {
            if(this.grid[this.cur.y + vec.y][this.cur.x + vec.x] === 0 && this.inMove){
                this.grid[this.cur.y + vec.y][this.cur.x + vec.x] = this.grid[this.cur.y][this.cur.x];
                this.grid[this.cur.y][this.cur.x] = 0;
                this.cur.y += vec.y;
                this.cur.x += vec.x;
            }
        },
        fall: function () {
            if(game.frameNo > 10 && this.inMove){ // FALL
                if(this.grid[this.cur.y + 1] && this.grid[this.cur.y + 1][this.cur.x] === 0) {
                    this.grid[this.cur.y + 1][this.cur.x] = this.grid[this.cur.y][this.cur.x];
                    this.grid[this.cur.y][this.cur.x] = 0;
                    this.cur.y++;
                }
                else {
                    this.inMove = false;
                }
            }
        },
        cur: {x:-1, y:-1},
        inMove: false,
        input: {right: false, left: false, down: false, r_right: false, r_left:false}
    }
}

var players = [];
players.push(new Player(0, -50));
players.push(new Player(500, -50));

function generate(player, x, y) {
    if (x == undefined) {
        x = GAME.DEFAULT_X;
        y = GAME.DEFAULT_Y;
    }
    if (player.grid[y][x] === 0 && player.grid[y - 1][x] === 0) {
        player.grid[y][x] = 2;
        player.cur.x = x;
        player.cur.y = y;
        player.inMove = true;
    }
    else
        return false;
    return true;
}

function startGame() {
    game.start();
}

var game = {
    canvas : $("#game"),
    start : function() {
        this.canvas.width(GAME.SCREEN_W);
        this.canvas.height(GAME.SCREEN_H);
        this.canvas.prop({width:GAME.SCREEN_W, height:GAME.SCREEN_H});
        this.frameNo = 0;
        setInterval(this.update, GAME.TIC);
    },
    drawMenu : function() {
    },
    update : function () {
        gamepad.update();

        //padListener();
        if(everyInterval(40)) { // FALLING
            for(i = 0; players[i]; i++)
                players[i].fall();
        }
        if(everyInterval(10)) { // MOVING RIGHT / LEFT
            if(input["right"] || input["left"]){
                for(i = 0; players[i]; i++)
                    players[i].move(GAME.DIR[input["right"] ? "right" : "left"]);
            }
        }
        game.canvas.clearCanvas();
        for(var i = 0; players[i]; i++)
            players[i].update();
        game.frameNo++;
    }
};

function Component(x, y, type) {
    var color = 'steelblue';
    if(type == 0)
        return {};
    return {
        fillStyle: color,
        strokeStyle: 'black',
        strokeWidth: 1,
        x: x + 10, y: y + 10,
        fromCenter: false,
        width: GAME.SIZE - 20,
        height: GAME.SIZE - 20
    };
}

function everyInterval(n) {
    return ((game.frameNo / n) % 1 == 0);
}

startGame();

function padListener() {
    var dir = "no";
    var x = gamepad.leftStick.x;
    var y = gamepad.leftStick.y;
    if (x > 0.2 && y > -0.8 && y < 0.8)
        dir = "right";
    else if (x < -0.2 && y > -0.8 && y < 0.8)
        dir = "left";
    else if (y > 0.3 && x > -0.5 && x < 0.5)
        dir = "down";
    if(dir != "no")
        input[dir] = true;
    else{
        input["left"] = false;
        input["right"] = false;
        input["down"] = false;
    }
}

var input = {right: false, left: false, down: false, r_right: false, r_left:false};

document.addEventListener('keydown', function(e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        96: 'r_left',
        110: 'r_right'
    };
    if(keys[e.keyCode] !== undefined)
        input[keys[e.keyCode]] = true;
});
document.addEventListener('keyup', function(e) {
    var keys = {
        37: 'left',
        39: 'right',
        40: 'down',
        96: 'r_left',
        110: 'r_right'
    };
    if(keys[e.keyCode] !== undefined)
        input[keys[e.keyCode]] = false;
});