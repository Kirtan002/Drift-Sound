import React, { useCallback, useState, useMemo } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Share, Alert } from 'react-native'
import { useTheme } from '../src/constants/ThemeContext'
import { usePreferencesStore } from '../src/store/preferencesStore'
import { S, hPad } from '../src/constants/spacing'
import { type } from '../src/constants/typography'
import * as Haptics from 'expo-haptics'
import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { audioEngine } from '../src/audio/AudioEngine'
import { VolumeSlider } from '../src/components/mixer/VolumeSlider'
import { usePurchases } from '../src/hooks/usePurchases'

const FADE_DURATIONS = [30, 60, 90] as const
const THEME_MODES = ['light', 'dark', 'system'] as const

interface ToggleSwitchProps {
  value: boolean
  onToggle: () => void
  accentColor: string
  borderColor: string
}

function ToggleSwitchInner({ value, onToggle, accentColor, borderColor }: ToggleSwitchProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onToggle()
  }, [onToggle])

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.toggleTrack, { backgroundColor: value ? accentColor : borderColor }]}
    >
      <View style={[styles.toggleThumb, { backgroundColor: '#FFFFFF', transform: [{ translateX: value ? 14 : 0 }] }]} />
    </Pressable>
  )
}

const ToggleSwitch = React.memo(ToggleSwitchInner)

interface SegmentPillProps {
  label: string
  active: boolean
  onPress: (mode: string) => void
  mode: string
  accentColor: string
  borderColor: string
  textColor: string
}

function SegmentPillInner({ label, active, onPress, mode, accentColor, borderColor, textColor }: SegmentPillProps) {
  const handlePress = useCallback(() => {
    onPress(mode)
  }, [onPress, mode])

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.segment,
        {
          backgroundColor: active ? accentColor : 'transparent',
          borderColor: active ? accentColor : borderColor,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[styles.segmentLabel, { color: active ? '#FFFFFF' : textColor }]}>
        {label}
      </Text>
    </Pressable>
  )
}

const SegmentPill = React.memo(SegmentPillInner)

interface LinkRowProps {
  url: string
  label: string
  textColor: string
  onPress: (url: string) => void
}

function LinkRowInner({ url, label, textColor, onPress }: LinkRowProps) {
  const handlePress = useCallback(() => {
    onPress(url)
  }, [onPress, url])

  return (
    <Pressable onPress={handlePress} style={styles.linkRow}>
      <Text style={[styles.linkText, { color: textColor }]}>{label}</Text>
    </Pressable>
  )
}

const LinkRowItem = React.memo(LinkRowInner)

interface FadePillProps {
  label: string
  duration: number
  active: boolean
  onPress: (d: number) => void
  accentColor: string
  borderColor: string
  textColor: string
}

function FadePillInner({ label, duration, active, onPress, accentColor, borderColor, textColor }: FadePillProps) {
  const handlePress = useCallback(() => {
    onPress(duration)
  }, [onPress, duration])

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? accentColor : 'transparent',
          borderColor: active ? accentColor : borderColor,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[styles.pillLabel, { color: active ? '#FFFFFF' : textColor }]}>{label}</Text>
    </Pressable>
  )
}

const FadePill = React.memo(FadePillInner)

function SettingsScreenInner() {
  const { colors, isDark } = useTheme()
  const prefs = usePreferencesStore()
  const [defaultVol, setDefaultVol] = useState(prefs.defaultVolume)
  const { purchaseUnlock, restorePurchases } = usePurchases()

  const handleThemeChange = useCallback((mode: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    prefs.setThemeMode(mode as 'light' | 'dark' | 'system')
  }, [prefs])

  const handleReduceMotion = useCallback(() => {
    prefs.setReducedMotion(!prefs.reducedMotion)
  }, [prefs])

  const handleCrossfade = useCallback(() => {
    prefs.setCrossfadeEnabled(!prefs.crossfadeEnabled)
  }, [prefs])

  const handleKeepScreenOn = useCallback(() => {
    prefs.setKeepScreenOn(!prefs.keepScreenOn)
  }, [prefs])

  const handleShowNotification = useCallback(() => {
    prefs.setShowPlayerNotification(!prefs.showPlayerNotification)
  }, [prefs])

  const handleTimerReminder = useCallback(() => {
    prefs.setTimerReminderEnabled(!prefs.timerReminderEnabled)
  }, [prefs])

  const handleFadeDuration = useCallback((d: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    prefs.setFadeOutDuration(d)
  }, [prefs])

  const handleDefaultVolume = useCallback((vol: number) => {
    setDefaultVol(vol)
    prefs.setDefaultVolume(vol)
  }, [prefs])

  const handleReinitialize = useCallback(async () => {
    await audioEngine.initialize()
    Alert.alert('Done', 'Audio engine re-initialized')
  }, [])

  const handleRate = useCallback(() => {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.gigasonet.driftsound')
  }, [])

  const handleShare = useCallback(async () => {
    await Share.share({
      message: 'Drift Sound — Fall asleep in seconds. Stay asleep all night.',
    })
  }, [])

  const handleOpenUrl = useCallback(async (url: string) => {
    await WebBrowser.openBrowserAsync(url)
  }, [])

  const segmentPills = useMemo(
    () => THEME_MODES.map(mode => {
      const cap = mode.charAt(0).toUpperCase() + mode.slice(1)
      return (
        <SegmentPill
          key={mode}
          label={cap}
          mode={mode}
          active={prefs.themeMode === mode}
          onPress={handleThemeChange}
          accentColor={colors.accent}
          borderColor={colors.border}
          textColor={colors.textSecondary}
        />
      )
    }),
    [prefs.themeMode, handleThemeChange, colors.accent, colors.border, colors.textSecondary]
  )

  const fadePills = useMemo(
    () => FADE_DURATIONS.map(d => (
      <FadePill
        key={d}
        label={`${d}s`}
        duration={d}
        active={prefs.fadeOutDuration === d}
        onPress={handleFadeDuration}
        accentColor={colors.accent}
        borderColor={colors.border}
        textColor={colors.textSecondary}
      />
    )),
    [prefs.fadeOutDuration, handleFadeDuration, colors.accent, colors.border, colors.textSecondary]
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Theme</Text>
          </View>
          <View style={styles.segmentRow}>
            {segmentPills}
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Reduce motion</Text>
            <ToggleSwitch value={prefs.reducedMotion} onToggle={handleReduceMotion} accentColor={colors.accent} borderColor={colors.border} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PLAYBACK</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Default volume</Text>
          </View>
          <View style={styles.volumeSliderContainer}>
            <VolumeSlider value={defaultVol} onValueChange={handleDefaultVolume} />
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Crossfade between sounds</Text>
            <ToggleSwitch value={prefs.crossfadeEnabled} onToggle={handleCrossfade} accentColor={colors.accent} borderColor={colors.border} />
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Fade out duration</Text>
          </View>
          <View style={styles.pillRow}>
            {fadePills}
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Keep screen on while playing</Text>
            <ToggleSwitch value={prefs.keepScreenOn} onToggle={handleKeepScreenOn} accentColor={colors.accent} borderColor={colors.border} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>NOTIFICATIONS</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelWrap}>
              <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Player notification</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>Required for background play</Text>
            </View>
            <ToggleSwitch value={prefs.showPlayerNotification} onToggle={handleShowNotification} accentColor={colors.accent} borderColor={colors.border} />
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Timer reminder</Text>
            <ToggleSwitch value={prefs.timerReminderEnabled} onToggle={handleTimerReminder} accentColor={colors.accent} borderColor={colors.border} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>AUDIO QUALITY</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
          <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
            All sounds are bundled at 128kbps. No downloads needed.
          </Text>
          <View style={styles.audioSpacer} />
          <Pressable
            onPress={handleReinitialize}
            style={[styles.actionBtn, { borderColor: colors.border, borderWidth: 1 }]}
          >
            <Text style={[styles.actionLabel, { color: colors.accent }]}>Re-initialize audio engine</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PURCHASE</Text>
        <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
          <View style={styles.statusRow}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Status</Text>
            <Text style={[styles.statusValue, { color: prefs.premiumUnlocked ? colors.green : colors.textSecondary }]}>
              {prefs.premiumUnlocked ? 'All unlocked ✓' : 'Free plan'}
            </Text>
          </View>
          {!prefs.premiumUnlocked && (
            <>
              <View style={styles.dividerRow}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </View>
              <Pressable
                style={[styles.ctaBtn, { backgroundColor: colors.amber }]}
                onPress={purchaseUnlock}
              >
                <Text style={styles.ctaLabel}>Unlock all scenes — $2.99</Text>
              </Pressable>
              <Pressable
                style={[styles.restoreBtn, { paddingVertical: S.md }]}
                onPress={restorePurchases}
              >
                <Text style={[styles.restoreLabel, { color: colors.accent }]}>Restore purchase</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ABOUT</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.bgCard }]}>
          <View style={styles.aboutHeader}>
            <Text style={styles.appEmoji}>🌙</Text>
            <View>
              <Text style={[styles.appName, { color: colors.textPrimary }]}>Drift Sound</Text>
              <Text style={[styles.appVersion, { color: colors.textMuted }]}>Version 1.0.0</Text>
            </View>
          </View>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <LinkRowItem url="https://gigasonet.com" label="Made by Gigasonet" textColor={colors.accent} onPress={handleOpenUrl} />
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <LinkRowItem url="https://gigasonet.com/privacy" label="Privacy Policy" textColor={colors.accent} onPress={handleOpenUrl} />
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <LinkRowItem url="https://gigasonet.com/terms" label="Terms of Use" textColor={colors.accent} onPress={handleOpenUrl} />
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <Pressable onPress={handleRate} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.accent }]}>Rate app</Text>
          </Pressable>
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
          <Pressable onPress={handleShare} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.accent }]}>Share app</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footerSpacer} />
    </ScrollView>
  )
}

export default React.memo(SettingsScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  section: {
    paddingHorizontal: hPad,
    paddingTop: S.xxl,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1.5,
    marginBottom: S.md,
  },
  card: {
    borderRadius: 16,
    padding: S.lg,
  },
  aboutCard: {
    borderRadius: 16,
    padding: S.lg,
  },
  settingRow: {
    paddingVertical: S.sm,
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  settingSub: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: S.sm,
  },
  toggleLabelWrap: {
    flex: 1,
    paddingRight: S.md,
  },
  toggleTrack: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: S.sm,
    paddingBottom: S.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: S.sm,
    borderRadius: 12,
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  dividerRow: {
    paddingVertical: S.xs,
  },
  divider: {
    height: 1,
  },
  pillRow: {
    flexDirection: 'row',
    gap: S.sm,
    paddingTop: S.xs,
  },
  pill: {
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    borderRadius: 20,
  },
  pillLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  bodyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  actionBtn: {
    borderRadius: 12,
    paddingVertical: S.md,
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: S.sm,
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  ctaBtn: {
    borderRadius: 14,
    paddingVertical: S.md,
    alignItems: 'center',
    marginTop: S.sm,
  },
  ctaLabel: {
    color: '#1A1A22',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  restoreBtn: {
    alignItems: 'center',
  },
  restoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    paddingVertical: S.sm,
  },
  appEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  linkRow: {
    paddingVertical: S.md,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  volumeSliderContainer: {
    paddingHorizontal: S.xs,
  },
  audioSpacer: {
    height: S.md,
  },
  footerSpacer: {
    height: 60,
  },
})
