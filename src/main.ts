
import { Game } from "./engine/Game"
import type { SymbolSet } from "./systems/Spawner"

const container = document.createElement("div")
container.className = "game-container"
document.body.appendChild(container)

const canvas = document.createElement("canvas")
canvas.width = 900
canvas.height = 600
container.appendChild(canvas)

const startOverlay = document.createElement("div")
startOverlay.className = "overlay"
startOverlay.innerHTML = `
  <h1>Typing Shooter</h1>
  <p>Печатай буквы на падающих шарах</p>
  <div class="symbol-picker">
    <button data-symbol-set="en" class="active">English</button>
    <button data-symbol-set="ru">Русский</button>
  </div>
  <button data-role="start">Начать игру</button>
`
container.appendChild(startOverlay)

const gameOverOverlay = document.createElement("div")
gameOverOverlay.className = "overlay hidden"
gameOverOverlay.innerHTML = `
  <h1>Game Over</h1>
  <p>Финальный счёт: <span id="final-score">0</span></p>
  <button>Повторить</button>
`
container.appendChild(gameOverOverlay)

const game = new Game(canvas)

const startButton = startOverlay.querySelector('[data-role="start"]')
const symbolSetButtons = startOverlay.querySelectorAll("[data-symbol-set]")
const retryButton = gameOverOverlay.querySelector("button")
const finalScore = gameOverOverlay.querySelector("#final-score")
let selectedSymbolSet: SymbolSet = "en"

if (!(startButton instanceof HTMLButtonElement)) {
  throw new Error("Start button not found")
}

if (!(retryButton instanceof HTMLButtonElement)) {
  throw new Error("Retry button not found")
}

if (!(finalScore instanceof HTMLSpanElement)) {
  throw new Error("Final score label not found")
}

if (symbolSetButtons.length === 0) {
  throw new Error("Symbol set buttons not found")
}

symbolSetButtons.forEach((button) => {
  if (!(button instanceof HTMLButtonElement)) {
    return
  }

  button.addEventListener("click", () => {
    const symbolSet = button.dataset.symbolSet
    if (symbolSet !== "en" && symbolSet !== "ru") {
      return
    }

    selectedSymbolSet = symbolSet

    symbolSetButtons.forEach((other) => {
      other.classList.toggle("active", other === button)
    })
  })
})

const startGame = () => {
  game.setSymbolSet(selectedSymbolSet)
  startOverlay.classList.add("hidden")
  gameOverOverlay.classList.add("hidden")
  game.startNewGame()
}

startButton.addEventListener("click", startGame)
retryButton.addEventListener("click", startGame)

game.onGameOver = (score) => {
  finalScore.textContent = String(score)
  gameOverOverlay.classList.remove("hidden")
}

game.start()
