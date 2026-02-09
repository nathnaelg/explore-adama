import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed/ThemedText';

interface LocationPermissionModalProps {
    visible: boolean;
    type: 'disabled' | 'denied';
    onClose: () => void;
    onSettings: () => void;
}

export function LocationPermissionModal({ visible, type, onClose, onSettings }: LocationPermissionModalProps) {
    const cardColor = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const bg = useThemeColor({}, 'bg');

    const content = {
        disabled: {
            title: 'Location Services Disabled',
            message: 'Please enable location services in your device settings to use Nearby Attractions.',
            icon: 'location-outline' as const,
            buttonText: null, // No primary button
            secondaryText: 'OK',
        },
        denied: {
            title: 'Permission Required',
            message: 'We need permission to access your location to show you nearby attractions.',
            icon: 'navigate-circle-outline' as const,
            buttonText: 'Open Settings',
            secondaryText: 'Cancel',
        }
    };

    const currentContent = content[type];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    {/* Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: bg }]}>
                        <Ionicons name={currentContent.icon} size={40} color={primary} />
                    </View>

                    <ThemedText style={[styles.title, { color: text }]}>
                        {currentContent.title}
                    </ThemedText>

                    <ThemedText style={[styles.message, { color: muted }]}>
                        {currentContent.message}
                    </ThemedText>

                    <View style={styles.actions}>
                        {currentContent.buttonText && (
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton, { backgroundColor: primary }]}
                                onPress={onSettings}
                                activeOpacity={0.8}
                            >
                                <ThemedText style={styles.primaryButtonText}>
                                    {currentContent.buttonText}
                                </ThemedText>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={onClose}
                            activeOpacity={0.6}
                        >
                            <ThemedText style={{ color: muted, fontWeight: '600' }}>
                                {currentContent.secondaryText}
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '85%',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButton: {
        // bg handled in render
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
    }
});
