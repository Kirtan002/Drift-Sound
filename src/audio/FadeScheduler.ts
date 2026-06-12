import { audioEngine } from './AudioEngine'
import type { ActiveSound } from '../types/sound'

type FadeCallback = () => void

class FadeSchedulerClass {
  private sleepTimerId: ReturnType<typeof setTimeout> | null = null
  private wakeTimerId: ReturnType<typeof setTimeout> | null = null
  private fadeIntervalId: ReturnType<typeof setInterval> | null = null
  private onSleepComplete: FadeCallback | null = null
  private onWakeComplete: FadeCallback | null = null

  scheduleSleepFade(
    durationMs: number,
    fadeOutMs: number,
    onComplete?: FadeCallback
  ) {
    this.cancelSleep()

    this.onSleepComplete = onComplete ?? null

    this.sleepTimerId = setTimeout(() => {
      this.startFadeOut(fadeOutMs)
    }, durationMs - fadeOutMs)
  }

  private async startFadeOut(durationMs: number) {
    const steps = Math.min(30, Math.max(10, Math.floor(durationMs / 100)))
    const intervalMs = durationMs / steps
    let currentStep = 0

    this.fadeIntervalId = setInterval(async () => {
      currentStep++
      const t = currentStep / steps
      const eased = 1 - (1 - t) * (1 - t)
      const targetVolume = 1 - eased

      try {
        await audioEngine.setMasterVolume(Math.max(0, targetVolume))
      } catch {}

      if (currentStep >= steps) {
        this.cleanupFade()
        await audioEngine.stopAll()
        this.onSleepComplete?.()
      }
    }, intervalMs)
  }

  scheduleWakeFade(
    wakeTime: string,
    fadeStartMinutes: number,
    sounds: ActiveSound[],
    onComplete?: FadeCallback
  ) {
    this.cancelWake()

    this.onWakeComplete = onComplete ?? null

    const [hours, minutes] = wakeTime.split(':').map(Number)
    const now = new Date()
    const wake = new Date(now)
    wake.setHours(hours, minutes, 0, 0)

    if (wake <= now) {
      wake.setDate(wake.getDate() + 1)
    }

    const fadeStartMs = wake.getTime() - fadeStartMinutes * 60 * 1000
    const nowMs = now.getTime()
    const delayMs = Math.max(0, fadeStartMs - nowMs)

    this.wakeTimerId = setTimeout(() => {
      this.startFadeIn(fadeStartMinutes * 60 * 1000)
    }, delayMs)
  }

  private async startFadeIn(durationMs: number) {
    const steps = Math.min(40, Math.max(10, Math.floor(durationMs / 100)))
    const intervalMs = durationMs / steps
    let currentStep = 0

    await audioEngine.setMasterVolume(0)

    this.fadeIntervalId = setInterval(async () => {
      currentStep++
      const t = currentStep / steps
      const targetVolume = t * t

      try {
        await audioEngine.setMasterVolume(Math.min(1, targetVolume))
      } catch {}

      if (currentStep >= steps) {
        this.cleanupFade()
        this.onWakeComplete?.()
      }
    }, intervalMs)
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
    this.onSleepComplete = null
  }

  cancelWake() {
    if (this.wakeTimerId !== null) {
      clearTimeout(this.wakeTimerId)
      this.wakeTimerId = null
    }
    this.cleanupFade()
    this.onWakeComplete = null
  }

  cancelAll() {
    this.cancelSleep()
    this.cancelWake()
  }
}

export const fadeScheduler = new FadeSchedulerClass()
