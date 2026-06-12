import { useEffect, useCallback } from 'react'
import { useRewardedAd } from 'react-native-google-mobile-ads'
import { AD_UNIT_IDS } from '../constants/ads'
import { usePreferencesStore } from '../store/preferencesStore'

export function useSceneUnlock() {
  const premiumUnlocked = usePreferencesStore(s => s.premiumUnlocked)
  const setPremiumUnlocked = usePreferencesStore(s => s.setPremiumUnlocked)

  const { isLoaded, isClosed, isEarnedReward, load, show } = useRewardedAd(
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
