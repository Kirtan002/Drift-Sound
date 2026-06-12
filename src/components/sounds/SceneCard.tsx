import React, { useCallback, useMemo } from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { Badge } from '../ui/Badge'
import type { Scene } from '../../types/sound'

interface SceneCardProps {
  scene: Scene
  onPress?: (scene: Scene) => void
}

const SCENE_BG_COLORS: Record<string, string> = {
  rainy_cabin: '#1a1a2e',
  ocean_dock: '#0d1b2a',
  forest_night: '#0a1a0f',
  deep_focus: '#111118',
  space_float: '#050510',
  coffee_morning: '#1a1410',
}

const SCENE_GRADIENT_TOP: Record<string, string> = {
  rainy_cabin: '#2a2a4e',
  ocean_dock: '#1a2b4a',
  forest_night: '#1a2a1f',
  deep_focus: '#1a1a28',
  space_float: '#0a0a20',
  coffee_morning: '#2a2018',
}

function SceneCardInner({ scene, onPress }: SceneCardProps) {
  const { colors } = useTheme()

  const bgColor = useMemo(() => SCENE_BG_COLORS[scene.id] ?? colors.bgCard, [scene.id, colors.bgCard])
  const topColor = useMemo(() => SCENE_GRADIENT_TOP[scene.id] ?? colors.bgSurface, [scene.id, colors.bgSurface])

  const soundPreview = useMemo(
    () => scene.sounds.map(s => s.soundId.replace('_', ' ')).join(' · '),
    [scene.sounds]
  )

  const handlePress = useCallback(() => {
    onPress?.(scene)
  }, [onPress, scene])

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [
      styles.card,
      { backgroundColor: bgColor, opacity: pressed ? 0.9 : 1 },
    ]}>
      <View style={[styles.gradientOverlay, { backgroundColor: topColor }]} />
      <View style={styles.content}>
        <Text style={styles.emoji}>{scene.emoji}</Text>
        <Text style={styles.name} numberOfLines={1}>{scene.name}</Text>
        <Text style={styles.sounds} numberOfLines={2}>{soundPreview}</Text>
      </View>
      {scene.locked && (
        <View style={styles.lockBadge}>
          <Badge label="🔒" color="amber" />
        </View>
      )}
    </Pressable>
  )
}

export const SceneCard = React.memo(SceneCardInner)

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginRight: 12,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    opacity: 0.3,
  },
  content: {
    padding: 14,
    gap: 4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  sounds: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'capitalize',
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
})
