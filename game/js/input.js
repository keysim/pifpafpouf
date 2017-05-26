
var input = {};

var keyboard = {
    keys: ["left", "r_right_default", "right", "down", "r_left", "r_right"],
    right: [37, 38, 39, 40, 96, 110],
    left: [81, 90, 68, 83, 70, 71]
};

class Input {
    constructor(mode){
        this.keys = [];
        if(keyboard[mode])
            this.keys = keyboard[mode];
    }
    clean(){
        for(var key of this.keys) {
            if (input[key])
                delete input[key];
        }
    }
    toTab(){
        var tab = {};
        for(var i = 0; this.keys[i]; i++)
            tab[keyboard.keys[i]] = input[this.keys[i]];
        return tab;
    }
}

function padListener() { // TODO Recognize new controller
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

document.addEventListener('keydown', function(e) {
    input[e.keyCode] = true;
});