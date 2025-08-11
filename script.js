

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













// Friends Auto-Scroll JavaScript
class FriendsAutoScroll {
    constructor() {
        this.scrollContainer = document.querySelector('.rf-cards-scroller-platter');
        this.cards = document.querySelectorAll('.rf-cards-scroller-itemview');
        this.isScrolling = true;
        this.scrollSpeed = 40; // seconds for one complete cycle
        this.currentTranslation = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        if (!this.scrollContainer) return;
        
        this.setupAutoScroll();
        this.setupHoverPause();
        this.setupIntersectionObserver();
        this.handleResize();
        this.setupAccessibility();
    }
    
    setupAutoScroll() {
        // Set CSS custom property for animation duration
        this.scrollContainer.style.setProperty('--scroll-duration', `${this.scrollSpeed}s`);
        
        // Ensure seamless loop by duplicating cards if needed
        this.ensureSeamlessLoop();
    }
    
    ensureSeamlessLoop() {
        const originalCards = Array.from(this.cards).slice(0, this.cards.length / 2);
        const containerWidth = this.scrollContainer.offsetWidth;
        const viewportWidth = window.innerWidth;
        
        // If we need more cards for smooth scrolling
        if (containerWidth < viewportWidth * 3) {
            originalCards.forEach(card => {
                const clone = card.cloneNode(true);
                this.scrollContainer.appendChild(clone);
            });
        }
    }
    
    setupHoverPause() {
        if (this.scrollContainer) {
            this.scrollContainer.addEventListener('mouseenter', () => {
                this.pauseScroll();
            });
            
            this.scrollContainer.addEventListener('mouseleave', () => {
                this.resumeScroll();
            });
        }
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.resumeScroll();
                } else {
                    this.pauseScroll();
                }
            });
        }, options);
        
        const friendsSection = document.getElementById('friends');
        if (friendsSection) {
            observer.observe(friendsSection);
        }
    }
    
    pauseScroll() {
        if (this.scrollContainer) {
            this.scrollContainer.style.animationPlayState = 'paused';
            this.isScrolling = false;
        }
    }
    
    resumeScroll() {
        if (this.scrollContainer) {
            this.scrollContainer.style.animationPlayState = 'running';
            this.isScrolling = true;
        }
    }
    
    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.adjustScrollSpeed();
            }, 250);
        });
    }
    
    adjustScrollSpeed() {
        const screenWidth = window.innerWidth;
        let newSpeed = this.scrollSpeed;
        
        if (screenWidth < 480) {
            newSpeed = this.scrollSpeed * 0.8; // Slower on mobile
        } else if (screenWidth < 768) {
            newSpeed = this.scrollSpeed * 0.9; // Slightly slower on tablet
        }
        
        if (this.scrollContainer) {
            this.scrollContainer.style.animationDuration = `${newSpeed}s`;
        }
    }
    
    setupAccessibility() {
        // Add reduced motion support
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.pauseScroll();
            if (this.scrollContainer) {
                this.scrollContainer.style.animation = 'none';
            }
        }
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        // Add ARIA labels
        this.setupAriaLabels();
    }
    
    setupKeyboardNavigation() {
        const cards = document.querySelectorAll('.rf-ccard-content-headerlink');
        
        cards.forEach((card, index) => {
            card.addEventListener('focus', () => {
                this.pauseScroll();
                this.scrollToCard(index);
            });
            
            card.addEventListener('blur', () => {
                setTimeout(() => {
                    if (!document.querySelector('.rf-ccard-content-headerlink:focus')) {
                        this.resumeScroll();
                    }
                }, 100);
            });
        });
    }
    
    scrollToCard(index) {
        const card = this.cards[index];
        if (card && this.scrollContainer) {
            const cardRect = card.getBoundingClientRect();
            const containerRect = this.scrollContainer.getBoundingClientRect();
            const scrollLeft = cardRect.left - containerRect.left;
            
            this.scrollContainer.style.transform = `translateX(-${scrollLeft}px)`;
        }
    }
    
    setupAriaLabels() {
        if (this.scrollContainer) {
            this.scrollContainer.setAttribute('aria-live', 'polite');
            this.scrollContainer.setAttribute('aria-label', 'Auto-scrolling friends gallery');
        }
        
        const cards = document.querySelectorAll('.rf-ccard');
        cards.forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Friend card ${index + 1}`);
        });
    }
    
    // Public methods for external control
    setSpeed(speed) {
        this.scrollSpeed = speed;
        this.adjustScrollSpeed();
    }
    
    stop() {
        this.pauseScroll();
    }
    
    start() {
        this.resumeScroll();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        if (this.scrollContainer) {
            this.scrollContainer.removeEventListener('mouseenter', this.pauseScroll);
            this.scrollContainer.removeEventListener('mouseleave', this.resumeScroll);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for styles to load
    setTimeout(() => {
        const friendsScroll = new FriendsAutoScroll();
        
        // Optional: Make it globally accessible
        window.friendsScroll = friendsScroll;
        
        // Optional: Add manual controls (uncomment if needed)
        /*
        const controlsHTML = `
            <div class="scroll-controls" style="text-align: center; margin-top: 20px;">
                <button onclick="friendsScroll.stop()" style="margin: 0 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Pause</button>
                <button onclick="friendsScroll.start()" style="margin: 0 10px; padding: 8px 16px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">Play</button>
            </div>
        `;
        
        const friendsSection = document.getElementById('friends');
        if (friendsSection) {
            friendsSection.insertAdjacentHTML('beforeend', controlsHTML);
        }
        */
        
    }, 100);
});

// Optional: Touch/Swipe support for mobile
class TouchHandler {
    constructor(scrollContainer) {
        this.container = scrollContainer;
        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        
        if (window.friendsScroll) {
            window.friendsScroll.pauseScroll();
        }
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = e.touches[0].clientX;
        
        // Optional: Add immediate visual feedback during drag
        const diff = this.startX - this.currentX;
        // You can implement immediate visual feedback here if needed
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        
        // Resume auto-scroll after a delay
        setTimeout(() => {
            if (window.friendsScroll) {
                window.friendsScroll.resumeScroll();
            }
        }, 2000);
    }
}

// Initialize touch handler
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const scrollContainer = document.querySelector('.rf-cards-scroller-platter');
        if (scrollContainer) {
            new TouchHandler(scrollContainer);
        }
    }, 150);
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
