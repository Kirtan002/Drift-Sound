import { useEffect, useCallback } from 'react'
import { AD_UNIT_IDS } from '../constants/ads'
import { usePreferencesStore } from '../store/preferencesStore'

let useRewardedAdHook: any = null
try {
  useRewardedAdHook = require('react-native-google-mobile-ads').useRewardedAd
} catch {}

interface AdState {
  isLoaded: boolean
  isClosed: boolean
  isEarnedReward: boolean
  load: () => void
  show: () => void
}

function useRewardedAdSafe(adUnitId: string, options: any): AdState {
  if (useRewardedAdHook) {
    return useRewardedAdHook(adUnitId, options)
  }
  return { isLoaded: false, isClosed: false, isEarnedReward: false, load: () => {}, show: () => {} }
}

export function useSceneUnlock() {
  const premiumUnlocked = usePreferencesStore(s => s.premiumUnlocked)
  const setPremiumUnlocked = usePreferencesStore(s => s.setPremiumUnlocked)

  const { isLoaded, isClosed, isEarnedReward, load, show } = useRewardedAdSafe(
    AD_UNIT_IDS.REWARDED,
    { requestNonPersonalizedAdsOnly: true }
  )

  useEffect(() => {
    if (!premiumUnlocked && isEarnedReward) {
      setPremiumUnlocked(true)
    }
  }, [isEarnedReward, premiumUnlocked, setPremiumUnlocked])

  useEffect(() => {
    if (isClosed && !isEarnedReward) {
      load()
    }
  }, [isClosed, isEarnedReward, load])

  const watchAd = useCallback(() => {
    if (isLoaded) {
      show()
    } else {
      load()
    }
  }, [isLoaded, load, show])

  return { watchAd, isAdLoaded: isLoaded, premiumUnlocked, unlockAll: () => setPremiumUnlocked(true) }
}
