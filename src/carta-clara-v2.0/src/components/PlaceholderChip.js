import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';

/**
 * Representa un marcador de dato personal dentro del borrador
 * ({{NOMBRE_COMPLETO}}, {{DNI}}, ...). Nunca se rellena automáticamente
 * con datos reales generados por IA: el usuario lo edita a mano, lo que
 * responde al riesgo de privacidad detectado en la revisión ("no permitir
 * que el modelo invente o autocomplete datos personales sensibles").
 */
export default function PlaceholderChip({ marcador, onChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [borrador, setBorrador] = useState(marcador.valor || '');
  const relleno = !!marcador.valor;

  const confirmar = () => {
    onChange(marcador.id, borrador.trim());
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.chip, relleno ? styles.chipFilled : styles.chipEmpty]}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={`${marcador.etiqueta}: ${relleno ? marcador.valor : 'sin rellenar, toca para editar'}`}
      >
        <Text style={[styles.chipText, relleno ? styles.chipTextFilled : styles.chipTextEmpty]}>
          {relleno ? marcador.valor : marcador.etiqueta}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{marcador.etiqueta}</Text>
            <TextInput
              style={styles.input}
              value={borrador}
              onChangeText={setBorrador}
              placeholder={`Escribe tu ${marcador.etiqueta.toLowerCase()}`}
              autoFocus
              accessibilityLabel={`Campo para ${marcador.etiqueta}`}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmar} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    marginHorizontal: 2,
  },
  chipEmpty: {
    borderColor: colors.amber,
    borderStyle: 'dashed',
    backgroundColor: colors.amberLight,
  },
  chipFilled: {
    borderColor: colors.teal,
    backgroundColor: colors.tealLight,
  },
  chipText: {
    ...typeScale.caption,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  chipTextEmpty: {
    color: colors.amberDark,
  },
  chipTextFilled: {
    color: colors.tealDark,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(43,40,32,0.4)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    ...typeScale.h2,
    color: colors.ink,
    marginBottom: 12,
  },
  input: {
    ...typeScale.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    color: colors.ink,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  cancelText: { ...typeScale.body, color: colors.slate },
  confirmBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  confirmText: { ...typeScale.bodyBold, color: colors.white },
});
