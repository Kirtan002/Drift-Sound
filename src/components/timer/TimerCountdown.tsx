import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'
import { S } from '../../constants/spacing'
import { Icon } from '../ui/Icon'
import { PressableScale } from '../ui/PressableScale'

interface TimerCountdownProps {
  endTime: number
  onCancel: () => void
}

const SIZE = 64
const STROKE = 5
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

function TimerCountdownInner({ endTime, onCancel }: TimerCountdownProps) {
  const { colors } = useTheme()
  const totalRef = useRef(Math.max(1, endTime - Date.now()))
  const [remaining, setRemaining] = useState(Math.max(0, endTime - Date.now()))

  useEffect(() => {
    totalRef.current = Math.max(1, endTime - Date.now())
    const update = () => setRemaining(Math.max(0, endTime - Date.now()))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [endTime])

  const display = useMemo(() => {
    const totalSec = Math.floor(remaining / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }, [remaining])

  const handleCancel = useCallback(() => onCancel(), [onCancel])

  if (remaining <= 0) return null

  const progress = Math.max(0, Math.min(1, remaining / totalRef.current))

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
      <View style={styles.ringWrap}>
        <Svg width={SIZE} height={SIZE}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={colors.border} strokeWidth={STROKE} fill="none" />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.accent}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
            transform={`rotate(-90, ${SIZE / 2}, ${SIZE / 2})`}
          />
        </Svg>
        <View style={styles.ringIcon}>
          <Icon name="timer" size={22} color={colors.accent} />
        </View>
      </View>

      <View style={styles.middle}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: colors.green }]} />
          <Text style={[styles.status, { color: colors.textSecondary }]}>Sleep timer active</Text>
        </View>
        <Text style={[styles.countdown, { color: colors.textPrimary }]}>{display}</Text>
      </View>

      <PressableScale onPress={handleCancel} scaleTo={0.9} style={[styles.cancelBtn, { backgroundColor: colors.redDim }]}>
        <Icon name="close" size={18} color={colors.red} />
      </PressableScale>
    </View>
  )
}

export const TimerCountdown = React.memo(TimerCountdownInner)

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: S.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.lg,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringIcon: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    flex: 1,
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  countdown: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  cancelBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
