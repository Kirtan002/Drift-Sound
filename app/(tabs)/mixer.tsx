import React, { useMemo, useCallback, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore } from '../../src/store/playerStore'
import { useMixesStore } from '../../src/store/mixesStore'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { MixTrack } from '../../src/components/mixer/MixTrack'
import { VolumeSlider } from '../../src/components/mixer/VolumeSlider'
import { SaveMixSheet } from '../../src/components/mixer/SaveMixSheet'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { ScreenBackground } from '../../src/components/ui/ScreenBackground'
import { IconButton } from '../../src/components/ui/IconButton'
import { Icon } from '../../src/components/ui/Icon'
import { PressableScale } from '../../src/components/ui/PressableScale'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import type { SavedMix } from '../../src/types/sound'

function MixerScreenInner() {
  const { colors } = useTheme()
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const masterVolume = usePlayerStore(s => s.masterVolume)
  const setMasterVolume = usePlayerStore(s => s.setMasterVolume)
  const play = usePlayerStore(s => s.play)
  const setActiveScene = usePlayerStore(s => s.setActiveScene)
  const mixes = useMixesStore(s => s.mixes)
  const deleteMix = useMixesStore(s => s.deleteMix)
  const [saveSheetVisible, setSaveSheetVisible] = useState(false)

  const hasAudio = activeSounds.length > 0

  const handleOpenSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSaveSheetVisible(true)
  }, [])

  const handleLoadMix = useCallback((mix: SavedMix) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    setActiveScene(mix.name)
    play(mix.sounds)
  }, [play, setActiveScene])

  const handleDeleteMix = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    deleteMix(id)
  }, [deleteMix])

  const activeTracks = useMemo(
    () => activeSounds.map(s => <MixTrack key={s.id} sound={s} />),
    [activeSounds]
  )

  const savedSection = mixes.length > 0 && (
    <View style={styles.savedSection}>
      <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5, paddingHorizontal: hPad }]}>
        SAVED MIXES
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: hPad, gap: S.md, paddingTop: S.md }}
      >
        {mixes.map(mix => (
          <PressableScale
            key={mix.id}
            onPress={() => handleLoadMix(mix)}
            scaleTo={0.95}
            style={[styles.mixCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
          >
            <View style={styles.mixCardTop}>
              <Icon name="sliders" size={18} color={colors.accent} />
              <PressableScale onPress={() => handleDeleteMix(mix.id)} scaleTo={0.8} haptic={false} style={styles.mixDelete}>
                <Icon name="trash" size={15} color={colors.textMuted} />
              </PressableScale>
            </View>
            <Text style={[styles.mixName, { color: colors.textPrimary }]} numberOfLines={1}>{mix.name}</Text>
            <Text style={[styles.mixCount, { color: colors.textMuted }]}>
              {mix.sounds.length} sound{mix.sounds.length !== 1 ? 's' : ''}
            </Text>
          </PressableScale>
        ))}
      </ScrollView>
    </View>
  )

  const header = (
    <View style={[styles.header, { paddingHorizontal: hPad }]}>
      <Text style={[type.headingL, { color: colors.textPrimary }]}>Mixer</Text>
      {hasAudio && (
        <View style={styles.headerActions}>
          <IconButton icon="plus" onPress={() => router.push('/(tabs)/sounds')} variant="soft" />
          <IconButton icon="save" onPress={handleOpenSave} variant="soft" />
        </View>
      )}
    </View>
  )

  if (!hasAudio) {
    return (
      <ScreenBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          {header}
          <ScrollView showsVerticalScrollIndicator={false}>
            {savedSection}
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.bgCard }]}>
                <Icon name="sliders" size={36} color={colors.textMuted} />
              </View>
              <Text style={[type.headingM, { color: colors.textSecondary }]}>No mix active</Text>
              <Text style={[type.bodyM, { color: colors.textMuted, textAlign: 'center', marginTop: S.xs }]}>
                Start playing sounds to mix them here
              </Text>
              <PressableScale
                onPress={() => router.push('/(tabs)/sounds')}
                style={[styles.browseBtn, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.browseLabel}>Browse Sounds</Text>
                <Icon name="chevronRight" size={18} color="#fff" />
              </PressableScale>
            </View>
          </ScrollView>
          <MiniPlayer />
        </SafeAreaView>
      </ScreenBackground>
    )
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        {header}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={[styles.masterCard, { backgroundColor: colors.bgCard, borderColor: colors.border, marginHorizontal: hPad }]}>
            <VolumeSlider value={masterVolume} onValueChange={setMasterVolume} label="MASTER VOLUME" />
          </View>
          {savedSection}
          <View style={styles.tracksHead}>
            <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5, paddingHorizontal: hPad }]}>
              ACTIVE · {activeSounds.length}
            </Text>
          </View>
          <View style={styles.tracksList}>{activeTracks}</View>
          <View style={styles.spacer} />
        </ScrollView>
        <MiniPlayer />
        <SaveMixSheet visible={saveSheetVisible} onClose={() => setSaveSheetVisible(false)} />
      </SafeAreaView>
    </ScreenBackground>
  )
}

export default React.memo(MixerScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: S.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: S.sm,
    paddingBottom: S.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  masterCard: {
    borderRadius: 18,
    padding: S.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: S.xl,
  },
  savedSection: {
    paddingBottom: S.xl,
  },
  mixCard: {
    width: 130,
    borderRadius: 16,
    padding: S.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  mixCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mixDelete: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mixName: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  mixCount: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  tracksHead: {
    paddingBottom: S.md,
  },
  tracksList: {},
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hPad,
    paddingTop: S.section,
    gap: S.xs,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: S.lg,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
    marginTop: S.xl,
    paddingHorizontal: S.xl,
    paddingVertical: S.md,
    borderRadius: 16,
  },
  browseLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  spacer: { height: 100 },
})
