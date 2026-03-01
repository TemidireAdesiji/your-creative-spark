import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BIRD_SIZE,
  PIPE_WIDTH,
  PIPE_GAP,
  GROUND_HEIGHT,
  COLORS,
} from "./flappyBirdConstants";

export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawSky(ctx: CanvasRenderingContext2D) {
  const grad = ctx.createLinearGradient(
    0,
    0,
    0,
    GAME_HEIGHT - GROUND_HEIGHT
  );
  grad.addColorStop(0, COLORS.sky);
  grad.addColorStop(1, COLORS.skyGradient);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
}

export function drawClouds(ctx: CanvasRenderingContext2D, offset: number) {
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  const clouds = [
    { x: 60, y: 60, s: 1 },
    { x: 200, y: 100, s: 0.7 },
    { x: 340, y: 40, s: 0.9 },
    { x: 140, y: 150, s: 0.5 },
  ];
  clouds.forEach(({ x, y, s }) => {
    const cx =
      ((x - offset * 0.3) % (GAME_WIDTH + 100) + GAME_WIDTH + 100) %
        (GAME_WIDTH + 100) -
      50;
    ctx.beginPath();
    ctx.arc(cx, y, 20 * s, 0, Math.PI * 2);
    ctx.arc(cx + 15 * s, y - 8 * s, 16 * s, 0, Math.PI * 2);
    ctx.arc(cx + 30 * s, y, 18 * s, 0, Math.PI * 2);
    ctx.arc(cx - 12 * s, y + 2 * s, 14 * s, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawGround(ctx: CanvasRenderingContext2D, offset: number) {
  const y = GAME_HEIGHT - GROUND_HEIGHT;
  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, y, GAME_WIDTH, GROUND_HEIGHT);
  ctx.fillStyle = COLORS.groundLine;
  ctx.fillRect(0, y, GAME_WIDTH, 3);
  ctx.strokeStyle = COLORS.groundDark;
  ctx.lineWidth = 1;
  for (let i = -1; i < GAME_WIDTH / 20 + 2; i++) {
    const x = (i * 20 - (offset % 20) + GAME_WIDTH) % (GAME_WIDTH + 40) - 20;
    ctx.beginPath();
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x + 10, y + 22);
    ctx.stroke();
  }
}

export interface Pipe {
  x: number;
  gapY: number;
  scored: boolean;
}

export function drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe) {
  const topH = pipe.gapY;
  const bottomY = pipe.gapY + PIPE_GAP;
  const bottomH = GAME_HEIGHT - GROUND_HEIGHT - bottomY;

  function drawPipeSection(x: number, y: number, w: number, h: number) {
    const grad = ctx.createLinearGradient(x, y, x + w, y);
    grad.addColorStop(0, COLORS.pipeDark);
    grad.addColorStop(0.15, COLORS.pipeHighlight);
    grad.addColorStop(0.4, COLORS.pipe);
    grad.addColorStop(1, COLORS.pipeDark);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = COLORS.pipeBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
  }

  function drawCap(x: number, y: number) {
    const capW = PIPE_WIDTH + 10;
    const capH = 24;
    const cx = x - 5;
    const grad = ctx.createLinearGradient(cx, y, cx + capW, y);
    grad.addColorStop(0, COLORS.pipeDark);
    grad.addColorStop(0.15, COLORS.pipeHighlight);
    grad.addColorStop(0.4, COLORS.pipe);
    grad.addColorStop(1, COLORS.pipeDark);
    ctx.fillStyle = grad;
    roundRect(ctx, cx, y, capW, capH, 3);
    ctx.fill();
    ctx.strokeStyle = COLORS.pipeBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  drawPipeSection(pipe.x, 0, PIPE_WIDTH, topH);
  drawCap(pipe.x, topH - 24);
  drawPipeSection(pipe.x, bottomY, PIPE_WIDTH, bottomH);
  drawCap(pipe.x, bottomY);
}

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
}

export function drawBird(
  ctx: CanvasRenderingContext2D,
  bird: Bird,
  wingAngle: number
) {
  ctx.save();
  ctx.translate(bird.x + BIRD_SIZE / 2, bird.y + BIRD_SIZE / 2);
  const rot = Math.min(Math.max(bird.velocity * 3, -30), 70);
  ctx.rotate((rot * Math.PI) / 180);

  ctx.fillStyle = COLORS.bird;
  ctx.beginPath();
  ctx.ellipse(0, 0, BIRD_SIZE / 2 + 2, BIRD_SIZE / 2 - 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.birdDark;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#FFF8DC";
  ctx.beginPath();
  ctx.ellipse(2, 3, BIRD_SIZE / 3, BIRD_SIZE / 3 - 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(-4, 0);
  ctx.rotate(((Math.sin(wingAngle) * 25) * Math.PI) / 180);
  ctx.fillStyle = COLORS.birdWing;
  ctx.beginPath();
  ctx.ellipse(0, 2, 10, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLORS.birdDark;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = COLORS.birdEye;
  ctx.beginPath();
  ctx.arc(8, -5, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.fillStyle = COLORS.birdPupil;
  ctx.beginPath();
  ctx.arc(9.5, -4.5, 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(10.5, -5.5, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = COLORS.birdBeak;
  ctx.beginPath();
  ctx.moveTo(14, -1);
  ctx.lineTo(22, 2);
  ctx.lineTo(14, 5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawScore(ctx: CanvasRenderingContext2D, score: number) {
  const text = String(score);
  ctx.font = "bold 48px 'Trebuchet MS', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.textShadow;
  ctx.fillText(text, GAME_WIDTH / 2 + 2, 62);
  ctx.fillStyle = COLORS.text;
  ctx.strokeStyle = COLORS.textShadow;
  ctx.lineWidth = 3;
  ctx.strokeText(text, GAME_WIDTH / 2, 60);
  ctx.fillText(text, GAME_WIDTH / 2, 60);
}

export function checkCollision(bird: Bird, pipes: Pipe[]): boolean {
  const bx = bird.x + 4;
  const by = bird.y + 4;
  const bw = BIRD_SIZE - 8;
  const bh = BIRD_SIZE - 8;
  if (by + bh >= GAME_HEIGHT - GROUND_HEIGHT || by <= 0) return true;
  for (const pipe of pipes) {
    const px = pipe.x;
    const topH = pipe.gapY;
    const bottomY = pipe.gapY + PIPE_GAP;
    if (bx + bw > px && bx < px + PIPE_WIDTH) {
      if (by < topH || by + bh > bottomY) return true;
    }
  }
  return false;
}
