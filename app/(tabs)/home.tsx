import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore } from '../../src/store/playerStore'
import { SOUNDS, POPULAR_IDS, SOUND_BY_ID } from '../../src/constants/sounds'
import { SCENES } from '../../src/constants/scenes'
import { S, hPad, gridGap } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { SceneCard } from '../../src/components/sounds/SceneCard'
import { SoundCard } from '../../src/components/sounds/SoundCard'
import { HeroPlayer } from '../../src/components/player/HeroPlayer'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { NightShield } from '../../src/components/player/NightShield'
import { ScreenBackground } from '../../src/components/ui/ScreenBackground'
import { ThemeIcon } from '../../src/components/ui/ThemeIcon'
import { IconButton } from '../../src/components/ui/IconButton'
import { Icon } from '../../src/components/ui/Icon'
import { LazyBannerAd } from '../../src/components/ads/LazyBannerAd'
import { BottomSheet } from '../../src/components/ui/BottomSheet'
import { PressableScale } from '../../src/components/ui/PressableScale'
import Animated, { FadeIn } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useSceneUnlock } from '../../src/hooks/useRewardedAd'
import { usePurchases } from '../../src/hooks/usePurchases'
import type { Scene, Sound } from '../../src/types/sound'

function getGreeting(): { title: string; subtitle: string } {
  const h = new Date().getHours()
  if (h >= 21 || h < 6) return { title: 'Ready to drift?', subtitle: 'Pick a scene or build your own mix' }
  if (h < 12) return { title: 'Good morning', subtitle: 'Ease into the day with sound' }
  if (h < 18) return { title: 'Focus or rest?', subtitle: 'Set the mood for the afternoon' }
  return { title: 'Wind down', subtitle: 'Let the evening settle in' }
}

function HomeScreenInner() {
  const { colors } = useTheme()
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const addSound = usePlayerStore(s => s.addSound)
  const play = usePlayerStore(s => s.play)
  const setActiveScene = usePlayerStore(s => s.setActiveScene)
  const timerEndTime = usePlayerStore(s => s.timerEndTime)

  const [unlockSheetVisible, setUnlockSheetVisible] = useState(false)
  const [lockedScene, setLockedScene] = useState<Scene | null>(null)
  const [nightShield, setNightShield] = useState(false)
  const { watchAd, isAdLoaded, premiumUnlocked } = useSceneUnlock()
  const { purchaseUnlock } = usePurchases()

  const hasAudio = activeSounds.length > 0
  const greeting = useMemo(() => getGreeting(), [])

  const quickSounds = useMemo(
    () => SOUNDS.filter(s => POPULAR_IDS.includes(s.id)).slice(0, 9) as Sound[],
    []
  )

  const timerLabel = useMemo(() => {
    if (!timerEndTime) return null
    const remaining = Math.max(0, Math.floor((timerEndTime - Date.now()) / 60000))
    if (remaining <= 0) return null
    return `${remaining}m`
  }, [timerEndTime])

  const handleScenePress = useCallback((scene: Scene) => {
    if (scene.locked && !premiumUnlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
      setLockedScene(scene)
      setUnlockSheetVisible(true)
      return
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    const sounds = scene.sounds.map(s => {
      const def = SOUND_BY_ID[s.soundId]
      return {
        id: s.soundId,
        name: def?.name ?? s.soundId,
        volume: s.volume,
        file: def?.file ?? `${s.soundId}.mp3`,
        emoji: def?.emoji,
      }
    })
    setActiveScene(scene.name)
    play(sounds)
  }, [play, setActiveScene, premiumUnlocked])

  const handleQuickSound = useCallback((sound: Sound) => {
    if (hasAudio) {
      addSound({ id: sound.id, name: sound.name, volume: 0.6, file: sound.file, url: sound.url, emoji: sound.emoji })
    } else {
      setActiveScene(null)
      play([{ id: sound.id, name: sound.name, volume: 0.8, file: sound.file, url: sound.url, emoji: sound.emoji }])
    }
  }, [hasAudio, addSound, play, setActiveScene])

  const handleShuffle = useCallback(() => {
    const free = SCENES.filter(s => !s.locked)
    const random = free[Math.floor(Math.random() * free.length)]
    if (random) handleScenePress(random)
  }, [handleScenePress])

  const handleWatchAd = useCallback(() => {
    watchAd()
    setUnlockSheetVisible(false)
  }, [watchAd])

  const handlePurchaseAll = useCallback(async () => {
    await purchaseUnlock()
    setUnlockSheetVisible(false)
  }, [purchaseUnlock])

  const handleCloseUnlock = useCallback(() => {
    setUnlockSheetVisible(false)
    setLockedScene(null)
  }, [])

  const header = (
    <View style={[styles.header, { paddingHorizontal: hPad }]}>
      <View style={styles.brandRow}>
        <View style={[styles.brandMark, { backgroundColor: colors.accentDim }]}>
          <Icon name="moon" size={18} color={colors.accent} />
        </View>
        <Text style={[type.headingM, { color: colors.textPrimary }]}>Drift Sound</Text>
      </View>
      <View style={styles.headerRight}>
        <ThemeIcon />
        <IconButton icon="settings" onPress={() => router.push('/settings')} />
      </View>
    </View>
  )

  if (hasAudio) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          {header}
          <Animated.View entering={FadeIn.duration(400)} style={styles.heroArea}>
            <HeroPlayer />
          </Animated.View>
          <View style={[styles.controlRow, { paddingHorizontal: hPad }]}>
            <IconButton icon="shuffle" onPress={handleShuffle} variant="soft" />
            <PressableScale
              onPress={() => router.push('/(tabs)/timer')}
              style={[styles.timerBadge, { backgroundColor: colors.accentDim }]}
            >
              <Icon name="timer" size={16} color={colors.accent} />
              <Text style={[styles.timerLabel, { color: colors.accent }]}>{timerLabel ?? 'Timer'}</Text>
            </PressableScale>
            <IconButton icon="sliders" onPress={() => router.push('/(tabs)/mixer')} variant="soft" />
            <IconButton icon="moon" onPress={() => setNightShield(true)} variant="soft" />
          </View>
          <MiniPlayer />
          <LazyBannerAd />
        </SafeAreaView>
        {nightShield && <NightShield onDismiss={() => setNightShield(false)} />}
      </ScreenBackground>
    )
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.greetingSection, { paddingHorizontal: hPad }]}>
            <Text style={[type.headingL, { color: colors.textPrimary }]}>{greeting.title}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{greeting.subtitle}</Text>
          </View>

          <View style={[styles.sectionHead, { paddingHorizontal: hPad }]}>
            <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>SCENES</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.scenesScroll, { paddingLeft: hPad }]}
          >
            {SCENES.map(scene => (
              <SceneCard key={scene.id} scene={scene} onPress={handleScenePress} unlocked={premiumUnlocked} />
            ))}
          </ScrollView>

          <View style={[styles.sectionHead, { paddingHorizontal: hPad, marginTop: S.xxxl }]}>
            <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>QUICK PLAY</Text>
          </View>
          <View style={[styles.quickGrid, { paddingHorizontal: hPad }]}>
            {quickSounds.map(sound => (
              <SoundCard key={sound.id} sound={sound} onPress={handleQuickSound} />
            ))}
          </View>
          <View style={styles.spacer} />
        </ScrollView>
        <LazyBannerAd />
      </SafeAreaView>

      {lockedScene && (
        <BottomSheet visible={unlockSheetVisible} onClose={handleCloseUnlock} title="Unlock this scene">
          <View style={styles.unlockContent}>
            <Text style={styles.unlockEmoji}>{lockedScene.emoji}</Text>
            <Text style={[type.headingM, { color: colors.textPrimary }]}>{lockedScene.name}</Text>
            <Text style={[styles.unlockDesc, { color: colors.textSecondary }]}>{lockedScene.description}</Text>

            <PressableScale onPress={handleWatchAd} style={[styles.unlockBtn, { backgroundColor: colors.accent }]}>
              <Icon name="play" size={16} color="#fff" />
              <Text style={styles.unlockBtnLabel}>{isAdLoaded ? 'Watch ad to unlock' : 'Loading ad…'}</Text>
            </PressableScale>
            <PressableScale onPress={handlePurchaseAll} style={[styles.unlockBtn, { backgroundColor: colors.amber }]}>
              <Icon name="sparkles" size={16} color="#1A1A22" />
              <Text style={[styles.unlockBtnLabel, { color: '#1A1A22' }]}>Unlock all — $2.99</Text>
            </PressableScale>
            <Pressable onPress={handleCloseUnlock} style={styles.unlockCancel}>
              <Text style={[styles.unlockCancelText, { color: colors.textMuted }]}>Not now</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}
    </ScreenBackground>
  )
}

export default React.memo(HomeScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: S.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: S.sm,
    paddingBottom: S.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  greetingSection: {
    paddingTop: S.xl,
    paddingBottom: S.xl,
    gap: 6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  sectionHead: {
    paddingBottom: S.md,
  },
  scenesScroll: {
    paddingRight: hPad,
    paddingBottom: S.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: gridGap,
  },
  heroArea: {
    flex: 1,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: S.md,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    borderRadius: 22,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  spacer: { height: 80 },
  unlockContent: {
    alignItems: 'center',
    gap: S.md,
    paddingTop: S.sm,
  },
  unlockEmoji: { fontSize: 52 },
  unlockDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: S.md,
  },
  unlockBtn: {
    flexDirection: 'row',
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: S.sm,
    marginTop: S.xs,
  },
  unlockBtnLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  unlockCancel: { paddingVertical: S.sm },
  unlockCancelText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
})
