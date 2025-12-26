import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '../../hooks/use-theme-color';
import { ThemedText } from '../themed/ThemedText';

const { width } = Dimensions.get('window');

interface GuestPromptProps {
    title?: string;
    message?: string;
    icon?: string;
    onSignIn: () => void;
    onClose: () => void;
}

export function GuestPrompt({
    title = 'Sign In Required',
    message = 'Please sign in to access this feature.',
    icon = 'lock-closed-outline',
    onSignIn,
    onClose
}: GuestPromptProps) {
    const primary = useThemeColor({}, 'primary');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const shadow = useThemeColor({}, 'tabBarBackground');

    return (
        <View style={[styles.content, { backgroundColor: card, shadowColor: shadow }]}>
            <View style={[styles.iconContainer, { backgroundColor: primary + '15' }]}>
                <Ionicons name={icon as any} size={40} color={primary} />
            </View>

            <ThemedText type="title" style={styles.title}>{title}</ThemedText>
            <ThemedText style={[styles.message, { color: muted }]}>{message}</ThemedText>

            <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: primary }]}
                onPress={onSignIn}
            >
                <ThemedText style={styles.primaryButtonText}>Sign In / Register</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
            >
                <ThemedText style={[styles.secondaryButtonText, { color: text }]}>
                    Continue Exploring
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        width: width * 0.85,
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        elevation: 10,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 22,
    },
    message: {
        textAlign: 'center',
        marginBottom: 28,
        fontSize: 16,
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    primaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
