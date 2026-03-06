import { Letter } from "../entities/Letter"

export class Spawner {
  // Classic touch-typing progression:
  // home row -> top row -> bottom row -> numbers
  letters = "fjdkslaghruieowpqtnvmcbxyz1234567890"

  static readonly LETTER_RADIUS = 26
  static readonly SPAWN_Y = 0
  static readonly X_PADDING = 30
  static readonly MAX_SPAWN_ATTEMPTS = 10
  static readonly MIN_X_DISTANCE = 56
  static readonly OVERLAP_CHECK_Y = 130

  constructor(private width: number) {}

  getMaxLevel() {
    return Math.ceil(this.letters.length / 2)
  }

  getLettersForLevel(level: number) {
    const allowedCount = Math.min(this.letters.length, Math.max(2, level * 2))
    return this.letters.slice(0, allowedCount)
  }

  spawn(level: number, activeLetters: Letter[]): Letter | null {
    const allowedLetters = this.getLettersForLevel(level)
    const char = allowedLetters[Math.floor(Math.random() * allowedLetters.length)]
    const speedTier = Math.floor((level - 1) / 5)
    const speed = 0.55 + speedTier * 0.15

    for (let attempt = 0; attempt < Spawner.MAX_SPAWN_ATTEMPTS; attempt++) {
      const x = Math.random() * (this.width - Spawner.X_PADDING * 2) + Spawner.X_PADDING
      const hasOverlap = activeLetters.some(
        (letter) =>
          letter.y < Spawner.OVERLAP_CHECK_Y &&
          Math.abs(letter.x - x) < Spawner.MIN_X_DISTANCE
      )

      if (!hasOverlap) {
        return new Letter(char, x, Spawner.SPAWN_Y, speed)
      }
    }

    return null
  }
}
