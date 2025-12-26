import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PaymentFailedScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="close-circle" size={80} color="#FF3B30" />
        </View>

        <ThemedText type="title" style={styles.title}>
          Payment Failed
        </ThemedText>

        <ThemedText type="default" style={styles.description}>
          We couldn&apos;t process your booking for Rift Valley Resort.
          Don&apos;t worry, you haven&apos;t been charged.
        </ThemedText>

        <View style={styles.errorInfo}>
          <ThemedText type="default" style={styles.errorCode}>
            Error code: 402-B
          </ThemedText>
          <ThemedText type="default" style={styles.errorCode}>
            Transaction ID: #88392
          </ThemedText>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <ThemedText type="default" style={styles.primaryButtonText}>
              Try Payment Again
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <ThemedText type="default" style={styles.secondaryButtonText}>
              Change Payment Method
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton}>
            <ThemedText type="default" style={styles.tertiaryButtonText}>
              Contact Support
            </ThemedText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <ThemedText type="link">Go to Homepage</ThemedText>
        </TouchableOpacity>
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
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorInfo: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  errorCode: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  tertiaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  homeButton: {
    padding: 12,
  },
});