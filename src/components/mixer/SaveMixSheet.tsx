import React, { useState, useCallback } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { BottomSheet } from '../ui/BottomSheet'
import { usePlayerStore } from '../../store/playerStore'
import { S } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'

interface SaveMixSheetProps {
  visible: boolean
  onClose: () => void
}

function SaveMixSheetInner({ visible, onClose }: SaveMixSheetProps) {
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const activeSounds = usePlayerStore(s => s.activeSounds)

  const handleSave = useCallback(() => {
    if (!name.trim() || activeSounds.length === 0) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    setName('')
    onClose()
  }, [name, activeSounds, onClose])

  const handleClose = useCallback(() => {
    setName('')
    onClose()
  }, [onClose])

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Save Mix">
      <View style={styles.container}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Mix name..."
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
            },
          ]}
          maxLength={40}
          autoFocus
        />
        <Text style={[styles.count, { color: colors.textMuted }]}>
          {activeSounds.length} sound{activeSounds.length !== 1 ? 's' : ''}
        </Text>
        <Pressable
          onPress={handleSave}
          disabled={!name.trim()}
          style={[
            styles.saveBtn,
            {
              backgroundColor: name.trim() ? colors.accent : colors.textMuted,
              opacity: name.trim() ? 1 : 0.5,
            },
          ]}
        >
          <Text style={styles.saveLabel}>Save Mix</Text>
        </Pressable>
      </View>
    </BottomSheet>
  )
}

export const SaveMixSheet = React.memo(SaveMixSheetInner)

const styles = StyleSheet.create({
  container: {
    gap: S.lg,
    paddingTop: S.md,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: S.lg,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  count: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  saveBtn: {
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
})
