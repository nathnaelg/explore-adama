import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OfflineScreen() {
    const offlineItems = [
        {
            id: 1,
            type: 'CACHED',
            title: 'My Bookings',
            description: '2 Active Tickets',
            icon: 'ticket-outline',
            color: '#007AFF',
        },
        {
            id: 2,
            type: 'DOWNLOADED',
            title: 'City Maps',
            description: 'Adama Central',
            icon: 'map-outline',
            color: '#4CAF50',
        },
        {
            id: 3,
            type: 'SAVED',
            title: 'Favorites',
            description: '5 Places',
            icon: 'heart-outline',
            color: '#FF6B35',
        },
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>
                        Offline Mode
                    </ThemedText>
                    <ThemedText type="default" style={styles.subtitle}>
                        You are currently offline
                    </ThemedText>
                    <ThemedText type="default" style={styles.description}>
                        We can&apos;t reach our servers right now. Check your connection or explore your saved items below.
                    </ThemedText>
                </View>

                {/* Retry Button */}
                <TouchableOpacity style={styles.retryButton}>
                    <Ionicons name="refresh-outline" size={20} color="#007AFF" />
                    <ThemedText type="default" style={styles.retryText}>
                        Retry Connection
                    </ThemedText>
                </TouchableOpacity>

                {/* Settings Button */}
                <TouchableOpacity style={styles.settingsButton}>
                    <ThemedText type="link">Go to Settings</ThemedText>
                </TouchableOpacity>

                {/* Available Offline */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Available Offline
                    </ThemedText>
                    <View style={styles.offlineItems}>
                        {offlineItems.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.offlineItem}>
                                <View style={styles.itemHeader}>
                                    <View style={[styles.itemIcon, { backgroundColor: `${item.color}20` }]}>
                                        <Ionicons name={item.icon as any} size={24} color={item.color} />
                                    </View>
                                    <View style={styles.itemType}>
                                        <ThemedText type="default" style={styles.itemTypeText}>
                                            {item.type}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.itemContent}>
                                    <ThemedText type="default" style={styles.itemTitle}>
                                        {item.title}
                                    </ThemedText>
                                    <ThemedText type="default" style={styles.itemDescription}>
                                        {item.description}
                                    </ThemedText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Note */}
                <View style={styles.noteContainer}>
                    <Ionicons name="information-circle-outline" size={20} color="#666" />
                    <ThemedText type="default" style={styles.noteText}>
                        Note: Real-time updates, new bookings, and full photo galleries are unavailable while offline.
                    </ThemedText>
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
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F0F8FF',
        marginHorizontal: 20,
        marginBottom: 12,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    retryText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    settingsButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    offlineItems: {
        gap: 16,
    },
    offlineItem: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemType: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    itemTypeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    itemContent: {
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDescription: {
        color: '#666',
        fontSize: 14,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 24,
        marginHorizontal: 20,
        marginBottom: 40,
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        gap: 12,
    },
    noteText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
});
