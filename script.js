

var tablinks = document.getElementsByClassName("tab-links");
var tabcontents = document.getElementsByClassName("tab-contents");
function opentab(tabname) {
  for (tablink of tablinks) {
    tablink.classList.remove("active-link");
  }
  for (tabcontent of tabcontents) {
    tabcontent.classList.remove("active-tab");
  }

  event.currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");

}







let sidemenu = document.getElementById("sidemenu");

// Open the side menu
function openmenu() {
  sidemenu.style.right = "0";
  document.addEventListener("click", outsideClickListener);
}

// Close the side menu
function closemenu() {
  sidemenu.style.right = "-200px";
  document.removeEventListener("click", outsideClickListener);
}

// Close if clicked outside
function outsideClickListener(event) {
  const isClickInside = sidemenu.contains(event.target) || event.target.classList.contains("fa-bars");
  if (!isClickInside) {
    closemenu();
  }
}










document.addEventListener('DOMContentLoaded', function() {
    const scrollerPlatter = document.querySelector('.rf-cards-scroller-platter');
const scrollerContainer = document.querySelector('.rf-cards-scroller-wrapper');
    const playPauseBtn = document.querySelector('.rf-play-pause');
    
    // Clone items for seamless looping
    const items = scrollerPlatter.querySelectorAll('.rf-cards-scroller-itemview');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        scrollerPlatter.appendChild(clone);
    });
    
    // Auto-scroll animation
    let animation;
    let speed = 40; // seconds for full animation
    
    function startAnimation() {
      
        scrollerPlatter.style.animation = `scroll-left ${speed}s linear infinite`;
        if (playPauseBtn) playPauseBtn.classList.add('playing');
    }
    
    function pauseAnimation() {
        scrollerPlatter.style.animationPlayState = 'paused';
        if (playPauseBtn) playPauseBtn.classList.remove('playing');
    }
    
    // Play/Pause control
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (this.classList.contains('playing')) {
                pauseAnimation();
            } else {
                startAnimation();
            }
        });
    }
    
    // Start animation initially
    startAnimation();
    
    // Pause on hover
   scrollerPlatter.addEventListener('mouseenter', () => {
  scrollerPlatter.style.animationPlayState = 'paused';
});

scrollerPlatter.addEventListener('mouseleave', () => {
  scrollerPlatter.style.animationPlayState = 'running';
});

    
    // Touch device handling
    if ('ontouchstart' in window) {
        scrollerPlatter.style.animation = 'none';
        scrollerPlatter.style.overflowX = 'auto';
        scrollerPlatter.style.WebkitOverflowScrolling = 'touch';
        
        if (playPauseBtn) playPauseBtn.style.display = 'none';
    }
});

























   class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply effect
document.addEventListener('DOMContentLoaded', () => {
  const phrases = ['My Friends', 'My Team', 'My Group', 'My Buddy', 'My Supporters'];
  const el = document.querySelector('.text');
  const fx = new TextScramble(el);
  let counter = 0;

  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 2000);
    });
    counter = (counter + 1) % phrases.length;
  };

  next();
});
















// Perlin Noise Generator
function ClassicalNoise(r) {
  if (r == undefined) r = Math;
  this.grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];
  this.p = [];
  for (var i = 0; i < 256; i++) {
    this.p[i] = Math.floor(r.random() * 256);
  }
  this.perm = [];
  for (i = 0; i < 512; i++) {
    this.perm[i] = this.p[i & 255];
  }
  this.dot = function (g, x, y) {
    return g[0] * x + g[1] * y;
  };
  this.mix = function (a, b, t) {
    return (1.0 - t) * a + t * b;
  };
  this.fade = function (t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };
  this.noise = function (x, y, z) {
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    x = x - X; y = y - Y; z = z - Z;
    X = X & 255; Y = Y & 255; Z = Z & 255;

    var gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    var gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    var gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    var gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    var gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    var gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

    var n000 = this.dot(this.grad3[gi000], x, y);
    var n100 = this.dot(this.grad3[gi100], x - 1, y);
    var n010 = this.dot(this.grad3[gi010], x, y - 1);
    var n110 = this.dot(this.grad3[gi110], x - 1, y - 1);
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

for (var i = 0, u = 0; i < max_lines; i++, u += .02) {
  variators[i] = u;
}

function draw() {
  ctx.shadowColor = "rgba(43, 205, 255, 1)";
  ctx.shadowBlur = 0;

  for (var i = 0; i <= max_lines; i++) {
    ctx.beginPath();
    ctx.moveTo(0, start_y);
    for (var x = 0; x <= canvasWidth; x++) {
      var y = perlin.noise(x * variation + variators[i], x * variation, 0);
      ctx.lineTo(x, start_y + amp * y);
    }
    var color = Math.floor(150 * Math.abs(y));
    var alpha = Math.min(Math.abs(y) + 0.05, .05);
    ctx.strokeStyle = "rgba(255,255,255," + alpha * 2 + ")";
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

function resizeCanvas() {
  canvasWidth = document.documentElement.clientWidth;
  canvasHeight = document.documentElement.clientHeight;
  canvas.setAttribute("width", canvasWidth);
  canvas.setAttribute("height", canvasHeight);
  start_y = canvasHeight / 2;
}



















const scriptURL = 'https://script.google.com/macros/s/AKfycbwyQTRMmVHd4Posz5tf3jssotor_i3eIT7j7_ZO79PCL3D8xWJAKmomrHD3qBNiw8kF/exec';
const form = document.forms['submit-to-google-sheet'];
const popup = document.getElementById('popup-message');

form.addEventListener('submit', e => {
  e.preventDefault();

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      // Show styled popup
      popup.style.display = 'block';
      popup.classList.add('show-popup');

      setTimeout(() => {
        popup.classList.remove('show-popup');
        popup.style.display = 'none';
      }, 3000); // Hide after 3 seconds

      form.reset(); // Clear the form
    })
    .catch(error => console.error('Error!', error.message));
});
