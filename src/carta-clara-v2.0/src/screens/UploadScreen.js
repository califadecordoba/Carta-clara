import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';

/**
 * Soporte multi-página (FR añadido en la revisión: muchas cartas oficiales
 * tienen 2 o más páginas y el usuario debe poder fotografiarlas todas
 * antes de enviar a procesar).
 */
export default function UploadScreen({ navigation }) {
  const [images, setImages] = useState([]);

  const pedirPermisoYAbrir = async (fuente) => {
    if (fuente === 'camara') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Carta Clara necesita acceso a la cámara para fotografiar tu carta.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
      if (!result.canceled) {
        setImages((prev) => [...prev, result.assets[0].uri]);
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Carta Clara necesita acceso a tus fotos para importar la carta.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
      }
    }
  };

  const eliminarImagen = (uri) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  const continuar = () => {
    if (images.length === 0) {
      Alert.alert('Falta una foto', 'Añade al menos una foto de tu carta para continuar.');
      return;
    }
    navigation.navigate('Processing', { images });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Añade tu carta</Text>
        <Text style={styles.subtitle}>
          Fotografía todas las páginas del documento, una por una. Puedes añadir tantas como necesites.
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionPrimary]}
            onPress={() => pedirPermisoYAbrir('camara')}
            accessibilityRole="button"
            accessibilityLabel="Hacer una foto"
          >
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionTextPrimary}>Hacer foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionSecondary]}
            onPress={() => pedirPermisoYAbrir('galeria')}
            accessibilityRole="button"
            accessibilityLabel="Elegir de la galería"
          >
            <Text style={styles.actionIcon}>🖼️</Text>
            <Text style={styles.actionTextSecondary}>Desde galería</Text>
          </TouchableOpacity>
        </View>

        {images.length > 0 && (
          <View style={styles.pagesSection}>
            <Text style={styles.pagesTitle}>
              {images.length} {images.length === 1 ? 'página añadida' : 'páginas añadidas'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
              {images.map((uri, idx) => (
                <View key={uri} style={styles.thumbWrap}>
                  <Image source={{ uri }} style={styles.thumb} />
                  <View style={styles.thumbBadge}>
                    <Text style={styles.thumbBadgeText}>{idx + 1}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.thumbRemove}
                    onPress={() => eliminarImagen(uri)}
                    accessibilityLabel={`Eliminar página ${idx + 1}`}
                  >
                    <Text style={styles.thumbRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueBtn, images.length === 0 && styles.continueBtnDisabled]}
        onPress={continuar}
        disabled={images.length === 0}
      >
        <Text style={styles.continueText}>Traducir esta carta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { ...typeScale.h1, color: colors.ink, marginBottom: 6 },
  subtitle: { ...typeScale.body, color: colors.slate, marginBottom: 24 },
  actions: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  actionPrimary: { backgroundColor: colors.teal },
  actionSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionTextPrimary: { ...typeScale.bodyBold, color: colors.white },
  actionTextSecondary: { ...typeScale.bodyBold, color: colors.tealDark },
  pagesSection: { marginTop: 28 },
  pagesTitle: { ...typeScale.bodyBold, color: colors.ink, marginBottom: 12 },
  thumbRow: { flexDirection: 'row' },
  thumbWrap: { marginRight: 12, position: 'relative' },
  thumb: { width: 88, height: 118, borderRadius: 10, backgroundColor: colors.ivoryDeep },
  thumbBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: colors.tealDark,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  thumbBadgeText: { color: colors.white, fontSize: 11, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  thumbRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.coral,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRemoveText: { color: colors.white, fontSize: 16, lineHeight: 18 },
  continueBtn: {
    margin: 20,
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: { backgroundColor: colors.slateLight },
  continueText: { ...typeScale.bodyBold, color: colors.white },
});
