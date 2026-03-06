
export enum LetterState {
  Falling,
  Popping,
  Dead,
}

export class Letter {
  state = LetterState.Falling
  popTime = 0
  spawnTime = 0

  constructor(
    public char: string,
    public x: number,
    public y: number,
    public speed: number
  ) {}

  update(delta: number) {
    this.spawnTime += delta;

    if (this.state === LetterState.Falling) {
      this.y += this.speed * delta * 0.05;
    }

    if (this.state === LetterState.Popping) {
      this.popTime += delta;
      if (this.popTime > 300) {
        this.state = LetterState.Dead;
      }
    }
  }

  pop() {
    this.state = LetterState.Popping;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.state === LetterState.Falling) {
      const scale = Math.min(1, this.spawnTime / 200);
      this.drawBubble(ctx, scale);
    }

    if (this.state === LetterState.Popping) {
      const progress = this.popTime / 300;
      const scale = 1 + progress * 0.8;
      const alpha = 1 - progress;

      ctx.globalAlpha = alpha;
      this.drawBubble(ctx, scale);
      ctx.globalAlpha = 1;
    }
  }

  drawBubble(ctx: CanvasRenderingContext2D, scale: number) {
    const r = 26 * scale;

    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#5fd1ff";
    ctx.fill();
    ctx.strokeStyle = "#2d9fcc";
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = `${20 * scale}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.char, this.x, this.y);
  }
}
