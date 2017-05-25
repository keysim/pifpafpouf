
class Piece {
    constructor(player){
        this.player = player;
        this.x = -1;
        this.y = -1;
        this.parts = [];
        this.stackNo = 0;
        this.inMove = false;
    }
    rotate(dir) {
        if(this.parts.length === 2){
            var part = this.parts[1];
            var prev = {x:part.x, y:part.y};
            dir = (dir == "right") ? 1 : -1;
            part.x = -(prev.y * dir);
            part.y = prev.x * dir;
            if(this.collision()){ // rotation not possible
                part.x = prev.x;
                part.y = prev.y;
            }
        }
    }
    collision(){
        if(this.parts.length === 2)
            if(this.player.grid[this.y + this.parts[1].y][this.x + this.parts[1].x] !== 0)
                return true;
        return false;
    }
    move(vec) {
        if(this.inMove){
            for(var part of this.parts)
                if(!this.player.grid[this.y + part.y + vec.y] || this.player.grid[this.y + part.y + vec.y][this.x + part.x + vec.x] !== 0)
                    return false;
            this.y += vec.y;
            this.x += vec.x;
        }
    }
    fall() {
        if(game.frameNo > 10 && this.inMove){ // FALL
            for(var part of this.parts)
                if(!this.player.grid[this.y + part.y + 1] || this.player.grid[this.y + part.y + 1][this.x + part.x] !== 0)
                    return this.release();
            this.y++;
        }
    }
    release() {
        for(var part of this.parts)
            this.player.grid[this.y + part.y][this.x + part.x] = part.type;
        this.inMove = false;
        this.player.falling = true;
        this.parts = [];
        return true;
    }
    draw() {
        for(var part of this.parts)
            game.drawBlock(this.player.offset.x + ((this.x + part.x) * GAME.SIZE), this.player.offset.y + ((this.y + part.y) * GAME.SIZE), part.type);
    }
    next(x, y) {
        if (x === undefined || y === undefined) {
            x = GAME.DEFAULT_X;
            y = GAME.DEFAULT_Y;
        }
        this.x = x;
        this.y = y;
        if (this.player.grid[y][x] === 0 && this.player.grid[y - 1][x] === 0) {
            if(this.parts.length === 0){
                this.parts.push({x:0, y:0, type:GAME.STACK[this.stackNo]});
                this.parts.push({x:0, y:-1, type:GAME.STACK[this.stackNo + 1]});
            }
            this.inMove = true;
        }
        else
            return false;
        this.stackNo += 2;
        return true;
    }
}