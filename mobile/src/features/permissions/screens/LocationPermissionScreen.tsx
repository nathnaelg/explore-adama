import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function LocationPermissionScreen() {
    const [locationEnabled, setLocationEnabled] = useState(false);

    const { t } = useTranslation();
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    const benefits = [
        {
            id: 1,
            title: t('permissions.nearbyAttractions'),
            description: t('permissions.nearbyAttractionsDesc'),
            icon: 'location-outline',
        },
        {
            id: 2,
            title: t('permissions.easyNavigation'),
            description: t('permissions.easyNavigationDesc'),
            icon: 'navigate-outline',
        },
        {
            id: 3,
            title: t('permissions.personalizedRecs'),
            description: t('permissions.personalizedRecsDesc'),
            icon: 'star-outline',
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.content}>
                {/* Illustration */}
                <View style={styles.illustration}>
                    <Image
                        source={require('@/assets/images/icon.png')}
                        style={styles.illustrationImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Title */}
                <ThemedText type="title" style={styles.title}>
                    {t('permissions.locationTitle')}
                </ThemedText>

                {/* Description */}
                <ThemedText type="default" style={[styles.description, { color: muted }]}>
                    {t('permissions.locationSubtitle')}
                </ThemedText>

                {/* Benefits */}
                <View style={styles.benefitsList}>
                    {benefits.map((benefit) => (
                        <View key={benefit.id} style={styles.benefitItem}>
                            <View style={[styles.benefitIcon, { backgroundColor: `${primary}10` }]}>
                                <Ionicons name={benefit.icon as any} size={24} color={primary} />
                            </View>
                            <View style={styles.benefitTexts}>
                                <ThemedText type="default" style={styles.benefitTitle}>
                                    {benefit.title}
                                </ThemedText>
                                <ThemedText type="default" style={[styles.benefitDescription, { color: muted }]}>
                                    {benefit.description}
                                </ThemedText>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Location Toggle */}
                <TouchableOpacity
                    style={[styles.locationToggle, { backgroundColor: card }]}
                    onPress={() => setLocationEnabled(!locationEnabled)}
                >
                    <View style={styles.toggleInfo}>
                        <Ionicons name="location" size={24} color={locationEnabled ? primary : muted} />
                        <View style={styles.toggleTexts}>
                            <ThemedText type="default" style={styles.toggleTitle}>
                                {t('permissions.allowLocation')}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.toggleDescription, { color: muted }]}>
                                {locationEnabled ? t('permissions.locationEnabled') : t('permissions.tapToEnableLocation')}
                            </ThemedText>
                        </View>
                    </View>
                    <Ionicons
                        name={locationEnabled ? 'toggle' : 'toggle-outline'}
                        size={32}
                        color={locationEnabled ? primary : muted}
                    />
                </TouchableOpacity>

                {/* Privacy Note */}
                <View style={styles.privacyNote}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={muted} />
                    <ThemedText type="default" style={[styles.privacyText, { color: muted }]}>
                        {t('permissions.privacyNote')}
                    </ThemedText>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    {locationEnabled ? (
                        <TouchableOpacity
                            style={[styles.continueButton, { backgroundColor: primary }]}
                            onPress={() => router.back()}
                        >
                            <ThemedText type="default" style={styles.continueButtonText}>
                                {t('permissions.continue')}
                            </ThemedText>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.notNowButton, { backgroundColor: card }]}
                            onPress={() => router.back()}
                        >
                            <ThemedText type="default" style={[styles.notNowButtonText, { color: muted }]}>
                                {t('permissions.notNow')}
                            </ThemedText>
                        </TouchableOpacity>
                    )}
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
    illustration: {
        marginBottom: 40,
    },
    illustrationImage: {
        width: 200,
        height: 200,
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
        marginBottom: 40,
    },
    benefitsList: {
        width: '100%',
        gap: 20,
        marginBottom: 40,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    benefitIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitTexts: {
        flex: 1,
    },
    benefitTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    benefitDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    locationToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 20,
        borderRadius: 16,
        // shadows can be problematic with dark mode on some cards, but keeping elevation for depth
        elevation: 2,
        marginBottom: 24,
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1,
    },
    toggleTexts: {
        flex: 1,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    toggleDescription: {
        fontSize: 14,
    },
    privacyNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 40,
    },
    privacyText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    actionsContainer: {
        width: '100%',
    },
    continueButton: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    notNowButton: {
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    notNowButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
