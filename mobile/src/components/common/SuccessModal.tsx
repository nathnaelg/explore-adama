import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed/ThemedText';

interface SuccessModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    buttonText?: string;
}

export function SuccessModal({ visible, title, message, onClose, buttonText = 'OK' }: SuccessModalProps) {
    const cardColor = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    {/* Success Icon */}
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.15)' }]}>
                        <Ionicons name="checkmark" size={40} color={primary} />
                    </View>

                    <ThemedText style={[styles.title, { color: text }]}>{title}</ThemedText>
                    <ThemedText style={[styles.message, { color: muted }]}>{message}</ThemedText>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: primary }]}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
                    </TouchableOpacity>
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
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
