import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';

/**
 * Mecanismo de confianza (identificado como necesario en la revisión
 * crítica de la spec): deja claro que el resumen es una ayuda a la
 * comprensión, no un documento oficial ni asesoramiento legal, y muestra
 * el nivel de confianza del análisis cuando está disponible.
 */
export default function TrustBanner({ confianza }) {
  const nivel =
    confianza == null ? null : confianza >= 0.85 ? 'alta' : confianza >= 0.6 ? 'media' : 'baja';

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>ⓘ</Text>
      <View style={styles.textBlock}>
        <Text style={styles.text}>
          Este resumen es una ayuda para entender la carta, no sustituye al documento
          original ni es asesoramiento legal.
        </Text>
        {nivel && (
          <Text style={styles.confianza}>
            Confianza del análisis: {nivel === 'alta' ? 'alta' : nivel === 'media' ? 'media' : 'baja, revisa el original'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.tealLight,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 18,
    color: colors.tealDark,
    marginTop: 1,
  },
  textBlock: {
    flex: 1,
  },
  text: {
    ...typeScale.caption,
    color: colors.tealDark,
  },
  confianza: {
    ...typeScale.small,
    color: colors.tealDark,
    marginTop: 4,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
});
