import * as TaskManager from 'expo-task-manager'
import * as BackgroundTasks from 'expo-background-task'

const AUDIO_BACKGROUND_TASK = 'audio-foreground-service'

TaskManager.defineTask(AUDIO_BACKGROUND_TASK, async () => {
  return BackgroundTasks.BackgroundTaskResult.Success
})

export async function registerBackgroundAudio() {
  const registered = await TaskManager.isTaskRegisteredAsync(AUDIO_BACKGROUND_TASK)
  if (!registered) {
    await BackgroundTasks.registerTaskAsync(AUDIO_BACKGROUND_TASK, {
      minimumInterval: 15,
    })
  }
}

export async function unregisterBackgroundAudio() {
  if (await TaskManager.isTaskRegisteredAsync(AUDIO_BACKGROUND_TASK)) {
    await TaskManager.unregisterTaskAsync(AUDIO_BACKGROUND_TASK)
  }
}

export { AUDIO_BACKGROUND_TASK }
