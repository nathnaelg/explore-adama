import { GuestPrompt } from '@/src/components/auth/GuestPrompt';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function GuestPromptScreen() {
    const params = useLocalSearchParams<{
        title: string;
        message: string;
        icon: string;
    }>();

    const handleSignIn = () => {
        router.push('/(auth)/login');
    };

    const handleClose = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'ios' ? (
                <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
            ) : (
                <View style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.8)' }]} />
            )}

            <TouchableOpacity
                activeOpacity={1}
                style={styles.dismissArea}
                onPress={handleClose}
            />

            <GuestPrompt
                title={params.title}
                message={params.message}
                icon={params.icon}
                onSignIn={handleSignIn}
                onClose={handleClose}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
});
