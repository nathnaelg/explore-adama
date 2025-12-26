import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NoFavoritesScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <Ionicons name="heart-outline" size={80} color="#E0E0E0" />
        </View>

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          No favorites yet
        </ThemedText>

        {/* Description */}
        <ThemedText type="default" style={styles.description}>
          It looks like you haven&apos;t saved any spots in Adama. Start exploring and tap the heart icon to save your dream destinations.
        </ThemedText>

        {/* Start Exploring Button */}
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <ThemedText type="default" style={styles.exploreButtonText}>
            Start Exploring
          </ThemedText>
        </TouchableOpacity>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <ThemedText type="subtitle" style={styles.tipsTitle}>
            How to save places:
          </ThemedText>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="search" size={20} color="#007AFF" />
              <ThemedText type="default" style={styles.tipText}>
                Search for places you like
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="heart" size={20} color="#007AFF" />
              <ThemedText type="default" style={styles.tipText}>
                Tap the heart icon on any place
              </ThemedText>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bookmark" size={20} color="#007AFF" />
              <ThemedText type="default" style={styles.tipText}>
                Find all saved places here
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  illustration: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    width: '100%',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tipsList: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
});