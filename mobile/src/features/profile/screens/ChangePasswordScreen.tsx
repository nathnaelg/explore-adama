import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { profileService } from '@/src/features/profile/services/profile.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ChangePasswordScreen() {
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const cardColor = useThemeColor({}, 'card');

    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (field: string, value: string) => {
        setPasswords(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        // Validation
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (passwords.newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        try {
            setLoading(true);

            await profileService.changePassword(
                passwords.currentPassword,
                passwords.newPassword
            );

            Alert.alert(
                'Success',
                'Password changed successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );

            // Clear form
            setPasswords({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

        } catch (error: any) {
            console.error('Error changing password:', error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to change password. Please check your current password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={textColor}
                        />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                        Change Password
                    </ThemedText>
                    <View style={{ width: 24 }} /> {/* Spacer */}
                </View>

                {/* Info Message */}
                <View style={[styles.infoCard, { backgroundColor: primaryColor + '10', borderColor: primaryColor + '30' }]}>
                    <Ionicons name="information-circle" size={20} color={primaryColor} />
                    <ThemedText type="default" style={[styles.infoText, { color: primaryColor }]}>
                        Password must be at least 6 characters long
                    </ThemedText>
                </View>

                {/* Current Password */}
                <View style={styles.section}>
                    <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                        Current Password
                    </ThemedText>
                    <View style={[styles.passwordInputContainer, {
                        backgroundColor: cardColor,
                        borderColor: mutedColor + '30'
                    }]}>
                        <TextInput
                            style={[styles.passwordInput, { color: textColor }]}
                            value={passwords.currentPassword}
                            onChangeText={(text) => handleChange('currentPassword', text)}
                            placeholder="Enter current password"
                            placeholderTextColor={mutedColor}
                            secureTextEntry={!showCurrentPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            <Ionicons
                                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                                size={22}
                                color={mutedColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* New Password */}
                <View style={styles.section}>
                    <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                        New Password
                    </ThemedText>
                    <View style={[styles.passwordInputContainer, {
                        backgroundColor: cardColor,
                        borderColor: mutedColor + '30'
                    }]}>
                        <TextInput
                            style={[styles.passwordInput, { color: textColor }]}
                            value={passwords.newPassword}
                            onChangeText={(text) => handleChange('newPassword', text)}
                            placeholder="Enter new password"
                            placeholderTextColor={mutedColor}
                            secureTextEntry={!showNewPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                        >
                            <Ionicons
                                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                size={22}
                                color={mutedColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm New Password */}
                <View style={styles.section}>
                    <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                        Confirm New Password
                    </ThemedText>
                    <View style={[styles.passwordInputContainer, {
                        backgroundColor: cardColor,
                        borderColor: mutedColor + '30'
                    }]}>
                        <TextInput
                            style={[styles.passwordInput, { color: textColor }]}
                            value={passwords.confirmPassword}
                            onChangeText={(text) => handleChange('confirmPassword', text)}
                            placeholder="Confirm new password"
                            placeholderTextColor={mutedColor}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons
                                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                size={22}
                                color={mutedColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Update Button */}
                <TouchableOpacity
                    style={[styles.updateButton, { backgroundColor: primaryColor }]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText type="default" style={styles.updateButtonText}>
                            Update Password
                        </ThemedText>
                    )}
                </TouchableOpacity>

                {/* Forgot Password Link */}
                <TouchableOpacity style={styles.forgotPasswordLink}>
                    <ThemedText type="link" style={{ color: primaryColor }}>
                        Forgot your password?
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    updateButton: {
        marginHorizontal: 20,
        marginTop: 16,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPasswordLink: {
        alignItems: 'center',
        marginTop: 24,
        padding: 16,
    },
});
