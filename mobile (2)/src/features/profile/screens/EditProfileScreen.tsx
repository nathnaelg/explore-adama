import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { profileService } from '@/src/features/profile/services/profile.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditProfileScreen() {
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const cardColor = useThemeColor({}, 'card');
    const chipColor = useThemeColor({}, 'chip');
    const { user: authUser, updateUser: authUpdateUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        country: '',
        locale: 'en',
        avatar: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        if (!authUser?.id) return;

        try {
            const userData = await profileService.getCurrentUser(authUser.id);
            if (userData) {
                setProfile({
                    name: userData.profile?.name || authUser.name || '',
                    email: userData.email || authUser.email || '',
                    phone: userData.profile?.phone || '',
                    gender: userData.profile?.gender || '',
                    country: userData.profile?.country || '',
                    locale: userData.profile?.locale || 'en',
                    avatar: userData.profile?.avatar || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Fallback to basic auth info if fetch fails
            setProfile(prev => ({
                ...prev,
                name: authUser.name || '',
                email: authUser.email || '',
            }));
            // Don't alert blocking error, just log it.
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('avatar', {
                uri,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            } as any);

            const response = await profileService.uploadAvatar(formData);

            setProfile(prev => ({
                ...prev,
                avatar: response.url,
            }));

            // Sync with global auth state immediately
            if (response.user) {
                await authUpdateUser(response.user);
            }

            Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const updateData = {
                name: profile.name,
                phone: profile.phone,
                gender: profile.gender,
                country: profile.country,
                locale: profile.locale,
            };

            const updatedUser = await profileService.updateProfile(updateData);

            // Sync with global auth state
            await authUpdateUser(updatedUser);

            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value,
        }));
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
                        Edit Profile
                    </ThemedText>
                    <TouchableOpacity
                        onPress={handleSave}
                        style={styles.saveHeaderButton}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={primaryColor} />
                        ) : (
                            <ThemedText
                                type="link"
                                style={{ color: primaryColor }}
                            >
                                Save
                            </ThemedText>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Profile Photo */}
                <View style={[styles.photoSection, { borderBottomColor: mutedColor + '20' }]}>
                    <TouchableOpacity
                        style={styles.photoContainer}
                        onPress={pickImage}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <View style={[styles.profilePhoto, styles.loadingPhoto]}>
                                <ActivityIndicator size="large" color={primaryColor} />
                            </View>
                        ) : profile.avatar ? (
                            <Image
                                source={{ uri: profile.avatar }}
                                style={styles.profilePhoto}
                            />
                        ) : (
                            <View style={[styles.profilePhoto, styles.placeholderPhoto, { backgroundColor: chipColor }]}>
                                <Ionicons name="person" size={60} color={mutedColor} />
                            </View>
                        )}
                        <View style={[styles.editPhotoButton, { backgroundColor: primaryColor }]}>
                            <Ionicons name="camera" size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                        <ThemedText
                            type="link"
                            style={{ color: primaryColor, marginTop: 8 }}
                        >
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Personal Info */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        Personal Info
                    </ThemedText>

                    {/* Name Fields */}
                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.halfInput]}>
                            <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                                Full Name
                            </ThemedText>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: cardColor,
                                    color: textColor,
                                    borderColor: mutedColor + '30'
                                }]}
                                value={profile.name}
                                onChangeText={(text) => handleChange('name', text)}
                                placeholder="Enter your name"
                                placeholderTextColor={mutedColor}
                            />
                        </View>
                    </View>

                    {/* Email (read-only) */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                            Email
                        </ThemedText>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: chipColor,
                                color: mutedColor,
                                borderColor: mutedColor + '30'
                            }]}
                            value={profile.email}
                            editable={false}
                            placeholder="Email"
                            placeholderTextColor={mutedColor}
                        />
                        <ThemedText type="defaultSemiBold" style={{ fontSize: 12, color: mutedColor, marginTop: 4 }}>
                            Email cannot be changed
                        </ThemedText>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                            Phone Number
                        </ThemedText>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: cardColor,
                                color: textColor,
                                borderColor: mutedColor + '30'
                            }]}
                            value={profile.phone}
                            onChangeText={(text) => handleChange('phone', text)}
                            placeholder="Enter phone number"
                            placeholderTextColor={mutedColor}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Gender */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                            Gender
                        </ThemedText>
                        <View style={styles.genderContainer}>
                            {['Male', 'Female', 'Other'].map((gender) => (
                                <TouchableOpacity
                                    key={gender}
                                    style={[
                                        styles.genderButton,
                                        { backgroundColor: cardColor, borderColor: mutedColor + '30' },
                                        profile.gender === gender && { backgroundColor: primaryColor + '20', borderColor: primaryColor },
                                    ]}
                                    onPress={() => handleChange('gender', gender)}
                                >
                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.genderText,
                                            { color: mutedColor },
                                            profile.gender === gender && { color: primaryColor, fontWeight: '600' },
                                        ]}
                                    >
                                        {gender}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Country */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                            Country
                        </ThemedText>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: cardColor,
                                color: textColor,
                                borderColor: mutedColor + '30'
                            }]}
                            value={profile.country}
                            onChangeText={(text) => handleChange('country', text)}
                            placeholder="Enter your country"
                            placeholderTextColor={mutedColor}
                        />
                    </View>
                </View>

                {/* Language */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        Language
                    </ThemedText>

                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: mutedColor }]}>
                            Preferred Language
                        </ThemedText>
                        <View style={[
                            styles.languageSelector,
                            {
                                backgroundColor: cardColor,
                                borderColor: mutedColor + '30'
                            }
                        ]}>
                            <ThemedText type="default" style={[styles.selectedLanguage, { color: textColor }]}>
                                {profile.locale === 'en' ? 'English' :
                                    profile.locale === 'am' ? 'Amharic' :
                                        profile.locale === 'om' ? 'Afan Oromo' : 'English'}
                            </ThemedText>
                            <Ionicons name="chevron-down" size={20} color={mutedColor} />
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: primaryColor }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <ThemedText type="default" style={styles.saveButtonText}>
                            Save Changes
                        </ThemedText>
                    )}
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
    saveHeaderButton: {
        padding: 8,
        marginRight: -8,
        minWidth: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
    },
    photoContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderPhoto: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingPhoto: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    halfInput: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
    },
    genderContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    genderText: {
        fontSize: 14,
    },
    languageSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
    },
    selectedLanguage: {
        fontSize: 16,
    },
    saveButton: {
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
