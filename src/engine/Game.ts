import { Letter, LetterState } from "../entities/Letter"
import { Particle } from "../entities/Particle"
import { Spawner } from "../systems/Spawner"
import { Input } from "../systems/Input"
import { HUD } from "../ui/HUD"

export class Game {
  ctx: CanvasRenderingContext2D
  letters: Letter[] = []
  particles: Particle[] = []
  spawner: Spawner
  hud: HUD

  last = 0
  spawnTimer = 0
  spawnInterval = 900

  screenShake = 0

  score = 0
  lives = 10
  level = 1
  isStarted = false
  gameOverNotified = false
  onGameOver: ((score: number) => void) | null = null

  get isGameOver() {
    return this.lives <= 0
  }

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error()

    this.ctx = ctx

    this.spawner = new Spawner(canvas.width)
    this.hud = new HUD()

    new Input((k) => this.shoot(k))
  }

  start() {
    requestAnimationFrame((t) => this.loop(t))
  }

  startNewGame() {
    this.letters = []
    this.particles = []
    this.score = 0
    this.lives = 10
    this.level = 1
    this.spawnTimer = 0
    this.spawnInterval = 900
    this.screenShake = 0
    this.gameOverNotified = false
    this.isStarted = true
  }

  loop(t: number) {
    const delta = t - this.last
    this.last = t

    this.update(delta)
    this.render()

    requestAnimationFrame((t) => this.loop(t))
  }

  update(delta: number) {
    if (!this.isStarted) {
      return
    }

    if (this.isGameOver) {
      if (!this.gameOverNotified) {
        this.letters = []
        this.particles = []
        this.screenShake = 0
        this.gameOverNotified = true
        this.onGameOver?.(this.score)
      }
      return
    }

    this.spawnTimer += delta

    if (this.spawnTimer > this.spawnInterval) {
      this.letters.push(this.spawner.spawn(this.level))
      this.spawnTimer = 0
    }

    this.letters.forEach((l) => {
      l.update(delta)

      if (l.y > this.canvas.height && l.state === LetterState.Falling) {
        l.state = LetterState.Dead
        this.lives = Math.max(0, this.lives - 1)
        this.screenShake = 15
      }
    })

    this.particles.forEach((p) => p.update(delta))

    this.letters = this.letters.filter((l) => l.state !== LetterState.Dead)
    this.particles = this.particles.filter((p) => p.life > 0)

    const maxLevel = this.spawner.getMaxLevel()
    const levelByScore = Math.floor(this.score / 10) + 1
    const nextLevel = Math.min(maxLevel, levelByScore)
    if (nextLevel > this.level) {
      const levelsGained = nextLevel - this.level
      this.level = nextLevel
      this.spawnInterval *= 0.9 ** levelsGained
    }

    if (this.screenShake > 0) {
      this.screenShake -= 1
    }
  }

  shoot(key: string) {
    if (!this.isStarted || this.isGameOver) {
      return
    }

    const target = this.letters.find(
      (l) => l.char === key && l.state === LetterState.Falling
    )

    if (target) {
      target.pop()
      this.score++

      for (let i = 0; i < 8; i++) {
        this.particles.push(
          new Particle(
            target.x,
            target.y,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            300
          )
        )
      }
    }
  }

  render() {
    const shakeX = (Math.random() - 0.5) * this.screenShake
    const shakeY = (Math.random() - 0.5) * this.screenShake

    this.ctx.setTransform(1, 0, 0, 1, shakeX, shakeY)

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.letters.forEach((l) => l.draw(this.ctx))
    this.particles.forEach((p) => p.draw(this.ctx))

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)

    this.hud.draw(this.ctx, this.score, this.lives, this.level)
  }
}
