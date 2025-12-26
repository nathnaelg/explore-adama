import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LogoutConfirmationScreen() {
  const handleLogout = () => {
    // Perform logout logic here
    router.replace('/(auth)/login');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Warning Icon */}
        <View style={styles.warningIcon}>
          <Ionicons name="log-out-outline" size={80} color="#FF6B35" />
        </View>

        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          Are you sure?
        </ThemedText>

        {/* Message */}
        <ThemedText type="default" style={styles.message}>
          You are about to log out of Adama Smart Tourism. Saved trips and bookings are only accessible while logged in.
        </ThemedText>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Image
            source={require('@/assets/images/profile-avatar.jpg')}
            style={styles.userAvatar}
          />
          <View>
            <ThemedText type="default" style={styles.userName}>
              Abebe Kebede
            </ThemedText>
            <ThemedText type="default" style={styles.userEmail}>
              abebe.k@example.com
            </ThemedText>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="bookmark-outline" size={20} color="#007AFF" />
            <ThemedText type="default" style={styles.statLabel}>
              Saved Places
            </ThemedText>
            <ThemedText type="title" style={styles.statValue}>
              12
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <ThemedText type="default" style={styles.statLabel}>
              Upcoming Trips
            </ThemedText>
            <ThemedText type="title" style={styles.statValue}>
              3
            </ThemedText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <ThemedText type="default" style={styles.logoutButtonText}>
              Yes, Logout
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <ThemedText type="default" style={styles.cancelButtonText}>
              Cancel
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
  warningIcon: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#666',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    minWidth: 100,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FF3B30',
    paddingVertical: 18,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});