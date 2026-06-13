import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../src/constants/ThemeContext'
import { usePlayerStore, scheduleWake, cancelWake } from '../../src/store/playerStore'
import { S, hPad } from '../../src/constants/spacing'
import { type } from '../../src/constants/typography'
import { TimerDial } from '../../src/components/timer/TimerDial'
import { TimerCountdown } from '../../src/components/timer/TimerCountdown'
import { WakeScheduler } from '../../src/components/timer/WakeScheduler'
import { ScreenBackground } from '../../src/components/ui/ScreenBackground'
import { MiniPlayer } from '../../src/components/player/MiniPlayer'
import { PressableScale } from '../../src/components/ui/PressableScale'
import * as Haptics from 'expo-haptics'

const QUICK_PRESETS = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '45m', value: 45 },
  { label: '1h', value: 60 },
  { label: '∞', value: 0 },
] as const

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
  const fadeOutMs = fadeOutEnabled ? 60000 : 0

  const applyTimer = useCallback((minutes: number) => {
    if (minutes > 0) {
      setTimer(Date.now() + minutes * 60 * 1000, fadeOutMs)
    } else {
      setTimer(null)
    }
  }, [setTimer, fadeOutMs])

  const handleDialChange = useCallback((minutes: number) => {
    setSelectedMinutes(minutes)
    applyTimer(minutes)
  }, [applyTimer])

  const handlePresetPress = useCallback((value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setSelectedMinutes(value)
    applyTimer(value)
  }, [applyTimer])

  const handleCancelTimer = useCallback(() => {
    setTimer(null)
  }, [setTimer])

  // Re-arm the wake fade whenever its inputs change while enabled.
  useEffect(() => {
    if (wakeEnabled && wakeTime) {
      setWake(wakeTime)
      scheduleWake(wakeTime, fadeStartMinutes)
    }
  }, [wakeEnabled, wakeTime, fadeStartMinutes])

  const handleWakeToggle = useCallback((enabled: boolean) => {
    setWakeEnabled(enabled)
    if (!enabled) {
      setWake(null)
      cancelWake()
    }
  }, [setWake])

  const handleFadeToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setFadeOutEnabled(prev => !prev)
  }, [])

  const presetPills = useMemo(
    () => QUICK_PRESETS.map(preset => {
      const isActive = selectedMinutes === preset.value
      return (
        <PressableScale
          key={preset.value}
          onPress={() => handlePresetPress(preset.value)}
          haptic={false}
          scaleTo={0.92}
          style={[
            styles.presetPill,
            {
              backgroundColor: isActive ? colors.accent : colors.bgCard,
              borderColor: isActive ? colors.accent : colors.border,
            },
          ]}
        >
          <Text style={[styles.presetLabel, { color: isActive ? '#FFFFFF' : colors.textSecondary }]}>
            {preset.label}
          </Text>
        </PressableScale>
      )
    }),
    [selectedMinutes, handlePresetPress, colors]
  )

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: hPad }]}>
          <Text style={[type.headingL, { color: colors.textPrimary }]}>Timer</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { paddingHorizontal: hPad }]}>
            <Text style={[type.label, { color: colors.textMuted, letterSpacing: 1.5 }]}>SLEEP TIMER</Text>
            <Text style={[type.bodyS, { color: colors.textSecondary, marginTop: S.xs }]}>
              Drag the dial or pick a preset — audio stops when it ends
            </Text>
          </View>

          <TimerDial value={selectedMinutes} onChange={handleDialChange} />

          <View style={[styles.presetRow, { paddingHorizontal: hPad }]}>{presetPills}</View>

          <PressableScale
            onPress={handleFadeToggle}
            haptic={false}
            scaleTo={0.99}
            style={[styles.fadeRow, { paddingHorizontal: hPad }]}
          >
            <View style={styles.fadeTextWrap}>
              <Text style={[type.bodyM, { color: colors.textPrimary }]}>Fade out over last 60 seconds</Text>
              <Text style={[styles.fadeSub, { color: colors.textMuted }]}>Gently lowers volume before stopping</Text>
            </View>
            <View style={[styles.toggleMini, { backgroundColor: fadeOutEnabled ? colors.accent : colors.border }]}>
              <View style={[styles.toggleMiniThumb, { transform: [{ translateX: fadeOutEnabled ? 16 : 0 }] }]} />
            </View>
          </PressableScale>

          {hasActiveTimer && timerEndTime && (
            <View style={[styles.countdownWrap, { paddingHorizontal: hPad }]}>
              <TimerCountdown endTime={timerEndTime} onCancel={handleCancelTimer} />
            </View>
          )}

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
              onWakeTimeChange={setWakeTime}
              onFadeStartChange={setFadeStartMinutes}
            />
          </View>

          <View style={styles.spacer} />
        </ScrollView>
        <MiniPlayer />
      </SafeAreaView>
    </ScreenBackground>
  )
}

export default React.memo(TimerScreenInner)

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: S.sm,
    paddingBottom: S.sm,
  },
  section: {
    paddingTop: S.xl,
    paddingBottom: S.md,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: S.sm,
    paddingBottom: S.xl,
  },
  presetPill: {
    paddingHorizontal: S.lg,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  presetLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  fadeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: S.xl,
  },
  fadeTextWrap: {
    flex: 1,
    paddingRight: S.md,
    gap: 2,
  },
  fadeSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  toggleMini: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleMiniThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  countdownWrap: {
    paddingBottom: S.xl,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: hPad,
    marginBottom: S.sm,
  },
  wakeSection: {
    paddingTop: S.lg,
    paddingBottom: S.xxxl,
  },
  spacer: { height: 80 },
})
