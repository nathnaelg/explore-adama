import { PasswordRequirements } from '@/src/components/auth/PasswordRequirements';
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { authService } from '@/src/features/auth/services/auth.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type ScreenState = 'INPUT' | 'SUCCESS' | 'ERROR';

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
    const [screenState, setScreenState] = useState<ScreenState>('INPUT');

    // Visibility toggles
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);

    const handleResetPassword = async () => {
        if (!email.trim() || !code.trim() || !newPassword.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Validate password format
        /*
        Removed strict client-side validation.
        */

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword({ email, code, newPassword });
            setScreenState('SUCCESS');
        } catch (error: any) {
            console.error('Reset password error:', error);
            // We use the ERROR state for logical/backend failures to reset
            setScreenState('ERROR');
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

    const handleRetry = () => {
        setScreenState('INPUT');
        // Clear password fields but keep email and code
        setNewPassword('');
        setConfirmPassword('');
    };

    // --- State Renders ---

    const renderInputState = () => (
        <>
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
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: card,
                                borderColor: passwordError ? '#EF4444' : (isNewPasswordFocused ? primary : chip),
                                color: text,
                                paddingRight: 50
                            }]}
                            placeholder="Minimum 6 characters"
                            placeholderTextColor={muted}
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                if (passwordError) setPasswordError(undefined);
                            }}
                            onFocus={() => setIsNewPasswordFocused(true)}
                            onBlur={() => setIsNewPasswordFocused(false)}
                            secureTextEntry={!showNewPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowNewPassword(!showNewPassword)}
                        >
                            <Ionicons
                                name={showNewPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color={muted}
                            />
                        </TouchableOpacity>
                    </View>
                    {(isNewPasswordFocused || passwordError) && (
                        <PasswordRequirements error={passwordError} />
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <ThemedText type="default" style={[styles.label, { color: muted }]}>
                        Confirm Password
                    </ThemedText>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: card,
                                borderColor: chip,
                                color: text,
                                paddingRight: 50
                            }]}
                            placeholder="Re-enter new password"
                            placeholderTextColor={muted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                size={24}
                                color={muted}
                            />
                        </TouchableOpacity>
                    </View>
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
        </>
    );

    const renderSuccessState = () => (
        <View style={styles.centerContent}>
            {/* Success Header */}
            <View style={{ marginBottom: 40, marginTop: 40 }}>
                <ThemedText type="title" style={{ fontSize: 20, color: text }}>Success</ThemedText>
            </View>

            <View style={[styles.iconCircle, { backgroundColor: '#D1FAE5' }]}>
                <View style={[styles.iconInner, { backgroundColor: '#10B981' }]}>
                    <Ionicons name="checkmark" size={40} color="#FFFFFF" />
                </View>
            </View>

            {/* Placeholder Image using onboarding asset */}
            <Image
                source={require('@/assets/images/onboarding_1.png')}
                style={[styles.successImage, { borderRadius: 16 }]}
                resizeMode="cover"
            />

            <ThemedText type="title" style={[styles.stateTitle, { color: text }]}>
                Password Reset Successful!
            </ThemedText>

            <ThemedText type="default" style={[styles.stateDescription, { color: muted }]}>
                Your password has been reset successfully. Please login with your new password to continue exploring Adama.
            </ThemedText>

            <View style={styles.spacer} />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: primary, width: '100%' }]}
                onPress={() => router.replace('/(auth)/login')}
            >
                <ThemedText type="default" style={styles.buttonText}>
                    Login
                </ThemedText>
            </TouchableOpacity>
        </View>
    );

    const renderErrorState = () => (
        <View style={styles.centerContent}>
            <View style={{ marginBottom: 40, marginTop: 40 }}>
                <ThemedText type="title" style={{ fontSize: 20, color: text }}>Reset Password</ThemedText>
            </View>

            <View style={[styles.iconLargeCircle, { backgroundColor: '#FEFCE8' }]}>
                <View style={[styles.iconInner, { backgroundColor: primary, width: 80, height: 80, borderRadius: 40 }]}>
                    <Ionicons name="alert-outline" size={40} color="#FFFFFF" />
                    {/* Exclamation point using alert (exclamation-circle look) or similar */}
                </View>
            </View>

            <ThemedText type="title" style={[styles.stateTitle, { color: text }]}>
                Reset Failed
            </ThemedText>

            <ThemedText type="default" style={[styles.stateDescription, { color: muted }]}>
                The reset link may have expired or is invalid. Please try again or request a new link.
            </ThemedText>

            <View style={styles.spacer} />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: primary, width: '100%' }]}
                onPress={handleRetry}
            >
                <ThemedText type="default" style={styles.buttonText}>
                    Try Again
                </ThemedText>
            </TouchableOpacity>

            {/* Use transparent button with text color matching text for the 'Back to Login' */}
            <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => router.replace('/(auth)/login')}
            >
                <ThemedText type="default" style={{ fontWeight: '600', fontSize: 16, color: text }}>
                    Back to Login
                </ThemedText>
            </TouchableOpacity>
        </View>
    );

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {screenState === 'INPUT' && renderInputState()}
                    {screenState === 'SUCCESS' && renderSuccessState()}
                    {screenState === 'ERROR' && renderErrorState()}
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    keyboard: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingVertical: 20, justifyContent: 'center' },
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

    // Password field with icon
    passwordContainer: { position: 'relative', justifyContent: 'center' },
    eyeIcon: { position: 'absolute', right: 16 },

    // State specific styles
    centerContent: { alignItems: 'center', width: '100%', paddingHorizontal: 10 },
    iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    iconLargeCircle: { width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    iconInner: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
    stateTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    stateDescription: { textAlign: 'center', lineHeight: 24, fontSize: 16, marginBottom: 24 },
    spacer: { height: 20 },
    successImage: { width: '100%', height: 200, marginBottom: 24 },
});
