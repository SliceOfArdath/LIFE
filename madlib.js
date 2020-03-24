var pi = Math.PI;
radToDeg = (a) => a * (180 / pi);
radToRev = (a) => a * (.5 / pi);
degToRad = (a) => a * (pi / 180);
degToRev = (a) => a * (.5 / 180);
revToDeg = (a) => a * (180 / .5);
revToRad = (a) => a * (pi / .5);
toogle = (a) => a == false;
norm = (x, y) => Math.sqrt(x ** 2 + y ** 2);
var rad = pi;
var rev = 1;
var deg = 180;
convertAngle = (a, from, to) => a * (to / from);
var goldenRatio = (Math.sqrt(5) + 1) / 2;
function angle(a, b) {
    if (a == 0) { return Math.PI / 2 * Math.floor(b / Math.abs(b)) }
    else if (a > 0) { return Math.atan(b / a) }
    else { return Math.atan(b / a) + Math.PI }
}
mix = (a, b, d) => (1 - d) * a + d * b;
getMix = (a, b, c) => (c * a) / (c * b);
//on a 1 et 3
//cherche ou est 2 entre les deux
var rand = {
    seed: 1,
    step: .005,
    len: 10,
    noise: function (x = Math.random) {
        var t = 0;
        for (let i = 0; i < rand.len; i++) {
            t += 1 / (i + 1) ** .3 * Math.sin(i ** 2 * x * rand.step + rand.seed * i);
        }
        return .5 * Math.cos(64 * Math.PI * t) + .5
    },
    int: (a, b, x = Math.random()) => Math.round(a + rand.noise(x) * (b - a)),
    real: function (a, b, acc = -1, x = Math.random()) {
        if (acc >= 0) {
            return Math.round((a + rand.noise(x) * (b - a)) * (10 ** acc)) / (10 ** acc)
        }
        return a + Math.random() * (b - a)
    },
    knuth: (a, b, c) => b < 2 || c < 1 ? a ** c : knuth(a, b - 1, knuth(a, b, c - 1)),
    gen2D: function (a, b, zero = 0) {
        var result = [];
        for (let x = zero; x < a + zero; x++) {
            var r = [];
            for (let y = zero; y < b + zero; y++) {
                r.push(rand.noise(x + ay));
            }
        }
    }
}
var bubble = {
    data: [],
    settings: {
        rangeEffectArea: 100,
        generalBehavior: 0,
        generalRangeEffect: 0,
        restricted: false,
        restrictions: {xMin: 0, xMax: 1, yMin: 0, yMax: 1}
    },
    restrict: function (x1, x2, y1, y2) {
        bubble.settings.restrictions.xMin = x1; bubble.settings.restrictions.xMax = x2; bubble.settings.restrictions.yMin = y1; bubble.settings.restrictions.yMax = y2; bubble.settings.restricted = true;
    },
    create: function (x, y, speed = 5, rs = .1, angle = 0) {
        this.data.push({ angle: angle, x: x, y: y, rspeed: rs, speed: speed });
        return this.data[this.data.length - 1]
    },
    delete: function (i) {
        var a = this.data.slice(i + 1);
        var b = this.data.slice(0, i);
        var d = this.data[i];
        this.data = b.concat(a);
        return d
    },
    tick: function (i, x, y, t, behavior = bubble.settings.generalBehavior, rangeEffect = bubble.settings.generalRangeEffect, homing = false) {
        var dx = x - bubble.data[i].x;
        var dy = y - bubble.data[i].y;
        var cAngle = Math.atan2(dy, dx);
        var norme = norm(dx, dy);
        if (behavior != 0) {
            if (behavior == -1) { behavior = 0; }
            if (homing == true) {
                var diff = cAngle - bubble.data[i].angle;
                var rs = bubble.data[i].rspeed * t;
                if (diff > pi) { diff += pi * 2; }
                else if (diff < -pi) { diff += pi * 2; }
                if (diff > rs) { bubble.data[i].angle += rs + pi + pi * behavior; }
                else if (diff < -rs) { bubble.data[i].angle -= rs + pi + pi * behavior; }
                else { bubble.data[i].angle = cAngle + pi + pi * behavior; }
            } else { bubble.data[i].angle = cAngle + pi + pi * behavior; }
        }
        if (bubble.data[i].angle > pi) { bubble.data[i].angle -= 2 * pi; }
        if (bubble.data[i].angle < -pi) { bubble.data[i].angle += 2 * pi; }
        x = bubble.data[i].x; y = bubble.data[i].y;
        x += Math.cos(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme**2 + 1)));
        y += Math.sin(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme**2 + 1)));
        if (this.settings.restricted) {
            /*
            if (bubble.settings.restrictions.xMin >= x || bubble.settings.restrictions.xMax <= x) { bubble.data[i].angle = pi - bubble.data[i].angle; }
            // else if () { bubble.data[i].angle = pi - bubble.data[i].angle; }
            if (bubble.settings.restrictions.yMin >= y || bubble.settings.restrictions.yMax <= y) { bubble.data[i].angle = -bubble.data[i].angle; }
            // else if () { bubble.data[i].angle = 2 * pi - bubble.data[i].angle; }
            x = bubble.data[i].x; y = bubble.data[i].y;
            x += Math.cos(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme + 10)));
            y += Math.sin(mix(bubble.data[i].angle, cAngle, (1 / norme * bubble.settings.rangeEffectArea * .1) * rangeEffect)) * t * (bubble.data[i].speed + rangeEffect * (1 / ((1 / bubble.settings.rangeEffectArea) * norme + 10)));
            */
        }
        bubble.data[i].x = x; bubble.data[i].y = y;
        return this.data[i]
    },
    edit: function (i, x, y, speed = 5, rs = .1, angle = 0) { this.data[i] = { angle: angle, x: x, y: y, rspeed: rs, speed: speed }; }
}
var text = {
    lps: 15,
    to: "undefined",
    letter: function (ltr) { eval(this.to + " += ltr;"); },
    pointer: 0,
    string: [],
    startSay: function(str) { eval(this.to + " = '';"); text.pointer = 0; text.string = str.split(''); text.say(); },
    say: function () { if (text.string.length > text.pointer) { text.letter(text.string[text.pointer]); effect(); text.pointer++; setTimeout(text.say, 1000/text.lps); } }
}
var cursor = {
    enable: false,
    x: 1,
    y: 1
}
var key = {
    spd: 5,
    enable: false,
    restrict: false,
    restrictions: function (x1, x2, y1, y2) {
        key.border.xMin = x1; key.border.xMax = x2; key.border.yMin = y1; key.border.yMax = y2; key.restrict = true;
    },
    border: {xMin: 0, xMax: 1, yMin: 0, yMax: 1},
    pos: {
        x: 100,
        y: 100
    },
    state: [],
    val: {},
    act: {}
}
function setKeyVal(k) { eval("key.state[key.state.length] = '" + k + "';"); eval("key.val." + k + " = false;") }
function setKeyAct(k, act) { eval("key.act." + k + " = " + act + ";"); }
setKeyVal("ArrowUp")
setKeyVal("ArrowDown")
setKeyVal("ArrowLeft")
setKeyVal("ArrowRight")
document.addEventListener("keydown", function (e) {
    e = e || event; // to deal with IE
    eval("key.val." + e.code + " = e.type == 'keydown'");
});
document.addEventListener("keyup", function (e) {
    e = e || event; // to deal with IE
    eval("key.val." + e.code + " = e.type == 'keydown'");
    if (event.code=="Escape") { pause() }
});
function keymotion() {
    var t = 0;
    if (key.enable) {
        pre();
        for (let t = 0; t < key.state.length; t++) {
            eval("i = key.val." + key.state[t]);
            if (i == true) { eval('key.act. ' + key.state[t] + '()'); }
        }
        if (key.restrict) {
            if (key.border.xMin >= key.pos.x) { key.pos.x = key.border.xMin; }
            else if (key.border.xMax <= key.pos.x) { key.pos.x = key.border.xMax; }
            if (key.border.yMin >= key.pos.y) { key.pos.y = key.border.yMin; }
            else if (key.border.yMax <= key.pos.y) { key.pos.y = key.border.yMax; }
        }
        post();
    }
}
function load() { if (key.enable) { keymotion(); } }
setKeyAct("ArrowUp", "function up() { key.pos.y -= key.spd; }")
setKeyAct("ArrowDown", "function down() { key.pos.y += key.spd; }")
setKeyAct("ArrowLeft", "function left() { key.pos.x -= key.spd; }")
setKeyAct("ArrowRight", "function right() { key.pos.x += key.spd; }")
document.addEventListener("mousemove", function (e) {
    if (cursor.enable) { pre() }
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    if (cursor.enable) { post() }
});