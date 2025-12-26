import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GenericErrorScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="warning-outline" size={80} color="#FF9800" />
        </View>

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          Oops, slight detour!
        </ThemedText>

        {/* Description */}
        <ThemedText type="default" style={styles.description}>
          We hit a bump in the road while loading this page. Let&apos;s try getting you back on track.
        </ThemedText>

        {/* Error Code */}
        <View style={styles.errorCodeContainer}>
          <ThemedText type="default" style={styles.errorCode}>
            Error code: 500
          </ThemedText>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.back()}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText type="default" style={styles.primaryButtonText}>
              Retry
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <ThemedText type="default" style={styles.secondaryButtonText}>
              Go back home
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Support Link */}
        <TouchableOpacity
          style={styles.supportLink}
          onPress={() => router.push('/help')}
        >
          <ThemedText type="link">Contact Support</ThemedText>
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
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorCodeContainer: {
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 32,
  },
  errorCode: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  supportLink: {
    padding: 12,
  },
});