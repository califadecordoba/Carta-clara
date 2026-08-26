import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';
import DeadlineBadge from './DeadlineBadge';
import { formatDateEs } from '../utils/dateUtils';

export default function LetterCard({ letter, onPress }) {
  const noLeida = !letter.leida;

  return (
    <TouchableOpacity
      style={[styles.card, noLeida && styles.cardNoLeida]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${noLeida ? 'No leída. ' : ''}${letter.organismo.nombre}. ${letter.titulo}. ${letter.resumenCorto}`}
    >
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: letter.organismo.color }]} />
        <Text style={styles.organismo} numberOfLines={1}>
          {letter.organismo.nombre}
        </Text>
        {noLeida && (
          <View style={styles.nuevaBadge}>
            <Text style={styles.nuevaBadgeText}>Nueva</Text>
          </View>
        )}
      </View>

      <Text style={styles.titulo}>{letter.titulo}</Text>
      <Text style={styles.resumen} numberOfLines={2}>
        {letter.resumenCorto}
      </Text>

      <View style={styles.footer}>
        <DeadlineBadge urgencia={letter.urgencia} fechaLimite={letter.fechaLimite} />
        <Text style={styles.fecha}>{formatDateEs(letter.fechaRecepcion)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardNoLeida: {
    backgroundColor: colors.unreadBg,
    borderColor: colors.unreadBorder,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nuevaBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.teal,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  nuevaBadgeText: {
    ...typeScale.small,
    color: colors.white,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  organismo: {
    ...typeScale.caption,
    color: colors.slate,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    flexShrink: 1,
  },
  titulo: {
    ...typeScale.h2,
    color: colors.ink,
    marginBottom: 4,
  },
  resumen: {
    ...typeScale.body,
    color: colors.slate,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fecha: {
    ...typeScale.small,
    color: colors.slateLight,
  },
});
