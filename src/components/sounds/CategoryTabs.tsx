import React, { useCallback } from 'react'
import { ScrollView, Text, StyleSheet } from 'react-native'
import { useTheme } from '../../constants/ThemeContext'
import { hPad } from '../../constants/spacing'
import { CATEGORIES } from '../../constants/sounds'
import { PressableScale } from '../ui/PressableScale'

interface CategoryTabsProps {
  active: string
  onSelect: (categoryId: string) => void
}

function CategoryTabsInner({ active, onSelect }: CategoryTabsProps) {
  const { colors } = useTheme()

  const handleSelect = useCallback((id: string) => {
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
          <PressableScale
            key={cat.id}
            onPress={() => handleSelect(cat.id)}
            scaleTo={0.94}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.accent : colors.bgCard,
                borderColor: isActive ? colors.accent : colors.border,
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
          </PressableScale>
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
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
})
