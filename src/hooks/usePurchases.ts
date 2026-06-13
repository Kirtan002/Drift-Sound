import { useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import { REVENUECAT_API_KEY } from '../constants/ads'
import { usePreferencesStore } from '../store/preferencesStore'

// Guarded require so a missing/unlinked native module can never crash the app
// (matches how ads/notifications modules are loaded).
let Purchases: any = null
try {
  Purchases = require('react-native-purchases').default ?? require('react-native-purchases')
} catch {}

export function usePurchases() {
  const setPremiumUnlocked = usePreferencesStore(s => s.setPremiumUnlocked)
  const premiumUnlocked = usePreferencesStore(s => s.premiumUnlocked)

  useEffect(() => {
    if (!Purchases || !REVENUECAT_API_KEY) return
    try {
      // Pick the correct store per platform instead of hardcoding Play Store.
      const store = Platform.OS === 'ios' ? 'APP_STORE' : 'PLAY_STORE'
      Purchases.configure({ apiKey: REVENUECAT_API_KEY, store })
    } catch {}
  }, [])

  const purchaseUnlock = useCallback(async () => {
    if (!Purchases) return false
    try {
      const offerings = await Purchases.getOfferings()
      const pkg = offerings?.current?.availablePackages?.[0]
      if (!pkg) return false

      const { customerInfo } = await Purchases.purchasePackage(pkg)
      const unlocked = !!customerInfo?.entitlements?.active?.['premium']
      if (unlocked) setPremiumUnlocked(true)
      return unlocked
    } catch {
      return false
    }
  }, [setPremiumUnlocked])

  const restorePurchases = useCallback(async () => {
    if (!Purchases) return false
    try {
      const customerInfo = await Purchases.restorePurchases()
      const unlocked = !!customerInfo?.entitlements?.active?.['premium']
      if (unlocked) setPremiumUnlocked(true)
      return unlocked
    } catch {
      return false
    }
  }, [setPremiumUnlocked])

  return { purchaseUnlock, restorePurchases, premiumUnlocked, available: !!Purchases }
}
