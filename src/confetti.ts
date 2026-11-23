const palette = ['#e9887c', '#b7b8db', '#edc566', '#9dbfa9', '#e7a5bd'];
export function burst(x = innerWidth / 2, y = innerHeight * .45) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.querySelector<HTMLCanvasElement>('#confetti')!;
  const context = canvas.getContext('2d');
  if (!context) return;
  // A single bounded animation avoids accumulating loops after rapid navigation.
  stopConfetti();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  context.scale(dpr, dpr);
  const particles = Array.from({ length: 70 }, (_, i) => ({ x, y, vx: (Math.random() - .5) * 12, vy: -4 - Math.random() * 9, r: Math.random() * 6, spin: (Math.random() - .5) * .2, color: palette[i % palette.length] }));
  let previous = performance.now();
  const start = previous;
  function frame(now: number) {
    const delta = Math.min((now - previous) / 16.67, 3); previous = now;
    context!.clearRect(0, 0, innerWidth, innerHeight);
    context!.globalAlpha = Math.max(0, 1 - (now - start - 1200) / 900);
    for (const p of particles) {
      p.x += p.vx * delta; p.y += p.vy * delta; p.vy += .19 * delta; p.r += p.spin * delta;
      context!.save(); context!.translate(p.x, p.y); context!.rotate(p.r); context!.fillStyle = p.color;
      context!.fillRect(-3, -5, 6, 10); context!.restore();
    }
    if (now - start < 2100) frameId = requestAnimationFrame(frame);
    else { context!.clearRect(0, 0, innerWidth, innerHeight); frameId = 0; }
  }
  frameId = requestAnimationFrame(frame);
}
let frameId = 0;
export function stopConfetti() {
  cancelAnimationFrame(frameId); frameId = 0;
  const canvas = document.querySelector<HTMLCanvasElement>('#confetti');
  canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
}
