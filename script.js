







var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");
  function opentab(tabname){
    for(tablink of tablinks){
      tablink.classList.remove("active-link");
    }
    for(tabcontent of tabcontents){
      tabcontent.classList.remove("active-tab");
    }

    event.currentTarget.classList.add("active-link");
    document.getElementById(tabname).classList.add("active-tab");

   }

   





// Perlin Noise Generator
function ClassicalNoise(r){
  if(r == undefined) r = Math;
  this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  this.p = [];
  for (var i=0; i<256; i++) {
    this.p[i] = Math.floor(r.random()*256);
  }
  this.perm = [];
  for(i=0; i<512; i++) {
    this.perm[i]=this.p[i & 255];
  }
  this.dot = function(g, x, y) {
    return g[0]*x + g[1]*y;
  };
  this.mix = function(a, b, t) {
    return (1.0-t)*a + t*b;
  };
  this.fade = function(t) {
    return t*t*t*(t*(t*6-15)+10);
  };
  this.noise = function(x, y, z) {
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x = x - X; y = y - Y; z = z - Z;
    X = X & 255; Y = Y & 255; Z = Z & 255;

    var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12;
    var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
    var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12;
    var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
    var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12;
    var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;

    var n000= this.dot(this.grad3[gi000], x, y);
    var n100= this.dot(this.grad3[gi100], x-1, y);
    var n010= this.dot(this.grad3[gi010], x, y-1);
    var n110= this.dot(this.grad3[gi110], x-1, y-1);
    var u = this.fade(x);
    var v = this.fade(y);
    var nx0 = this.mix(n000, n100, u);
    var nx1 = this.mix(n010, n110, u);
    var nxy = this.mix(nx0, nx1, v);
    return nxy;
  }
}

// Wave Animation
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    perlin = new ClassicalNoise(),
    variation = .0025,
    amp = 300,
    variators = [],
    max_lines = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? 25 : 40,
    canvasWidth,
    canvasHeight,
    start_y;

for (var i = 0, u = 0; i < max_lines; i++, u+=.02) {
  variators[i] = u;
}

function draw(){
  ctx.shadowColor = "rgba(43, 205, 255, 1)";
  ctx.shadowBlur = 0;
  
  for (var i = 0; i <= max_lines; i++){
    ctx.beginPath();
    ctx.moveTo(0, start_y);
    for (var x = 0; x <= canvasWidth; x++) {
      var y = perlin.noise(x*variation+variators[i], x*variation, 0);
      ctx.lineTo(x, start_y + amp*y);
    }
    var color = Math.floor(150*Math.abs(y));
    var alpha = Math.min(Math.abs(y)+0.05, .05);
    ctx.strokeStyle = "rgba(255,255,255,"+alpha*2+")";
    ctx.stroke();
    ctx.closePath();

    variators[i] += .005;
  }
}

(function init() {
	resizeCanvas();
	animate();
	window.addEventListener('resize', resizeCanvas);
})();

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  draw();
  requestAnimationFrame(animate);
}

function resizeCanvas(){
	canvasWidth = document.documentElement.clientWidth;
	canvasHeight = document.documentElement.clientHeight; 
	canvas.setAttribute("width", canvasWidth);
	canvas.setAttribute("height", canvasHeight);
	start_y = canvasHeight/2;
}

