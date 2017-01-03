// Animation utility function from Eloquent JS
// Expects a frame function that takes a time difference argument
function runAnimation(frameFunc) {
    var lastTime = null;
    function frame(time) {
        var stop = false;
        if (lastTime != null) {
            var timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop)
            requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

// From http://stackoverflow.com/a/7638362
function makeRandomColor(){
    var c = '';
    while (c.length < 6) {
        c += (Math.random()).toString(16).substr(-6).substr(-1)
    }
    return '#'+c;
}

function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype.add = function(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y);
}
Vector.prototype.sub = function(vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
}
Vector.prototype.mult = function(scl) {
    return new Vector(this.x * scl, this.y * scl);
}

// Gravitational constant
var G = new Vector(0, 50); // px/s/s

function Grain(root, pos, size) {
    this.$el = $('<div class="grain"></div>');
    this.$el.css({
        height: size,
        width: size,
        "background-color": makeRandomColor()
    });
    this.$el.appendTo(root);
    this.size = size;
    this.pos = pos;
    this.vel = new Vector(0, 0);
}
Grain.prototype.draw = function() {
    this.$el.css({
        left: this.pos.x + 'px',
        top: this.pos.y + 'px',
    })
}
Grain.prototype.fall = function(dt) {
    this.pos = this.pos.add(this.vel.mult(dt));
    this.vel = this.vel.add(G.mult(dt));
}
Grain.prototype.checkBounds = function(frameVec) {
    if ((this.pos.y+this.size) > frameVec.y) {
        this.pos.y = frameVec.y - this.size;
        this.vel.y = 0;
    }
}

$(document).ready(function () {
    var frameVec = new Vector(800, 600);
    var frame = $('div.frame');
    frame.css({
        width: frameVec.x + 'px',
        height: frameVec.y + 'px'
    });
    var grains = [];
    var grainSize = 6;
    // Click in frame creates new grain
    frame.on('mousedown', function(ev) {
        var pos = new Vector(ev.pageX - grainSize/2, ev.pageY - grainSize/2);
        var grain = new Grain(frame, pos, grainSize);
        grain.draw();
        grains.push(grain);
    });
    function animateGrains(timeStep) {
        grains.map(function (gr) {
            gr.fall(timeStep);
            gr.checkBounds(frameVec);
            gr.draw();
            return gr;
        });
        return true;
    }
    runAnimation(animateGrains);
})
