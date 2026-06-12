import React, { useEffect, useState, useCallback } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useKeepAwake } from 'expo-keep-awake'

interface NightShieldProps {
  onDismiss?: () => void
}

function NightShieldInner({ onDismiss }: NightShieldProps) {
  useKeepAwake()
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  const handleDismiss = useCallback(() => {
    onDismiss?.()
  }, [onDismiss])

  return (
    <Pressable style={styles.overlay} onPress={handleDismiss}>
      <Text style={styles.clock}>{time}</Text>
      <Text style={styles.hint}>Tap to dismiss</Text>
    </Pressable>
  )
}

export const NightShield = React.memo(NightShieldInner)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  clock: {
    color: '#222222',
    fontSize: 80,
    fontFamily: 'Nunito_700Bold',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    color: '#1A1A1A',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    position: 'absolute',
    bottom: 60,
  },
})
