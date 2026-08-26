import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getUrgencyColor } from '../theme/colors';
import { typeScale } from '../theme/typography';
import { deadlineLabel } from '../utils/dateUtils';

export default function DeadlineBadge({ urgencia, fechaLimite, size = 'normal' }) {
  const { bg, fg } = getUrgencyColor(urgencia);

  let texto;
  if (urgencia === 'informativa') {
    texto = 'Solo informativa';
  } else if (urgencia === 'resuelta') {
    texto = 'Resuelta';
  } else {
    texto = deadlineLabel(fechaLimite).texto;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'small' && styles.badgeSmall]}>
      <Text style={[styles.text, { color: fg }, size === 'small' && styles.textSmall]}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  text: {
    ...typeScale.caption,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  textSmall: {
    fontSize: 12,
    lineHeight: 16,
  },
});
