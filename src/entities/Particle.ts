
export class Particle {
  constructor(
    public x: number,
    public y: number,
    public vx: number,
    public vy: number,
    public life: number
  ) {}

  update(delta: number) {
    this.x += this.vx * delta * 0.05;
    this.y += this.vy * delta * 0.05;
    this.life -= delta;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = Math.max(0, this.life / 300);
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#a6ecff";
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
