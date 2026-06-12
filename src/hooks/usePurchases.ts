import { useEffect, useCallback } from 'react'
import Purchases from 'react-native-purchases'
import { REVENUECAT_API_KEY } from '../constants/ads'
import { usePreferencesStore } from '../store/preferencesStore'

export function usePurchases() {
  const setPremiumUnlocked = usePreferencesStore(s => s.setPremiumUnlocked)
  const premiumUnlocked = usePreferencesStore(s => s.premiumUnlocked)

  useEffect(() => {
    if (!REVENUECAT_API_KEY) return

    Purchases.configure({ apiKey: REVENUECAT_API_KEY, store: 'PLAY_STORE' })
  }, [])

  const purchaseUnlock = useCallback(async () => {
    try {
      const offerings = await Purchases.getOfferings()
      const current = offerings.current
      if (!current?.availablePackages?.[0]) {
        return false
      }

      const pkg = current.availablePackages[0]
      const { customerInfo } = await Purchases.purchasePackage(pkg)
      const unlocked = !!customerInfo.entitlements.active['premium']
      if (unlocked) {
        setPremiumUnlocked(true)
      }
      return unlocked
    } catch {
      return false
    }
  }, [setPremiumUnlocked])

  const restorePurchases = useCallback(async () => {
    try {
      const customerInfo = await Purchases.restorePurchases()
      const unlocked = !!customerInfo.entitlements.active['premium']
      if (unlocked) {
        setPremiumUnlocked(true)
      }
      return unlocked
    } catch {
      return false
    }
  }, [setPremiumUnlocked])

  return { purchaseUnlock, restorePurchases, premiumUnlocked }
}
