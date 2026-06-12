import { Platform } from 'react-native'

const REVENUECAT_KEY = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY ?? ''
const ADMOB_ANDROID = process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID ?? ''
const ADMOB_IOS = process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS ?? ''

export const AD_UNIT_IDS = {
  REWARDED: Platform.select({
    android: ADMOB_ANDROID,
    ios: ADMOB_IOS,
  }) ?? '',
  BANNER: Platform.select({
    android: 'ca-app-pub-3940256099942544/6300978111',
    ios: 'ca-app-pub-3940256099942544/2934735716',
  }) ?? '',
}

export { REVENUECAT_KEY as REVENUECAT_API_KEY }

export const DRIFT_HANDSHAKE_TOKEN = process.env.EXPO_PUBLIC_DRIFT_HANDSHAKE_TOKEN ?? ''
