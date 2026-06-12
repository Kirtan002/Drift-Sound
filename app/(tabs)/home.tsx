import React, { useState, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore } from '../../src/store/playerStore'
import { SOUNDS, POPULAR_IDS } from '../../src/constants/sounds'
import { SCENES } from '../../src/constants/scenes'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { SceneCard } from '../../src/components/sounds/SceneCard'
import { SoundCard } from '../../src/components/sounds/SoundCard'
import { HeroPlayer } from '../../src/components/player/HeroPlayer'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { NightShield } from '../../src/components/player/NightShield'
import { ThemeIcon } from '../../src/components/ui/ThemeIcon'
import { IconButton } from '../../src/components/ui/IconButton'
import { LazyBannerAd } from '../../src/components/ads/LazyBannerAd'
import { BottomSheet } from '../../src/components/ui/BottomSheet'
import { Typography } from '../../src/components/ui/Typography'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useSceneUnlock } from '../../src/hooks/useRewardedAd'
import { usePurchases } from '../../src/hooks/usePurchases'
import type { Scene, Sound } from '../../src/types/sound'

function getGreeting(): { title: string; subtitle: string } {
  const h = new Date().getHours()
  if (h >= 21 || h < 6) return { title: 'Ready to drift?', subtitle: 'Choose a scene or pick your sounds' }
  if (h < 12) return { title: 'Good morning', subtitle: 'Choose a scene or pick your sounds' }
  if (h < 18) return { title: 'Focus or rest?', subtitle: 'Choose a scene or pick your sounds' }
  return { title: 'Wind down time', subtitle: 'Choose a scene or pick your sounds' }
}

function HomeScreenInner() {
  const { colors } = useTheme()
  const isPlaying = usePlayerStore(s => s.isPlaying)
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const activeScene = usePlayerStore(s => s.activeScene)
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
    if (!timerEndTime) return '∞'
    const remaining = Math.max(0, Math.floor((timerEndTime - Date.now()) / 60000))
    if (remaining <= 0) return '∞'
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
      const soundDef = SOUNDS.find(sd => sd.id === s.soundId)
      return {
        id: s.soundId,
        name: soundDef?.name ?? s.soundId,
        volume: s.volume,
        file: soundDef?.file ?? `${s.soundId}.mp3`,
      }
    })
    setActiveScene(scene.id)
    play(sounds)
  }, [play, setActiveScene, premiumUnlocked])

  const handleQuickSound = useCallback((sound: Sound) => {
    if (hasAudio) {
      addSound({ id: sound.id, name: sound.name, volume: 0.6, file: sound.file })
    } else {
      setActiveScene(null)
      play([{ id: sound.id, name: sound.name, volume: 1, file: sound.file }])
    }
  }, [hasAudio, addSound, play, setActiveScene])

  const sceneCards = useMemo(
    () => SCENES.map(scene => (
      <SceneCard key={scene.id} scene={scene} onPress={handleScenePress} />
    )),
    [handleScenePress]
  )

  const quickSoundCards = useMemo(
    () => quickSounds.map(sound => (
      <SoundCard key={sound.id} sound={sound} onPress={handleQuickSound} />
    )),
    [quickSounds, handleQuickSound]
  )

  const handleShuffle = useCallback(() => {
    const freeScenes = SCENES.filter(s => !s.locked)
    const random = freeScenes[Math.floor(Math.random() * freeScenes.length)]
    if (random) handleScenePress(random)
  }, [handleScenePress])

  const handleOpenMixer = useCallback(() => {
    router.push('/(tabs)/mixer')
  }, [])

  const handleOpenSettings = useCallback(() => {
    router.push('/settings')
  }, [])

  const handleOpenTimer = useCallback(() => {
    router.push('/(tabs)/timer')
  }, [])

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

  const handleNightShield = useCallback(() => {
    setNightShield(true)
  }, [])

  const handleNightShieldDismiss = useCallback(() => {
    setNightShield(false)
  }, [])

  if (hasAudio) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { paddingHorizontal: hPad }]}>
          <Text style={[type.headingM, { color: colors.textPrimary }]}>Drift Sound</Text>
          <View style={styles.headerRight}>
            <ThemeIcon />
            <IconButton icon="⚙️" size={22} onPress={handleOpenSettings} />
          </View>
        </View>
        <Animated.View entering={FadeIn.duration(400)} style={styles.heroArea}>
          <HeroPlayer />
        </Animated.View>
        <View style={[styles.controlRow, { paddingHorizontal: hPad }]}>
          <IconButton icon="🔀" size={22} onPress={handleShuffle} />
          <Pressable onPress={handleOpenTimer} style={[styles.timerBadge, { backgroundColor: colors.accentDim }]}>
            <Text style={[styles.timerLabel, { color: colors.accent }]}>{timerLabel}</Text>
          </Pressable>
          <IconButton icon="🎚️" size={22} onPress={handleOpenMixer} />
          <IconButton icon="🌙" size={22} onPress={handleNightShield} />
        </View>
        <MiniPlayer />
        <LazyBannerAd />
        {nightShield && (
          <NightShield onDismiss={handleNightShieldDismiss} />
        )}
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingHorizontal: hPad }]}>
        <Text style={[type.headingM, { color: colors.textPrimary }]}>Drift Sound</Text>
        <View style={styles.headerRight}>
          <ThemeIcon />
          <IconButton icon="⚙️" size={22} onPress={handleOpenSettings} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.greetingSection, { paddingHorizontal: hPad }]}>
          <Text style={[type.headingL, { color: colors.textPrimary }]}>{greeting.title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{greeting.subtitle}</Text>
        </View>
        <View style={[styles.section, { paddingHorizontal: hPad }]}>
          <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>SCENES</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scenesScroll, { paddingLeft: hPad }]}
        >
          {sceneCards}
        </ScrollView>
        <View style={[styles.section, { paddingHorizontal: hPad, marginTop: S.xxxl }]}>
          <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>QUICK PLAY</Text>
        </View>
        <View style={[styles.quickGrid, { paddingHorizontal: hPad }]}>
          {quickSoundCards}
        </View>
        <View style={styles.spacer} />
      </ScrollView>
      <MiniPlayer />
      <LazyBannerAd />
      {lockedScene && (
        <BottomSheet visible={unlockSheetVisible} onClose={handleCloseUnlock} title="Unlock Scene">
          <View style={styles.unlockContent}>
            <Text style={styles.unlockEmoji}>{lockedScene.emoji}</Text>
            <Typography variant="T4" color={colors.textPrimary}>{lockedScene.name}</Typography>
            <Text style={[styles.unlockDesc, { color: colors.textSecondary }]}>
              {lockedScene.description}
            </Text>
            <Pressable
              onPress={handleWatchAd}
              style={[styles.unlockBtn, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.unlockBtnLabel}>
                {isAdLoaded ? 'Watch ad to unlock' : 'Loading ad...'}
              </Text>
            </Pressable>
            <Pressable
              onPress={handlePurchaseAll}
              style={[styles.unlockBtn, { backgroundColor: colors.amber }]}
            >
              <Text style={[styles.unlockBtnLabel, { color: '#1A1A22' }]}>
                Unlock all scenes — $2.99
              </Text>
            </Pressable>
            <Pressable onPress={handleCloseUnlock} style={styles.unlockCancel}>
              <Text style={[styles.unlockCancelText, { color: colors.textMuted }]}>Not now</Text>
            </Pressable>
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  )
}

export default React.memo(HomeScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: S.lg,
    paddingBottom: S.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  greetingSection: {
    paddingTop: S.xxl,
    paddingBottom: S.xxl,
    gap: S.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  section: {
    paddingBottom: S.md,
  },
  scenesScroll: {
    paddingRight: hPad,
    paddingBottom: S.sm,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroArea: {
    flex: 1,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: S.lg,
    paddingBottom: S.section,
  },
  timerBadge: {
    paddingHorizontal: S.md,
    paddingVertical: S.sm,
    borderRadius: 20,
  },
  timerLabel: {
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  unlockContent: {
    alignItems: 'center',
    gap: S.lg,
    paddingTop: S.md,
  },
  unlockEmoji: {
    fontSize: 48,
  },
  unlockDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  unlockBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockBtnLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  unlockCancel: {
    paddingVertical: S.sm,
  },
  unlockCancelText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  spacer: {
    height: 100,
  },
})
