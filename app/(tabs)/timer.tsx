import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, ScrollView, Pressable, SafeAreaView, StyleSheet } from 'react-native'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore } from '../../src/store/playerStore'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { TimerDial } from '../../src/components/timer/TimerDial'
import { TimerCountdown } from '../../src/components/timer/TimerCountdown'
import { WakeScheduler } from '../../src/components/timer/WakeScheduler'
import * as Haptics from 'expo-haptics'

const QUICK_PRESETS = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '1h', value: 60 },
  { label: '∞', value: 0 },
] as const

interface PresetPillProps {
  label: string
  value: number
  isActive: boolean
  onPress: (value: number) => void
  accentColor: string
  borderColor: string
  textColor: string
}

function PresetPillInner({ label, value, isActive, onPress, accentColor, borderColor, textColor }: PresetPillProps) {
  const handlePress = useCallback(() => {
    onPress(value)
  }, [onPress, value])

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.presetPill,
        {
          backgroundColor: isActive ? accentColor : 'transparent',
          borderColor: isActive ? accentColor : borderColor,
          borderWidth: 1,
        },
      ]}
    >
      <Text style={[styles.presetLabel, { color: isActive ? '#FFFFFF' : textColor }]}>
        {label}
      </Text>
    </Pressable>
  )
}

const PresetPill = React.memo(PresetPillInner)

function TimerScreenInner() {
  const { colors } = useTheme()
  const [selectedMinutes, setSelectedMinutes] = useState(30)
  const [fadeOutEnabled, setFadeOutEnabled] = useState(true)
  const [wakeEnabled, setWakeEnabled] = useState(false)
  const [wakeTime, setWakeTime] = useState<string | null>(null)
  const [fadeStartMinutes, setFadeStartMinutes] = useState(30)

  const timerEndTime = usePlayerStore(s => s.timerEndTime)
  const setTimer = usePlayerStore(s => s.setTimer)
  const setWake = usePlayerStore(s => s.setWakeTime)

  const hasActiveTimer = timerEndTime != null && timerEndTime > Date.now()

  const handleDialChange = useCallback((minutes: number) => {
    setSelectedMinutes(minutes)
    if (minutes > 0) {
      setTimer(Date.now() + minutes * 60 * 1000)
    } else {
      setTimer(null)
    }
  }, [setTimer])

  const handlePresetPress = useCallback((value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedMinutes(value)
    if (value > 0) {
      setTimer(Date.now() + value * 60 * 1000)
    } else {
      setTimer(null)
    }
  }, [setTimer])

  const handleCancelTimer = useCallback(() => {
    setTimer(null)
  }, [setTimer])

  const handleWakeToggle = useCallback((enabled: boolean) => {
    setWakeEnabled(enabled)
    if (!enabled) {
      setWake(null)
    }
  }, [setWake])

  const handleWakeTimeChange = useCallback((time: string) => {
    setWakeTime(time)
    setWake(time)
  }, [setWake])

  const handleFadeStartChange = useCallback((minutes: number) => {
    setFadeStartMinutes(minutes)
  }, [])

  const handleFadeToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setFadeOutEnabled(prev => !prev)
  }, [])

  const presetPills = useMemo(
    () => QUICK_PRESETS.map(preset => (
      <PresetPill
        key={preset.value}
        label={preset.label}
        value={preset.value}
        isActive={selectedMinutes === preset.value}
        onPress={handlePresetPress}
        accentColor={colors.accent}
        borderColor={colors.border}
        textColor={colors.textSecondary}
      />
    )),
    [selectedMinutes, handlePresetPress, colors.accent, colors.border, colors.textSecondary]
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { paddingHorizontal: hPad }]}>
        <Text style={[type.headingL, { color: colors.textPrimary }]}>Timer</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { paddingHorizontal: hPad }]}>
          <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>SLEEP TIMER</Text>
          <Text style={[type.bodyS, { color: colors.textSecondary, marginTop: S.xs }]}>Audio stops after</Text>
        </View>

        <TimerDial value={selectedMinutes} onChange={handleDialChange} />

        <View style={[styles.presetRow, { paddingHorizontal: hPad }]}>
          {presetPills}
        </View>

        <View style={[styles.fadeRow, { paddingHorizontal: hPad }]}>
          <Text style={[type.bodyS, { color: colors.textPrimary }]}>Fade out over last 60 seconds</Text>
          <Pressable
            onPress={handleFadeToggle}
            style={[styles.toggleMini, { backgroundColor: fadeOutEnabled ? colors.accent : colors.border }]}
          >
            <View style={[styles.toggleMiniThumb, { backgroundColor: '#FFFFFF', transform: [{ translateX: fadeOutEnabled ? 14 : 0 }] }]} />
          </Pressable>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={[styles.section, { paddingHorizontal: hPad }]}>
          <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>WAKE-UP FADE</Text>
          <Text style={[type.bodyS, { color: colors.textSecondary, marginTop: S.xs }]}>
            Slowly raises volume before your alarm
          </Text>
        </View>

        <View style={[styles.wakeSection, { paddingHorizontal: hPad }]}>
          <WakeScheduler
            enabled={wakeEnabled}
            wakeTime={wakeTime}
            fadeStartMinutes={fadeStartMinutes}
            onToggle={handleWakeToggle}
            onWakeTimeChange={handleWakeTimeChange}
            onFadeStartChange={handleFadeStartChange}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.timerCountdownContainer}>
          {hasActiveTimer && timerEndTime && (
            <TimerCountdown endTime={timerEndTime} onCancel={handleCancelTimer} />
          )}
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default React.memo(TimerScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: S.lg,
    paddingBottom: S.md,
  },
  section: {
    paddingTop: S.xxl,
    paddingBottom: S.md,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: S.sm,
    paddingBottom: S.xxl,
  },
  presetPill: {
    paddingHorizontal: S.lg,
    paddingVertical: S.sm,
    borderRadius: 20,
  },
  presetLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  fadeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: S.xxxl,
  },
  toggleMini: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleMiniThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: hPad,
  },
  wakeSection: {
    paddingTop: S.lg,
    paddingBottom: S.xxxl,
  },
  timerCountdownContainer: {
    paddingHorizontal: hPad,
    paddingBottom: S.xxl,
  },
  spacer: {
    height: 100,
  },
})
