import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function NoInternetScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <ThemedText type="title" style={styles.title}>
          No Connection
        </ThemedText>

        <ThemedText type="default" style={styles.description}>
          It looks like you&apos;re offline. Check your connection to keep exploring Adama&apos;s best spots.
        </ThemedText>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText type="default" style={styles.primaryButtonText}>
              Retry
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <ThemedText type="default" style={styles.secondaryButtonText}>
              View Saved Tickets
            </ThemedText>
          </TouchableOpacity>
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
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});