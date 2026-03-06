
import { Game } from "./engine/Game"

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
  <button>Начать игру</button>
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

const startButton = startOverlay.querySelector("button")
const retryButton = gameOverOverlay.querySelector("button")
const finalScore = gameOverOverlay.querySelector("#final-score")

if (!(startButton instanceof HTMLButtonElement)) {
  throw new Error("Start button not found")
}

if (!(retryButton instanceof HTMLButtonElement)) {
  throw new Error("Retry button not found")
}

if (!(finalScore instanceof HTMLSpanElement)) {
  throw new Error("Final score label not found")
}

const startGame = () => {
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
