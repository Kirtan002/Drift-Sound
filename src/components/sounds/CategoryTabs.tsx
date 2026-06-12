import React, { useCallback } from 'react'
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { hPad } from '../../constants/spacing'
import { CATEGORIES } from '../../constants/sounds'
import * as Haptics from 'expo-haptics'

interface CategoryTabsProps {
  active: string
  onSelect: (categoryId: string) => void
}

function CategoryTabsInner({ active, onSelect }: CategoryTabsProps) {
  const { colors } = useTheme()

  const handleSelect = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onSelect(id)
  }, [onSelect])

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingHorizontal: hPad }]}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active
        return (
          <Pressable
            key={cat.id}
            onPress={() => handleSelect(cat.id)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.accent : 'transparent',
                borderColor: isActive ? colors.accent : colors.border,
                borderWidth: 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {cat.label}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}

export const CategoryTabs = React.memo(CategoryTabsInner)

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
})
