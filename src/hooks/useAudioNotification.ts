import { useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { usePlayerStore } from '../store/playerStore'

const CHANNEL_ID = 'audio-player'
const PLAY_PAUSE_ACTION = 'play-pause'
const STOP_ACTION = 'stop'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: false,
  }),
})

export function useAudioNotification() {
  const lastNotificationId = useRef<string | null>(null)

  useEffect(() => {
    async function setup() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'Audio Player',
          importance: Notifications.AndroidImportance.LOW,
        })
      }

      await Notifications.setNotificationCategoryAsync('audio', [
        {
          identifier: PLAY_PAUSE_ACTION,
          buttonTitle: 'Play/Pause',
          options: {
            opensAppToForeground: false,
            isAuthenticationRequired: false,
          },
        },
        {
          identifier: STOP_ACTION,
          buttonTitle: 'Stop',
          options: {
            opensAppToForeground: false,
            isAuthenticationRequired: false,
            isDestructive: true,
          },
        },
      ])
    }

    setup()
  }, [])
}

export function usePlayerNotification() {
  const lastNotificationId = useRef<string | null>(null)

  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state) => {
      const { isPlaying, activeSounds, activeScene } = state

      if (!isPlaying || activeSounds.length === 0) {
        if (lastNotificationId.current) {
          Notifications.dismissNotificationAsync(lastNotificationId.current)
          lastNotificationId.current = null
        }
        return
      }

      const body = activeScene ?? `${activeSounds.length} sound${activeSounds.length > 1 ? 's' : ''}`

      Notifications.scheduleNotificationAsync({
        identifier: 'audio-player-active',
        content: {
          title: 'Drift Sound',
          body,
          color: '#6C8EFF',
          sticky: true,
          autoDismiss: false,
          categoryIdentifier: 'audio',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          ...(Platform.OS === 'android' ? {
            channelId: CHANNEL_ID,
            ongoing: true,
          } : {}),
        },
        trigger: null,
      }).then((id) => {
        lastNotificationId.current = id
      })
    })

    return () => unsub()
  }, [])
}

export function setupNotificationResponseHandler() {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const { actionIdentifier } = response

    if (actionIdentifier === PLAY_PAUSE_ACTION) {
      const state = usePlayerStore.getState()
      if (state.isPlaying) {
        state.pause()
      } else {
        state.resume()
      }
    } else if (actionIdentifier === STOP_ACTION) {
      usePlayerStore.getState().stop()
    }
  })

  return sub
}
