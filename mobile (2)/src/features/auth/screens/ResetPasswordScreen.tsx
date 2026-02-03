import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { authService } from '@/src/features/auth/services/auth.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
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
    View,
} from 'react-native';

export default function ResetPasswordScreen() {
    const { email: emailParam } = useLocalSearchParams<{ email: string }>();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');

    const [email, setEmail] = useState(emailParam || '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim() || !code.trim() || !newPassword.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({ email, code, newPassword });
            Alert.alert(
                'Success',
                'Your password has been reset successfully. Please login with your new password.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/login')
                    }
                ]
            );
        } catch (error: any) {
            console.error('Reset password error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'No email address found.');
            return;
        }
        setIsLoading(true);
        try {
            await authService.forgotPassword({ email });
            Alert.alert('Success', 'A new code has been sent to your email.');
        } catch (error: any) {
            console.error('Resend code error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to resend code');
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
                            Reset Password
                        </ThemedText>
                        <ThemedText type="default" style={[styles.description, { color: muted }]}>
                            Enter the 6-digit code sent to your email and your new password.
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
                                placeholder="Confirm your email"
                                placeholderTextColor={muted}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!isLoading && !emailParam}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText type="default" style={[styles.label, { color: muted }]}>
                                Reset Code
                            </ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: card,
                                    borderColor: chip,
                                    color: text,
                                    textAlign: 'center',
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    letterSpacing: 8
                                }]}
                                placeholder="000000"
                                placeholderTextColor={muted}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.resendLink}
                            onPress={handleResendCode}
                            disabled={isLoading}
                        >
                            <ThemedText type="link" style={{ fontSize: 14 }} lightColor={primary} darkColor={primary}>
                                Resend Code
                            </ThemedText>
                        </TouchableOpacity>

                        <View style={styles.inputContainer}>
                            <ThemedText type="default" style={[styles.label, { color: muted }]}>
                                New Password
                            </ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: card,
                                    borderColor: chip,
                                    color: text
                                }]}
                                placeholder="Minimum 6 characters"
                                placeholderTextColor={muted}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <ThemedText type="default" style={[styles.label, { color: muted }]}>
                                Confirm Password
                            </ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: card,
                                    borderColor: chip,
                                    color: text
                                }]}
                                placeholder="Re-enter new password"
                                placeholderTextColor={muted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                { backgroundColor: isLoading ? chip : primary }
                            ]}
                            onPress={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <ThemedText type="default" style={styles.buttonText}>
                                    Reset Password
                                </ThemedText>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backLink}
                            onPress={() => router.back()}
                            disabled={isLoading}
                        >
                            <ThemedText type="link" lightColor={primary} darkColor={primary}>
                                Cancel
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
    header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
    appTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
    description: { textAlign: 'center', lineHeight: 22 },
    form: { width: '100%' },
    inputContainer: { marginBottom: 20 },
    label: { marginBottom: 8, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
    button: { paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 24 },
    buttonText: { fontWeight: '600', fontSize: 16, color: '#FFFFFF' },
    backLink: { alignItems: 'center' },
    resendLink: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -15 },
});
