import React, { useMemo, useCallback, useState } from 'react'
import { View, Text, ScrollView, Pressable, SafeAreaView, StyleSheet } from 'react-native'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore } from '../../src/store/playerStore'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { MixTrack } from '../../src/components/mixer/MixTrack'
import { VolumeSlider } from '../../src/components/mixer/VolumeSlider'
import { SaveMixSheet } from '../../src/components/mixer/SaveMixSheet'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { IconButton } from '../../src/components/ui/IconButton'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'

function MixerScreenInner() {
  const { colors } = useTheme()
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const masterVolume = usePlayerStore(s => s.masterVolume)
  const setMasterVolume = usePlayerStore(s => s.setMasterVolume)
  const [saveSheetVisible, setSaveSheetVisible] = useState(false)

  const hasAudio = activeSounds.length > 0

  const handleAddSound = useCallback(() => {
    router.push('/(tabs)/sounds')
  }, [])

  const handleOpenSave = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSaveSheetVisible(true)
  }, [])

  const handleCloseSave = useCallback(() => {
    setSaveSheetVisible(false)
  }, [])

  const handleBrowseSounds = useCallback(() => {
    router.push('/(tabs)/sounds')
  }, [])

  const handleMasterVolumeChange = useCallback((vol: number) => {
    setMasterVolume(vol)
  }, [setMasterVolume])

  const activeTracks = useMemo(
    () => activeSounds.map(s => <MixTrack key={s.id} sound={s} />),
    [activeSounds]
  )

  if (!hasAudio) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <View style={[styles.header, { paddingHorizontal: hPad }]}>
          <Text style={[type.headingL, { color: colors.textPrimary }]}>Mixer</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎚️</Text>
          <Text style={[type.headingM, { color: colors.textSecondary }]}>No mix active</Text>
          <Text style={[type.bodyM, { color: colors.textMuted, textAlign: 'center', marginTop: S.sm }]}>
            Start playing sounds to mix them here
          </Text>
          <Pressable
            onPress={handleBrowseSounds}
            style={[styles.browseBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.browseLabel}>Browse Sounds →</Text>
          </Pressable>
        </View>
        <MiniPlayer />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingHorizontal: hPad }]}>
        <Text style={[type.headingL, { color: colors.textPrimary }]}>Mixer</Text>
        <View style={styles.headerActions}>
          <IconButton icon="➕" size={20} onPress={handleAddSound} />
          <IconButton icon="💾" size={20} onPress={handleOpenSave} />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.masterSection, { paddingHorizontal: hPad }]}>
          <VolumeSlider
            value={masterVolume}
            onValueChange={handleMasterVolumeChange}
            label="MASTER VOLUME"
          />
        </View>
        <View style={styles.tracksList}>
          {activeTracks}
        </View>
        <View style={styles.mixerSpacer} />
      </ScrollView>
      <MiniPlayer />
      <SaveMixSheet visible={saveSheetVisible} onClose={handleCloseSave} />
    </SafeAreaView>
  )
}

export default React.memo(MixerScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: S.lg,
    paddingBottom: S.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.xs,
  },
  masterSection: {
    paddingTop: S.md,
    paddingBottom: S.xxl,
  },
  tracksList: {
    gap: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: hPad,
    gap: S.sm,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: S.md,
  },
  browseBtn: {
    marginTop: S.xxl,
    paddingHorizontal: S.xxl,
    paddingVertical: S.md,
    borderRadius: 14,
  },
  browseLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  mixerSpacer: {
    height: 120,
  },
})
