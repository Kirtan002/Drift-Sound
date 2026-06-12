import React, { useRef, useState, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { AD_UNIT_IDS } from '../../constants/ads'

interface LazyBannerAdProps {
  delayMs?: number
  adUnitId?: string
}

function LazyBannerAdInner({ delayMs = 30000, adUnitId = AD_UNIT_IDS.BANNER }: LazyBannerAdProps) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'loaded' | 'failed'>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestedRef = useRef(false)

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    requestedRef.current = false
  }, [])

  useFocusEffect(
    useCallback(() => {
      setPhase('idle')

      timerRef.current = setTimeout(() => {
        if (!requestedRef.current) {
          requestedRef.current = true
          setPhase('loading')
        }
      }, delayMs)

      return () => {
        cleanup()
        setPhase('idle')
      }
    }, [delayMs, cleanup])
  )

  const handleAdLoaded = useCallback(() => {
    setPhase('loaded')
  }, [])

  const handleAdFailed = useCallback(() => {
    setPhase('failed')
  }, [])

  if (phase === 'idle' || phase === 'failed') return null

  let BannerAd: any = null
  let BannerAdSize: any = null
  try {
    const ads = require('react-native-google-mobile-ads')
    BannerAd = ads.BannerAd
    BannerAdSize = ads.BannerAdSize
  } catch {}

  if (!BannerAd) return null

  return (
    <View style={styles.wrapper} pointerEvents={phase === 'loading' ? 'none' : 'auto'}>
      <View style={phase === 'loaded' ? styles.container : styles.hidden}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailed}
        />
      </View>
    </View>
  )
}

export const LazyBannerAd = React.memo(LazyBannerAdInner)

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    paddingVertical: 8,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
  },
})
