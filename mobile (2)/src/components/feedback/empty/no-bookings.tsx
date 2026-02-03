import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NoBookingsScreen() {
  const popularActivities = [
    {
      id: 1,
      name: 'Sodere Resort',
      type: 'Hot Springs',
      image: require('@/assets/images/icon.png'),
    },
    {
      id: 2,
      name: 'Koka Lake',
      type: 'Nature & Boating',
      image: require('@/assets/images/icon.png'),
    },
    {
      id: 3,
      name: 'Cultural City Tour',
      type: 'Guided Tour',
      image: require('@/assets/images/icon.png'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#666" />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>
            My Bookings
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Empty State Content */}
        <View style={styles.emptyContent}>
          <View style={styles.illustration}>
            <Ionicons name="calendar-outline" size={80} color="#E0E0E0" />
          </View>

          <ThemedText type="title" style={styles.emptyTitle}>
            No bookings yet
          </ThemedText>

          <ThemedText type="default" style={styles.emptyDescription}>
            It looks like you haven&apos;t planned any trips in Adama yet. Let&apos;s find you something exciting!
          </ThemedText>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => router.push('/(tabs)/explore')}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <ThemedText type="default" style={styles.bookButtonText}>
              Book an Event →
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Popular in Adama */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="title" style={styles.sectionTitle}>
              Popular in Adama
            </ThemedText>
            <TouchableOpacity>
              <ThemedText type="link">View All</ThemedText>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScrollContent}
          >
            {popularActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => router.push(`/place/${activity.id}`)}
              >
                <View style={styles.activityImagePlaceholder}>
                  <Ionicons name="image-outline" size={40} color="#999" />
                </View>
                <View style={styles.activityInfo}>
                  <ThemedText type="default" style={styles.activityName}>
                    {activity.name}
                  </ThemedText>
                  <ThemedText type="default" style={styles.activityType}>
                    {activity.type}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  illustration: {
    marginBottom: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  popularSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  popularScrollContent: {
    gap: 16,
  },
  activityCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activityImagePlaceholder: {
    height: 120,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    padding: 16,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityType: {
    color: '#666',
    fontSize: 14,
  },
});