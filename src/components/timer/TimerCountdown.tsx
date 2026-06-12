import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'

interface TimerCountdownProps {
  endTime: number
  onCancel: () => void
}

function TimerCountdownInner({ endTime, onCancel }: TimerCountdownProps) {
  const { colors } = useTheme()
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()))

  useEffect(() => {
    const update = () => {
      setRemaining(Math.max(0, endTime - Date.now()))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [endTime])

  const display = useMemo(() => {
    const totalSec = Math.floor(remaining / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [remaining])

  const isExpired = remaining <= 0

  if (isExpired) return null

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.accent }]}>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.green }]} />
        <Text style={[styles.status, { color: colors.green }]}>Timer active</Text>
      </View>
      <Text style={[styles.countdown, { color: colors.accent }]}>{display}</Text>
      <Pressable onPress={onCancel} style={styles.cancelBtn}>
        <Text style={[styles.cancelText, { color: colors.red }]}>Cancel timer</Text>
      </Pressable>
    </View>
  )
}

export const TimerCountdown = React.memo(TimerCountdownInner)

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: S.lg,
    borderWidth: 1.5,
    gap: S.sm,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  countdown: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  cancelBtn: {
    paddingVertical: S.sm,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
})
