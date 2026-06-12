import React, { useState, useCallback, useMemo } from 'react'
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { S, hPad } from '../../constants/spacing'
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
    const [h, m] = wakeTime.split(':').map(Number)
    const fadeStart = new Date()
    fadeStart.setHours(h, m - fadeStartMinutes, 0, 0)
    const fh = fadeStart.getHours().toString().padStart(2, '0')
    const fm = fadeStart.getMinutes().toString().padStart(2, '0')
    return `Sounds begin at ${fh}:${fm} and reach full volume by ${wakeTime}`
  }, [enabled, wakeTime, fadeStartMinutes])

  return (
    <View style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.toggleRow}>
        <View style={[styles.toggle, { backgroundColor: enabled ? colors.accent : colors.border }]}>
          <View style={[styles.toggleThumb, { backgroundColor: '#FFFFFF', transform: [{ translateX: enabled ? 18 : 2 }] }]} />
        </View>
        <Text style={[styles.toggleLabel, { color: colors.textPrimary }]}>Enable wake-up fade</Text>
      </Pressable>

      {enabled && (
        <View style={styles.expandedSection}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>Wake time</Text>
          <TextInput
            value={timeInput}
            onChangeText={setTimeInput}
            onBlur={handleTimeSubmit}
            onSubmitEditing={handleTimeSubmit}
            placeholder="HH:MM"
            placeholderTextColor={colors.textMuted}
            style={[
              styles.timeInput,
              { color: colors.accent, borderColor: colors.border, backgroundColor: colors.bgCard },
            ]}
          />

          <Text style={[styles.sectionLabel, { color: colors.textMuted, marginTop: S.lg }]}>Start fading</Text>
          <View style={styles.pillRow}>
            {FADE_START_OPTIONS.map((opt) => {
              const active = fadeStartMinutes === opt
              return (
                <Pressable
                  key={opt}
                  onPress={() => onFadeStartChange(opt)}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: active ? colors.accent : 'transparent',
                      borderColor: active ? colors.accent : colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pillLabel,
                      { color: active ? '#FFFFFF' : colors.textSecondary },
                    ]}
                  >
                    {opt} min
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {previewText.length > 0 && (
            <Text style={[styles.preview, { color: colors.textSecondary }]}>
              {previewText}
            </Text>
          )}

          <View style={[styles.infoCard, { backgroundColor: colors.amberDim }]}>
            <Text style={[styles.infoText, { color: colors.amber }]}>
              ⚠️ Your alarm still needs to be set in your Clock app. This feature only controls Drift Sound volume — it does not ring an alarm.
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  expandedSection: {
    gap: S.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  timeInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: S.lg,
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    textAlign: 'center',
  },
  pillRow: {
    flexDirection: 'row',
    gap: S.sm,
    flexWrap: 'wrap',
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
  preview: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
  },
  infoCard: {
    borderRadius: 16,
    padding: 14,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 18,
  },
})
