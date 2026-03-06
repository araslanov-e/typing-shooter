
export class HUD {
  draw(ctx: CanvasRenderingContext2D, score: number, lives: number, level: number) {
    ctx.save()
    ctx.font = "20px Arial"
    ctx.fillStyle = "white"
    ctx.textAlign = "left"
    ctx.textBaseline = "alphabetic"
    ctx.fillText("Score: " + score, 15, 30)
    ctx.fillText("Lives: " + lives, 15, 55)
    ctx.fillText("Level: " + level, 15, 80)
    ctx.restore()
  }
}
