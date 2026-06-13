import { audioEngine } from './AudioEngine'

type FadeCallback = () => void

// All fades are wall-clock based: each tick derives progress from elapsed time
// instead of incrementing a counter inside an async interval, so slow ticks can
// never stack or read stale step state. Volume application is synchronous on
// the engine, so ticks cannot overlap themselves either.
class FadeSchedulerClass {
  private sleepTimerId: ReturnType<typeof setTimeout> | null = null
  private wakeTimerId: ReturnType<typeof setTimeout> | null = null
  private fadeIntervalId: ReturnType<typeof setInterval> | null = null

  scheduleSleepFade(
    durationMs: number,
    fadeOutMs: number,
    onComplete?: FadeCallback
  ) {
    this.cancelSleep()

    const fadeMs = Math.max(250, Math.min(fadeOutMs, durationMs))
    const delayMs = Math.max(0, durationMs - fadeMs)

    this.sleepTimerId = setTimeout(() => {
      this.startFade(1, 0, fadeMs, () => {
        onComplete?.()
      })
    }, delayMs)
  }

  scheduleWakeFade(
    wakeTime: string,
    fadeStartMinutes: number,
    onComplete?: FadeCallback
  ) {
    this.cancelWake()

    const [hours, minutes] = wakeTime.split(':').map(Number)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return

    const now = new Date()
    const wake = new Date(now)
    wake.setHours(hours, minutes, 0, 0)
    if (wake.getTime() <= now.getTime()) {
      wake.setDate(wake.getDate() + 1)
    }

    const fadeMs = Math.max(1, fadeStartMinutes) * 60 * 1000
    const delayMs = Math.max(0, wake.getTime() - fadeMs - now.getTime())

    this.wakeTimerId = setTimeout(() => {
      this.startFade(0, 1, fadeMs, () => {
        onComplete?.()
      })
    }, delayMs)
  }

  private startFade(
    from: number,
    to: number,
    durationMs: number,
    onDone?: FadeCallback
  ) {
    this.cleanupFade()

    const start = Date.now()
    audioEngine.setFadeFactor(from)

    this.fadeIntervalId = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / durationMs)
      const eased = to > from ? t * t : 1 - (1 - t) * (1 - t)
      audioEngine.setFadeFactor(from + (to - from) * eased)

      if (t >= 1) {
        this.cleanupFade()
        onDone?.()
      }
    }, 200)
  }

  private cleanupFade() {
    if (this.fadeIntervalId !== null) {
      clearInterval(this.fadeIntervalId)
      this.fadeIntervalId = null
    }
  }

  cancelSleep() {
    if (this.sleepTimerId !== null) {
      clearTimeout(this.sleepTimerId)
      this.sleepTimerId = null
    }
    this.cleanupFade()
  }

  cancelWake() {
    if (this.wakeTimerId !== null) {
      clearTimeout(this.wakeTimerId)
      this.wakeTimerId = null
    }
    this.cleanupFade()
  }

  cancelAll() {
    this.cancelSleep()
    this.cancelWake()
    audioEngine.resetFadeFactor()
  }
}

export const fadeScheduler = new FadeSchedulerClass()
