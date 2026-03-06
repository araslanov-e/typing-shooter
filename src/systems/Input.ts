
export class Input {
  constructor(private callback: (k: string) => void) {
    window.addEventListener("keydown", (e) => {
      if (e.key.length === 1) {
        this.callback(e.key.toLowerCase())
      }
    })
  }
}
