import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NoSearchResultsScreen() {
  const popularCategories = [
    { id: 1, name: 'Hotels', icon: 'bed-outline' },
    { id: 2, name: 'Parks', icon: 'leaf-outline' },
    { id: 3, name: 'Restaurants', icon: 'restaurant-outline' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustration}>
          <Ionicons name="search-outline" size={80} color="#E0E0E0" />
        </View>

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          No results found
        </ThemedText>

        {/* Description */}
        <ThemedText type="default" style={styles.description}>
          We couldn&apos;t find exactly what you&apos;re looking for. Try checking your spelling or search for general terms like &apos;Hotels&apos; or &apos;Parks&apos;.
        </ThemedText>

        {/* Clear Search Button */}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => router.back()}
        >
          <ThemedText type="link">Clear Search</ThemedText>
        </TouchableOpacity>

        {/* Popular Categories */}
        <View style={styles.categoriesSection}>
          <ThemedText type="subtitle" style={styles.categoriesTitle}>
            Popular Categories
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {popularCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryButton}
                onPress={() => router.push(`/explore?category=${category.name.toLowerCase()}`)}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon as any} size={24} color="#007AFF" />
                </View>
                <ThemedText type="default" style={styles.categoryName}>
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
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
  clearButton: {
    padding: 16,
    marginBottom: 40,
  },
  categoriesSection: {
    width: '100%',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  categoryButton: {
    alignItems: 'center',
    minWidth: 80,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
});