import React, { useCallback, useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg'
import { useTheme } from '../../constants/ThemeContext'
import { SOUND_BY_ID } from '../../constants/sounds'
import { PressableScale } from '../ui/PressableScale'
import { Icon } from '../ui/Icon'
import type { Scene } from '../../types/sound'

interface SceneCardProps {
  scene: Scene
  onPress?: (scene: Scene) => void
  unlocked?: boolean
}

const CARD_W = 168
const CARD_H = 210

// Scene cards read as small pieces of album art — always a rich dark gradient
// regardless of app theme — so light foreground text is intentional and lives
// in one place (FG / FG_DIM) rather than scattered literals.
const FG = '#FFFFFF'
const FG_DIM = 'rgba(255,255,255,0.72)'

const SCENE_GRADIENT: Record<string, [string, string]> = {
  rainy_cabin: ['#3A3A6E', '#16162A'],
  ocean_dock: ['#1E4A6E', '#0A1622'],
  forest_night: ['#1E4A2E', '#0A1A10'],
  deep_focus: ['#2E2E4A', '#101018'],
  space_float: ['#3A2A6E', '#0A0A20'],
  pet_relief: ['#5A3A6E', '#1A1020'],
  coffee_morning: ['#6E4A2A', '#201410'],
}

function SceneCardInner({ scene, onPress, unlocked }: SceneCardProps) {
  const { colors } = useTheme()

  const [from, to] = useMemo(
    () => SCENE_GRADIENT[scene.id] ?? ['#2A2A4E', '#12121E'],
    [scene.id]
  )

  const soundPreview = useMemo(
    () => scene.sounds.map(s => SOUND_BY_ID[s.soundId]?.name ?? s.soundId).join(' · '),
    [scene.sounds]
  )

  const handlePress = useCallback(() => {
    onPress?.(scene)
  }, [onPress, scene])

  const showLock = scene.locked && !unlocked

  return (
    <PressableScale onPress={handlePress} scaleTo={0.96} style={styles.card}>
      <Svg style={StyleSheet.absoluteFill} width={CARD_W} height={CARD_H}>
        <Defs>
          <LinearGradient id={`g_${scene.id}`} x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={CARD_W} height={CARD_H} rx="22" fill={`url(#g_${scene.id})`} />
      </Svg>

      <View style={styles.content}>
        <Text style={styles.emoji}>{scene.emoji}</Text>
        <View style={styles.bottom}>
          <Text style={styles.name} numberOfLines={1}>{scene.name}</Text>
          <Text style={styles.sounds} numberOfLines={2}>{soundPreview}</Text>
        </View>
      </View>

      {showLock ? (
        <View style={[styles.badge, { backgroundColor: colors.amber }]}>
          <Icon name="lock" size={13} color="#1A1A22" strokeWidth={2.2} />
        </View>
      ) : (
        <View style={[styles.badge, styles.playBadge]}>
          <Icon name="play" size={12} color={FG} />
        </View>
      )}
    </PressableScale>
  )
}

export const SceneCard = React.memo(SceneCardInner)

const styles = StyleSheet.create({
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 14,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 30,
  },
  bottom: {
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Nunito_700Bold',
    color: FG,
  },
  sounds: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: FG_DIM,
    lineHeight: 15,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
})
