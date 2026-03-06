import { Letter } from "../entities/Letter"

export class Spawner {
  letters = "abcdefghijklmnopqrstuvwxyz"

  constructor(private width: number) {}

  getMaxLevel() {
    return Math.ceil(this.letters.length / 2)
  }

  getLettersForLevel(level: number) {
    const allowedCount = Math.min(this.letters.length, Math.max(2, level * 2))
    return this.letters.slice(0, allowedCount)
  }

  spawn(level: number) {
    const allowedLetters = this.getLettersForLevel(level)
    const char = allowedLetters[Math.floor(Math.random() * allowedLetters.length)]
    const x = Math.random() * (this.width - 60) + 30
    const speed = 1 //+ level * 0.6

    return new Letter(char, x, 0, speed)
  }
}
