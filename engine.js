var tickSpeed = 6; //in TPS
var z = 0;
var base=75;
var coreBreath = 4+base; //in percent? per second
var x = document.getElementById("core-m").style;
//document.getElementById("behave").innerHTML = "Changer le comportement (Actuel: " + bubble.settings.generalBehavior + ")";
//document.getElementById("range").innerHTML = "Changer l'effet de portée (Actuel: " + bubble.settings.generalRangeEffect + ")";
//document.getElementById("pausemenu").style.display = "none";
bubble.settings.generalRangeEffect = -1;
bubble.settings.generalBehavior = 0; 
key.enable = true;
var paused = false;
/*function pause() {
  if (paused) { document.getElementById("pausemenu").style.display = "none"; tick(); } 
  else { document.getElementById("pausemenu").style.display = "block"; }
  toogle(paused);
}*/
function cpls() {
  key.enable = toogle(key.enable);
  cursor.enable = toogle(key.enable);
  if (key.enable) { keymotion(); }
}
function cb() {
  if (bubble.settings.generalBehavior < 1) { bubble.settings.generalBehavior++; }
  else { bubble.settings.generalBehavior = -1; }
  //document.getElementById("behave").innerHTML = "Changer le comportement (Actuel: " + bubble.settings.generalBehavior + ")";
}
function cp() {
  if (bubble.settings.generalRangeEffect < 1) { bubble.settings.generalRangeEffect++; }
  else { bubble.settings.generalRangeEffect = -1; }
  //document.getElementById("range").innerHTML = "Changer l'effet de portée (Actuel: " + bubble.settings.generalRangeEffect + ")";
}
function pre() {
  if (!toc) {
    ctx.fillStyle = "#000000";
    if (cursor.enable) { ctx.fillRect(cursor.x, cursor.y, 6, 6); }
    else if (key.enable) { ctx.fillRect(Math.round(key.pos.x), Math.round(key.pos.y), 6, 6); }
  }
}
function post() {
  if (!toc) {
    ctx.fillStyle = "#FF5C79";
    if (cursor.enable) { ctx.fillRect(cursor.x, cursor.y, 6, 6); }
    else if (key.enable) { ctx.fillRect(Math.round(key.pos.x), Math.round(key.pos.y), 6, 6); }
  }
}
var c = document.getElementById("game")
function recalcPos() {
  c.width = document.documentElement.clientWidth;
  c.height = document.documentElement.clientHeight/2;

}
recalcPos()
var ctx = c.getContext("2d");
ctx.fillStyle = "#FF5C79";
ctx.fillRect(key.pos.x, key.pos.y, 6, 6);
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, c.width, c.height);
console.log(c.width, c.height);
for (let i = 0; i < 50; i++) {
  bubble.create(rand.int(1, 100), rand.int(1, c.height), rand.real(3.5, 6.5, 2));
}
key.pos.x = Math.round(c.width/2);
key.restrictions(0, c.width-7, 0, c.height-7);
bubble.restrict(0, c.width+30, -5, c.height);
var timer = 1;
var toc = false;
function tick() {
  for (let i = 0; i < bubble.data.length; i++) {
    ctx.fillStyle = "#000000";
    ctx.fillRect(Math.round(bubble.data[i].x), Math.round(bubble.data[i].y), 5, 5);
    var x = bubble.data[i].x;
    var y = bubble.data[i].y;
    var a = {}
    if (cursor.enable) { a = bubble.tick(i, cursor.x, cursor.y, timer); }
    else if (key.enable) { a = bubble.tick(i, key.pos.x, key.pos.y, timer); }
    var t = norm(a.x - bubble.data[i].x, a.y - bubble.data[i].y);
    if (cursor.enable) {
      if (t >= 6 * bubble.data[i].speed || norm(cursor.x - a.x, cursor.y - a.y) <= 5) {
        bubble.edit(i, 0, rand.int(1, c.height));
        console.log("Toc");
        toc = true;
      }
    } else if (key.enable) {
      if (t >= 6 * bubble.data[i].speed || norm(key.pos.x - a.x, key.pos.y - a.y) <= 5) {
        console.log("Toc");
        toc = true;
      }
    }
    if (a.x >= c.width) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(3.5, 6.5, 2)); }
    if (bubble.settings.restrictions.xMin >= a.x || bubble.settings.restrictions.xMax <= a.x) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(3.5, 6.5, 2)); }
    if (bubble.settings.restrictions.yMin >= a.y || bubble.settings.restrictions.yMax <= a.y) { bubble.edit(i, 0, rand.int(1, c.height), rand.real(3.5, 6.5, 2)); }
    if (a.speed>=3.5 && a.speed<=6.5) {
      var propSpd = getMix(3.5, 6.5, a.speed);
      var hexspd = (Math.round(mix(200, 255, propSpd))).toString(16);
      hexspd = hexspd.toUpperCase();
      var color = "#" + hexspd + hexspd + hexspd;
      ctx.fillStyle = color;
    } else {
      console.log("Error: out of range")
      ctx.fillStyle = "#FFFFFF";
    }
    ctx.fillRect(Math.round(bubble.data[i].x), Math.round(bubble.data[i].y), 5, 5);
  }
  if (!toc) {
    if (!paused) {
      load();
      setTimeout(tick, 1000 / 60);
    }
  } else {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, c.width, c.height);
  }
}
tick()