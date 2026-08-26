import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typeScale } from '../theme/typography';
import LetterCard from '../components/LetterCard';
import { getAllLetters, saveLetter } from '../services/storageService';
import { mockLetters } from '../data/mockLetters';

export default function HomeScreen({ navigation }) {
  const [letters, setLetters] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    let stored = await getAllLetters();
    // Primera ejecución: sembramos con los 6 ejemplos para que la app
    // nunca se vea vacía en la primera apertura (igual que el prototipo).
    if (stored.length === 0) {
      for (const letter of mockLetters) {
        await saveLetter(letter);
      }
      stored = mockLetters;
    }
    setLetters(stored);
    setLoaded(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const pendientes = letters.filter((l) => l.estado === 'pendiente');
  const otras = letters.filter((l) => l.estado !== 'pendiente');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Carta Clara</Text>
        <Text style={styles.subtitle}>Tus cartas, explicadas fácil</Text>
      </View>

      {loaded && letters.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aún no tienes ninguna carta. Toca el botón de abajo para añadir la primera.
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...pendientes, ...otras]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LetterCard
              letter={item}
              onPress={() => navigation.navigate('LetterDetail', { letterId: item.id })}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Upload')}
        accessibilityRole="button"
        accessibilityLabel="Añadir nueva carta"
      >
        <Text style={styles.fabIcon}>+</Text>
        <Text style={styles.fabText}>Nueva carta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { ...typeScale.display, color: colors.tealDark },
  subtitle: { ...typeScale.body, color: colors.slate, marginTop: 2 },
  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { ...typeScale.bodyLarge, color: colors.slate, textAlign: 'center' },
  fab: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.tealDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fabIcon: { ...typeScale.h1, color: colors.white, marginRight: 8 },
  fabText: { ...typeScale.bodyBold, color: colors.white },
});
