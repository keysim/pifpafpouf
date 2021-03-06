var dirs = [{x:-1, y:0}, {x:1, y:0}, {x:0, y:-1}, {x:0, y:1}]; // For checking blocks near
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
        this.boom = false;
        this.explosionList = [];
        this.explodeLvl = 0;
        this.rocks = 0;
    }
    reset(){
        this.lose = false;
        this.piece = new Piece(this);
        this.falling = false;
        this.boom = false;
        this.explosionList = [];
        this.explodeLvl = 0;
        for (var y = 0; y < GAME.H; y++) // GRID PRINT
            for (var x = 0; x < GAME.W; x++)
                this.grid[y][x] = 0;
    }
    update(game) {
        for (var cell of this.background) // BACKGROUND TODO Optimized background
            game.canvas.drawRect(cell);

        for (var y = 0; y < GAME.H; y++) // GRID PRINT
            for (var x = 0; x < GAME.W; x++)
                game.drawBlock(this.offset.x + (x * GAME.SIZE), this.offset.y + (y * GAME.SIZE), this.grid[y][x]);

        this.piece.draw(game);

        if(!this.falling && !this.piece.inMove && !this.boom && !this.explosionList.length){
            this.explodeLvl = 0;
            if(!this.rocks) {
                if (!this.piece.next()) {
                    console.log("PLAYER", this.no, ", YOU LOSE");
                    this.lose = true;
                    game.toggleMenu();
                }
            }
            else
                this.releaseBlocks();
        }
        this.viewer(game);
    }
    giveRocks(num){
        this.rocks += num;
    }
    releaseBlocks(){
        var i = 0;
        var tab = [0, 1, 2, 3, 4, 5];
        if(this.rocks < 6) {
            for(i = 0; i < this.rocks; i++) {
                var place = Math.floor((Math.random() * tab.length));
                var x = tab[place];
                tab.splice(place, 1);
                this.grid[0][x] = GAME.ROCK;
            }
            this.rocks = 0;
        }
        else{
            for(i = 0; i < 6; i++)
                this.grid[1][i] = GAME.ROCK;
            this.rocks -= 6;
        }
        this.falling = true;
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
                this.boom = true;
            }
        }
    }
    viewer(game) {
        game.drawBlock(this.offset.x + ((GAME.W + 1) * GAME.SIZE), this.offset.y + (GAME.SIZE), GAME.STACK[this.piece.stackNo + 1]);
        game.drawBlock(this.offset.x + ((GAME.W + 1) * GAME.SIZE), this.offset.y + (GAME.SIZE * 2), GAME.STACK[this.piece.stackNo]);
    }
    explode(players) {
        if(!this.falling && this.explosionList.length === 0) {
            this.targetCells();
            if(this.explosionList.length != 0)
                for (var i = 0; players[i]; i++)
                    if(players[i] != this)
                        players[i].giveRocks((this.explodeLvl + 1) * this.explosionList.length);
        }
        if(this.explosionList.length > 0){
            $.playSound(GAME.SOUNDS[this.explodeLvl > 3 ? 3 : this.explodeLvl]);
            var cell = this.explosionList.pop();
            this.grid[cell.y][cell.x] = 0;
            this.explodeCloseRocks(cell);
            if(this.explosionList.length === 0) {
                this.explodeLvl++;
                this.falling = true;
                this.fall();
            }
        }
        else
            this.boom = false;
    }
    explodeCloseRocks(cell){
        for (var dir of dirs)
            if (this.grid[cell.y + dir.y] && this.grid[cell.y + dir.y][cell.x + dir.x] === 1)
                this.grid[cell.y + dir.y][cell.x + dir.x] = 0;
    }
    targetCells() {
        for (var y = 0; y < GAME.H; y++) {
            for (var x = 0; x < GAME.W; x++) {
                if(this.grid[y][x] > 1) { // != 0 and 1
                    var checked = [];
                    rec(this.grid[y][x], x, y, this.grid, checked, this.explosionList);
                    if(checked.length >= 4)
                        for(var cell of checked)
                            this.explosionList.push({x:cell.x, y:cell.y});
                }
            }
        }
    }
}

function rec(type, x, y, grid, checked, expList) {
    if(!isChecked(x, y, checked, expList)) {
        checked.push({x, y});
        for (var dir of dirs) {
            if (grid[y + dir.y] && grid[y + dir.y][x + dir.x] === type) {
                rec(type, x + dir.x, y + dir.y, grid, checked, expList);
            }
        }
    }
}
function isChecked(x, y, checked, expList) {
    for(var cell of checked)
        if(x === cell.x && y === cell.y)
            return true;
    for(cell of expList)
        if(x === cell.x && y === cell.y)
            return true;
    return false;
}