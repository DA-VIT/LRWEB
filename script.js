const canvas = document.getElementById("water");
const ctx = canvas.getContext("2d");

let width, height;
let ripples = [];
let isHolding = false;
let lastPos = { x: null, y: null };

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.opacity = 1;
  }
  update() {
    this.radius += 8;
    this.opacity -= 0.01;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${this.opacity})`;
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
}

function drawBackground() {
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--c5");
  ctx.fillRect(0, 0, width, height);

  // Texto fijo en la esquina inferior izquierda
  ctx.font = "24px Arial";
  ctx.fillStyle = "white";
  ctx.textBaseline = "bottom";
  ctx.textAlign = "left";
  ctx.fillText("Lurancy", 20, height - 20);
}

function animate() {
  drawBackground();
  ripples.forEach((ripple,  i) => {
    ripple.update();
    ripple.draw(ctx);
    if (ripple.opacity <= 0) ripples.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

function startRipple(x, y) {
  ripples.push(new Ripple(x, y));
}

// Eventos Mouse
canvas.addEventListener("mousedown", e => {
  isHolding = true;
  lastPos = { x: e.clientX, y: e.clientY };
  startRipple(e.clientX, e.clientY);
});
canvas.addEventListener("mouseup", () => { isHolding = false; });
canvas.addEventListener("mousemove", e => {
  if (isHolding) {
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 15) {
      startRipple(e.clientX, e.clientY);
      lastPos = { x: e.clientX, y: e.clientY };
    }
  }
});

// Eventos Touch
canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  isHolding = true;
  lastPos = { x: touch.clientX, y: touch.clientY };
  startRipple(touch.clientX, touch.clientY);
});
canvas.addEventListener("touchend", () => { isHolding = false; });
canvas.addEventListener("touchmove", e => {
  if (isHolding) {
    const touch = e.touches[0];
    const dx = touch.clientX - lastPos.x;
    const dy = touch.clientY - lastPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 15) {
      startRipple(touch.clientX, touch.clientY);
      lastPos = { x: touch.clientX, y: touch.clientY };
    }
  }
});

animate();
