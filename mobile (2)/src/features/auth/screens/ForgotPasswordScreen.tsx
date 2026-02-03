import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { authService } from '@/src/features/auth/services/auth.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function ForgotPasswordScreen() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            Alert.alert(
                'Code Sent',
                'If a user with this email exists, a reset code has been sent to it.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push({
                            pathname: '/(auth)/reset-password',
                            params: { email }
                        })
                    }
                ]
            );
        } catch (error: any) {
            console.error('Forgot password error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <ThemedText type="title" style={[styles.appTitle, { color: text }]}>
                            Forgot Password
                        </ThemedText>
                        <ThemedText type="default" style={[styles.description, { color: muted }]}>
                            Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
                        </ThemedText>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <ThemedText type="default" style={[styles.label, { color: muted }]}>
                                Email Address
                            </ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: card,
                                    borderColor: chip,
                                    color: text
                                }]}
                                placeholder="Enter your email"
                                placeholderTextColor={muted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: isLoading || !email ? chip : primary }
                            ]}
                            onPress={handleSendCode}
                            disabled={isLoading || !email}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <ThemedText type="default" style={styles.buttonText}>
                                    Send Code →
                                </ThemedText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backLink}
                            onPress={() => router.back()}
                            disabled={isLoading}
                        >
                            <ThemedText type="link" lightColor={primary} darkColor={primary}>
                                Back to Login
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    keyboard: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingVertical: 20 },
    header: { alignItems: 'center', marginTop: 80, marginBottom: 40 },
    appTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
    description: { textAlign: 'center', lineHeight: 22 },
    form: { width: '100%' },
    inputContainer: { marginBottom: 24 },
    label: { marginBottom: 8, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
    button: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
    buttonText: { fontWeight: '600', fontSize: 16, color: '#FFFFFF' },
    backLink: { alignItems: 'center' },
});
