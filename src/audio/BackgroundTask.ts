import * as TaskManager from 'expo-task-manager'
import * as BackgroundTasks from 'expo-background-task'

// NOTE: Continuous background audio is kept alive by expo-audio itself
// (`shouldPlayInBackground: true` in AudioEngine.initialize) together with the
// lock-screen / media session claimed in AudioEngine.playSound. expo-background-task
// is NOT a foreground service and cannot keep audio playing on its own — its
// minimum interval is ~15 min and the OS may defer it. We register a lightweight
// task only as a watchdog hook for future use (e.g. re-arming timers); it must
// never be relied on to sustain playback.
const AUDIO_WATCHDOG_TASK = 'audio-watchdog'

let defined = false

function ensureDefined() {
  if (defined) return
  try {
    TaskManager.defineTask(AUDIO_WATCHDOG_TASK, async () => {
      return BackgroundTasks.BackgroundTaskResult.Success
    })
    defined = true
  } catch {}
}

export async function registerBackgroundAudio() {
  try {
    ensureDefined()
    const registered = await TaskManager.isTaskRegisteredAsync(AUDIO_WATCHDOG_TASK)
    if (!registered) {
      await BackgroundTasks.registerTaskAsync(AUDIO_WATCHDOG_TASK, {
        minimumInterval: 15,
      })
    }
  } catch {}
}

export async function unregisterBackgroundAudio() {
  try {
    if (await TaskManager.isTaskRegisteredAsync(AUDIO_WATCHDOG_TASK)) {
      await TaskManager.unregisterTaskAsync(AUDIO_WATCHDOG_TASK)
    }
  } catch {}
}

export { AUDIO_WATCHDOG_TASK }
