class AudioQueue {
  private queue: (() => Promise<void>)[] = []
  private running = false

  async add(task: () => Promise<void>) {
    this.queue.push(task)

    if (!this.running) {
      this.process()
    }
  }

  private async process() {
    this.running = true

    while (this.queue.length > 0) {
      const task = this.queue.shift()

      if (task) {
        await task()
      }
    }

    this.running = false
  }
}

export const audioQueue = new AudioQueue()