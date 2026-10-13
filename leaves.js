// Leaves drifting down behind the home card, drawn on a plain <canvas> (no library).
// Skipped when the visitor asked for reduced motion.
(() => {
  const canvas = document.querySelector(".leaves");
  if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  const colors = ["#5bc46d", "#4aa85c", "#2e7d3f", "#8fd16a", "#ffd666"];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height;
  const leaves = [];

  const rand = (min, max) => min + Math.random() * (max - min);

  function spawn(leaf, anywhere) {
    leaf.x = rand(0, width);
    leaf.y = anywhere ? rand(-height, height) : rand(-80, -20);
    leaf.size = rand(10, 20);
    leaf.fall = rand(0.35, 0.9); // px per frame at 60 fps
    leaf.swayAmp = rand(0.4, 1.4);
    leaf.swaySpeed = rand(0.008, 0.02);
    leaf.phase = rand(0, Math.PI * 2);
    leaf.spin = rand(-0.02, 0.02);
    leaf.angle = rand(0, Math.PI * 2);
    leaf.color = colors[Math.floor(Math.random() * colors.length)];
    return leaf;
  }

  function resize() {
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // ponytail: count scales with screen area, 10 to 30; lower the cap if low-end phones stutter.
    const count = Math.max(10, Math.min(30, Math.round((width * height) / 30000)));
    // Keep existing leaves so a mobile URL-bar resize does not reset the scene.
    while (leaves.length < count) leaves.push(spawn({}, true));
    leaves.length = count;
  }

  function drawLeaf({ x, y, size, angle, phase, color }) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(1, Math.cos(phase)); // flipping over as it tumbles
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.quadraticCurveTo(0, -size * 0.7, size, 0);
    ctx.quadraticCurveTo(0, size * 0.7, -size, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(size * 0.8, 0);
    ctx.stroke();
    ctx.restore();
  }

  let last = performance.now();
  function frame(now) {
    const step = Math.min((now - last) / 16.67, 3); // frame-rate independent, no jump after a pause
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (const leaf of leaves) {
      leaf.phase += leaf.swaySpeed * step;
      leaf.x += Math.sin(leaf.phase) * leaf.swayAmp * step;
      leaf.y += leaf.fall * step;
      leaf.angle += leaf.spin * step;
      if (leaf.y > height + 30) spawn(leaf, false);
      drawLeaf(leaf);
    }
    requestAnimationFrame(frame);
  }

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(frame);
})();
