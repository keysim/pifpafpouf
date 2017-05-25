class Player {
    constructor(offset_x, offset_y, keyMode) {
        if(Player.no === undefined)
            Player.no = 0;
        this.no = Player.no;
        Player.no++;
        this.background = [];
        for (var y = 0; y < GAME.H; y++) {
            for (var x = 0; x < GAME.W; x++) {
                this.background.push({
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
        this.grid = [];
        for (y = 0; y < GAME.H; y++) {
            if(!this.grid[y])
                this.grid.push([]);
            for (x = 0; x < GAME.W; x++)
                this.grid[y].push(0);
        }
        this.offset = {x:offset_x, y:offset_y};
        this.lose = false; // TODO Make him lose !
        this.piece = new Piece(this);
        this.input = new Input(keyMode);
        this.falling = false;
    }
    update() {
        for (var cell of this.background) // BACKGROUND TODO Optimized background
            game.canvas.drawRect(cell);

        for (var y = 0; y < GAME.H; y++) // GRID PRINT
            for (var x = 0; x < GAME.W; x++)
                game.drawBlock(this.offset.x + (x * GAME.SIZE), this.offset.y + (y * GAME.SIZE), this.grid[y][x]);
        this.piece.draw();
        if(!this.falling && !this.piece.inMove && !this.piece.next()) {
            console.log("PLAYER", this.no, ", YOU LOSE");
            this.lose = true;
        }
        this.viewer();
    }
    inputHandler() {
        var keys = this.input.toTab();
        if(keys["right"] || keys["left"])
            this.piece.move(GAME.DIR[keys["right"] ? "right" : "left"]);
        if(keys["down"])
            this.piece.release();
        if(keys["r_left"] || keys["r_right"] || keys["r_right_default"])
            this.piece.rotate(keys["r_left"] ? "left" : "right");
        this.input.clean();
    }
    fall() {
        if(this.falling){
            var itMoved = false;
            for (var y = GAME.H - 1; y >= 0; y--) {
                for (var x = 0; x < GAME.W; x++) {
                    if (this.grid[y][x] === 0 && this.grid[y - 1] && this.grid[y - 1][x] !== 0) {
                        itMoved = true;
                        this.grid[y][x] = this.grid[y - 1][x];
                        this.grid[y - 1][x] = 0;
                    }
                }
            }
            if(!itMoved) {
                this.falling = false;
            }
        }
    }
    viewer() {
        game.drawBlock(this.offset.x + ((GAME.W + 1) * GAME.SIZE), this.offset.y + (GAME.SIZE), GAME.STACK[this.piece.stackNo + 1]);
        game.drawBlock(this.offset.x + ((GAME.W + 1) * GAME.SIZE), this.offset.y + (GAME.SIZE * 2), GAME.STACK[this.piece.stackNo]);
    }
    explode() {
        for (var y = GAME.H - 1; y >= 0; y--) {
            for (var x = 0; x < GAME.W; x++) {

            }
        }
        this.targetCells();
    }
    targetCells() {
        var boom = false;
        for (var y = 0; y < GAME.H; y++) {
            for (var x = 0; x < GAME.W; x++) {
                if(this.grid[y][x] !== 0) {
                    var checked = [];
                    rec(this.grid[y][x], x, y, this.grid, checked);
                    if(checked.length >= 4){
                        for(var cell of checked)
                            this.grid[cell.y][cell.x] = 0;
                        boom = true;
                    }
                }
            }
        }
        if(boom){
            $.playSound(GAME.SOUNDS[0]);
            this.falling = true;
            this.fall();
        }
    }
}
var dirs = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}];
function rec(type, x, y, grid, checked) {
    if(!isChecked(x, y, checked)) {
        checked.push({x, y});
        for (var dir of dirs) {
            if (grid[y + dir.y] && grid[y + dir.y][x + dir.x] === type) {
                rec(type, x + dir.x, y + dir.y, grid, checked);
            }
        }
    }
}
function isChecked(x, y, checked) {
    for(var cell of checked)
        if(x === cell.x && y === cell.y)
            return true;
    return false;
}