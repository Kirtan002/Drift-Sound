import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'
import { PressableScale } from '../ui/PressableScale'
import { Icon } from '../ui/Icon'
import * as Haptics from 'expo-haptics'

const FADE_START_OPTIONS = [10, 20, 30, 45] as const

interface WakeSchedulerProps {
  wakeTime: string | null
  fadeStartMinutes: number
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onWakeTimeChange: (time: string) => void
  onFadeStartChange: (minutes: number) => void
}

// Safe modular clock math: works even when fade-start crosses midnight.
function subtractMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  let total = (h * 60 + m - minutes) % (24 * 60)
  if (total < 0) total += 24 * 60
  const fh = Math.floor(total / 60)
  const fm = total % 60
  return `${fh.toString().padStart(2, '0')}:${fm.toString().padStart(2, '0')}`
}

function WakeSchedulerInner({
  wakeTime,
  fadeStartMinutes,
  enabled,
  onToggle,
  onWakeTimeChange,
  onFadeStartChange,
}: WakeSchedulerProps) {
  const { colors } = useTheme()
  const [timeInput, setTimeInput] = useState(wakeTime ?? '07:00')

  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onToggle(!enabled)
  }, [enabled, onToggle])

  const handleTimeSubmit = useCallback(() => {
    const match = timeInput.match(/^(\d{1,2}):(\d{2})$/)
    if (match) {
      const h = Math.min(23, Math.max(0, parseInt(match[1], 10)))
      const m = Math.min(59, Math.max(0, parseInt(match[2], 10)))
      const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
      setTimeInput(formatted)
      onWakeTimeChange(formatted)
    } else {
      setTimeInput(wakeTime ?? '07:00')
    }
  }, [timeInput, wakeTime, onWakeTimeChange])

  const previewText = useMemo(() => {
    if (!enabled || !wakeTime) return ''
    const start = subtractMinutes(wakeTime, fadeStartMinutes)
    return `Sound rises from ${start}, reaching full volume by ${wakeTime}`
  }, [enabled, wakeTime, fadeStartMinutes])

  return (
    <View style={styles.container}>
      <PressableScale onPress={handleToggle} haptic={false} scaleTo={0.98} style={styles.toggleRow}>
        <View style={[styles.toggle, { backgroundColor: enabled ? colors.accent : colors.border }]}>
          <View style={[styles.toggleThumb, { transform: [{ translateX: enabled ? 18 : 2 }] }]} />
        </View>
        <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Enable wake-up fade</Text>
      </PressableScale>

      {enabled && (
        <View style={styles.expandedSection}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WAKE TIME</Text>
          <TextInput
            value={timeInput}
            onChangeText={setTimeInput}
            onBlur={handleTimeSubmit}
            onSubmitEditing={handleTimeSubmit}
            placeholder="HH:MM"
            placeholderTextColor={colors.textMuted}
            keyboardType="numbers-and-punctuation"
            style={[
              styles.timeInput,
              { color: colors.accent, borderColor: colors.border, backgroundColor: colors.bgCard },
            ]}
          />

          <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: S.lg }]}>START FADING</Text>
          <View style={styles.pillRow}>
            {FADE_START_OPTIONS.map((opt) => {
              const active = fadeStartMinutes === opt
              return (
                <PressableScale
                  key={opt}
                  onPress={() => onFadeStartChange(opt)}
                  scaleTo={0.93}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: active ? colors.accent : colors.bgCard,
                      borderColor: active ? colors.accent : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.pillLabel, { color: active ? '#FFFFFF' : colors.textSecondary }]}>
                    {opt} min
                  </Text>
                </PressableScale>
              )
            })}
          </View>

          {previewText.length > 0 && (
            <Text style={[styles.preview, { color: colors.textSecondary }]}>{previewText}</Text>
          )}

          <View style={[styles.infoCard, { backgroundColor: colors.amberDim }]}>
            <Icon name="alert" size={16} color={colors.amber} />
            <Text style={[styles.infoText, { color: colors.amber }]}>
              Set your actual alarm in your Clock app. This only raises Drift Sound's volume — it does not ring an alarm.
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}

export const WakeScheduler = React.memo(WakeSchedulerInner)

const styles = StyleSheet.create({
  container: {
    gap: S.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  expandedSection: {
    gap: S.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1,
  },
  timeInput: {
    height: 56,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: S.lg,
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: S.sm,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: S.lg,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  preview: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    gap: S.sm,
    borderRadius: 14,
    padding: 14,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
})
