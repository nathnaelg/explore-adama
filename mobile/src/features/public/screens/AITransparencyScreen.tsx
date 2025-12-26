import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AITransparencyScreen() {
    const reasons = [
        {
            id: 1,
            title: 'Near your location',
            description: 'Within 2km of your current spot in Kebele 04.',
            icon: 'location-outline',
            active: true,
        },
        {
            id: 2,
            title: 'Matches your interests',
            description: 'You liked "Historical Sites" and "Local Coffee" previously.',
            icon: 'heart-outline',
            active: true,
        },
        {
            id: 3,
            title: 'Popular with visitors',
            description: 'Rated 4.8/5 by other tourists this week.',
            icon: 'people-outline',
            active: false,
        },
        {
            id: 4,
            title: 'Affordable pricing',
            description: 'Fits within your budget range of $50-$150.',
            icon: 'cash-outline',
            active: false,
        },
        {
            id: 5,
            title: 'Open now',
            description: 'Currently open and accepting visitors.',
            icon: 'time-outline',
            active: true,
        },
    ];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <ThemedText type="title" style={styles.title}>
                        Why this recommendation?
                    </ThemedText>
                    <ThemedText type="default" style={styles.subtitle}>
                        Our AI suggested this spot in Adama based on your unique travel profile.
                    </ThemedText>
                </View>

                {/* Reasons */}
                <View style={styles.reasonsContainer}>
                    {reasons.map((reason) => (
                        <View key={reason.id} style={styles.reasonCard}>
                            <View style={styles.reasonHeader}>
                                <View style={styles.reasonIconContainer}>
                                    <Ionicons
                                        name={reason.icon as any}
                                        size={20}
                                        color={reason.active ? '#007AFF' : '#999'}
                                    />
                                </View>
                                <View style={styles.reasonTexts}>
                                    <ThemedText type="default" style={styles.reasonTitle}>
                                        {reason.title}
                                    </ThemedText>
                                    <ThemedText type="default" style={styles.reasonDescription}>
                                        {reason.description}
                                    </ThemedText>
                                </View>
                                {reason.active ? (
                                    <View style={styles.activeIndicator}>
                                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                    </View>
                                ) : (
                                    <View style={styles.inactiveIndicator}>
                                        <Ionicons name="close-circle" size={24} color="#FF3B30" />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={styles.gotItButton}
                        onPress={() => router.back()}
                    >
                        <ThemedText type="default" style={styles.gotItButtonText}>
                            Got it
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.manageInterestsButton}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <Ionicons name="settings-outline" size={20} color="#007AFF" />
                        <ThemedText type="default" style={styles.manageInterestsText}>
                            Manage your interests
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* AI Info */}
                <View style={styles.aiInfo}>
                    <Ionicons name="information-circle-outline" size={20} color="#666" />
                    <ThemedText type="default" style={styles.aiInfoText}>
                        Our AI learns from your preferences to provide better recommendations over time.
                    </ThemedText>
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
        paddingHorizontal: 20,
        paddingTop: 80,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    reasonsContainer: {
        gap: 16,
        marginBottom: 40,
    },
    reasonCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    reasonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reasonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    reasonTexts: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    reasonDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    activeIndicator: {
        marginLeft: 12,
    },
    inactiveIndicator: {
        marginLeft: 12,
    },
    actionsContainer: {
        gap: 12,
        marginBottom: 32,
    },
    gotItButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    gotItButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    manageInterestsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        backgroundColor: '#F0F8FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    manageInterestsText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    aiInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        gap: 12,
    },
    aiInfoText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
});
