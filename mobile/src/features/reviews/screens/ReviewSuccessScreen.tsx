import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ReviewSuccessScreen() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="star" size={100} color="#FFD700" />
                </View>

                <ThemedText type="title" style={styles.title}>
                    Review Submitted!
                </ThemedText>

                <ThemedText type="default" style={[styles.description, { color: muted }]}>
                    Thanks for sharing your experience in Adama. Your review is now visible to the community and helps others explore.
                </ThemedText>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: primary }]}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <ThemedText type="default" style={styles.primaryButtonText}>
                            Done
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: card }]}
                        onPress={() => router.push('/reviews')}
                    >
                        <ThemedText type="default" style={[styles.secondaryButtonText, { color: muted }]}>
                            View My Review
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
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    primaryButton: {
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
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});
