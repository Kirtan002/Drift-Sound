import React, { useState, useCallback } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { BottomSheet } from '../ui/BottomSheet'
import { usePlayerStore } from '../../store/playerStore'
import { useMixesStore } from '../../store/mixesStore'
import { S } from '../../constants/spacing'
import * as Haptics from 'expo-haptics'
import { PressableScale } from '../ui/PressableScale'
import { Icon } from '../ui/Icon'

interface SaveMixSheetProps {
  visible: boolean
  onClose: () => void
}

function SaveMixSheetInner({ visible, onClose }: SaveMixSheetProps) {
  const { colors } = useTheme()
  const [name, setName] = useState('')
  const activeSounds = usePlayerStore(s => s.activeSounds)
  const saveMix = useMixesStore(s => s.saveMix)

  const canSave = name.trim().length > 0 && activeSounds.length > 0

  const handleSave = useCallback(() => {
    if (!canSave) return
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    saveMix(name, activeSounds)
    setName('')
    onClose()
  }, [canSave, name, activeSounds, saveMix, onClose])

  const handleClose = useCallback(() => {
    setName('')
    onClose()
  }, [onClose])

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Save your mix">
      <View style={styles.container}>
        <View style={styles.chipRow}>
          {activeSounds.slice(0, 6).map(s => (
            <View key={s.id} style={[styles.chip, { backgroundColor: colors.bgCard }]}>
              <Text style={styles.chipEmoji}>{s.emoji ?? '🎵'}</Text>
              <Text style={[styles.chipLabel, { color: colors.textSecondary }]} numberOfLines={1}>
                {s.name}
              </Text>
            </View>
          ))}
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Name this mix…"
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            { color: colors.textPrimary, backgroundColor: colors.bgCard, borderColor: colors.border },
          ]}
          maxLength={40}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
        />

        <PressableScale
          onPress={handleSave}
          disabled={!canSave}
          haptic={false}
          style={[styles.saveBtn, { backgroundColor: canSave ? colors.accent : colors.bgCard, opacity: canSave ? 1 : 0.6 }]}
        >
          <Icon name="save" size={18} color={canSave ? '#fff' : colors.textMuted} />
          <Text style={[styles.saveLabel, { color: canSave ? '#fff' : colors.textMuted }]}>Save Mix</Text>
        </PressableScale>
      </View>
    </BottomSheet>
  )
}

export const SaveMixSheet = React.memo(SaveMixSheetInner)

const styles = StyleSheet.create({
  container: {
    gap: S.lg,
    paddingBottom: S.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: S.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 150,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    flexShrink: 1,
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: S.lg,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  saveBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: S.sm,
  },
  saveLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
})
