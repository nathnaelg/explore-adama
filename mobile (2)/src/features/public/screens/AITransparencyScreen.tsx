import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    StyleSheet, TouchableOpacity, View
} from 'react-native';

export default function AITransparencyScreen() {
    const { t } = useTranslation();
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const reasons = [
        {
            id: 1,
            title: t('aiTransparency.reason1Title'),
            description: t('aiTransparency.reason1Description', { distance: '2km', location: 'Kebele 04' }),
            icon: 'location-outline',
            active: true,
        },
        {
            id: 2,
            title: t('aiTransparency.reason2Title'),
            description: t('aiTransparency.reason2Description', { interest1: 'Historical Sites', interest2: 'Local Coffee' }),
            icon: 'heart-outline',
            active: true,
        },
        {
            id: 3,
            title: t('aiTransparency.reason3Title'),
            description: t('aiTransparency.reason3Description', { rating: '4.8/5' }),
            icon: 'people-outline',
            active: false,
        },
        {
            id: 4,
            title: t('aiTransparency.reason4Title'),
            description: t('aiTransparency.reason4Description', { minBudget: '$50', maxBudget: '$150' }),
            icon: 'cash-outline',
            active: false,
        },
        {
            id: 5,
            title: t('aiTransparency.reason5Title'),
            description: t('aiTransparency.reason5Description'),
            icon: 'time-outline',
            active: true,
        },
    ];

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={textColor}
                        />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                        {t('public.aiTransparency')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.heroSection}>
                    <View style={[styles.aiIcon, { backgroundColor: primaryColor + '15' }]}>
                        <Ionicons name="sparkles" size={40} color={primaryColor} />
                    </View>
                    <ThemedText type="title" style={[styles.heroTitle, { color: textColor }]}>
                        {t('public.aiHeroTitle')}
                    </ThemedText>
                    <ThemedText type="default" style={[styles.heroSubtitle, { color: mutedColor }]}>
                        {t('public.aiHeroSubtitle')}
                    </ThemedText>
                </View>

                {/* Reasons */}
                <View style={styles.reasonsContainer}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        {t('aiTransparency.whyThisRecommendation')}
                    </ThemedText>
                    <ThemedText type="default" style={[styles.subtitle, { color: mutedColor }]}>
                        {t('aiTransparency.aiSuggestionIntro', { location: 'Adama' })}
                    </ThemedText>
                    {reasons.map((reason) => (
                        <View key={reason.id} style={styles.reasonCard}>
                            <View style={styles.reasonHeader}>
                                <View style={styles.reasonIconContainer}>
                                    <Ionicons
                                        name={reason.icon as any}
                                        size={20}
                                        color={reason.active ? primaryColor : mutedColor}
                                    />
                                </View>
                                <View style={styles.reasonTexts}>
                                    <ThemedText type="default" style={[styles.reasonTitle, { color: textColor }]}>
                                        {reason.title}
                                    </ThemedText>
                                    <ThemedText type="default" style={[styles.reasonDescription, { color: mutedColor }]}>
                                        {reason.description}
                                    </ThemedText>
                                </View>
                                {reason.active ? (
                                    <View style={styles.activeIndicator}>
                                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                    </View>
                                ) : (
                                    <View style={styles.inactiveIndicator}>
                                        <Ionicons name="close-circle" size={24} color="#FF3B30" />
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        {t('public.ourPrinciples')}
                    </ThemedText>

                    <View style={styles.principleItem}>
                        <Ionicons name="shield-outline" size={24} color={primaryColor} />
                        <View style={styles.principleContent}>
                            <ThemedText type="default" style={[styles.principleTitle, { color: textColor }]}>
                                {t('public.privacyFirst')}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.principleDesc, { color: mutedColor }]}>
                                {t('public.privacyFirstDesc')}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.principleItem}>
                        <Ionicons name="bulb-outline" size={24} color={primaryColor} />
                        <View style={styles.principleContent}>
                            <ThemedText type="default" style={[styles.principleTitle, { color: textColor }]}>
                                {t('public.transparency')}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.principleDesc, { color: mutedColor }]}>
                                {t('public.transparencyDesc')}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.principleItem}>
                        <Ionicons name="happy-outline" size={24} color={primaryColor} />
                        <View style={styles.principleContent}>
                            <ThemedText type="default" style={[styles.principleTitle, { color: textColor }]}>
                                {t('public.userControl')}
                            </ThemedText>
                            <ThemedText type="default" style={[styles.principleDesc, { color: mutedColor }]}>
                                {t('public.userControlDesc')}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { borderBottomColor: mutedColor + '15' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        {t('public.accuracy')}
                    </ThemedText>
                    <View style={[styles.alertBox, { backgroundColor: '#FFA50015', borderColor: '#FFA500' }]}>
                        <Ionicons name="warning-outline" size={20} color="#FFA500" />
                        <ThemedText type="default" style={[styles.alertText, { color: textColor }]}>
                            {t('public.aiWarning')}
                        </ThemedText>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.gotItButton, { backgroundColor: primaryColor }]}
                        onPress={() => router.back()}
                    >
                        <ThemedText type="default" style={styles.gotItButtonText}>
                            {t('public.gotIt')}
                        </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.manageInterestsButton, { borderColor: primaryColor, backgroundColor: primaryColor + '15' }]}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <Ionicons name="settings-outline" size={20} color={primaryColor} />
                        <ThemedText type="default" style={[styles.manageInterestsText, { color: primaryColor }]}>
                            {t('public.manageInterests')}
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* AI Info */}
                <View style={[styles.aiInfo, { backgroundColor: mutedColor + '10' }]}>
                    <Ionicons name="information-circle-outline" size={20} color={mutedColor} />
                    <ThemedText type="default" style={[styles.aiInfoText, { color: mutedColor }]}>
                        {t('public.aiLearningInfo')}
                    </ThemedText>
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
        paddingHorizontal: 20,
        paddingTop: 80,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: 32,
        marginBottom: 24,
    },
    aiIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
    },
    section: {
        paddingVertical: 24,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    principleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        gap: 16,
    },
    principleContent: {
        flex: 1,
    },
    principleTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    principleDesc: {
        fontSize: 14,
        lineHeight: 20,
    },
    alertBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
        alignItems: 'flex-start',
    },
    alertText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    reasonsContainer: {
        gap: 16,
        marginBottom: 40,
    },
    reasonCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    reasonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reasonIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    reasonTexts: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    reasonDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    activeIndicator: {
        marginLeft: 12,
    },
    inactiveIndicator: {
        marginLeft: 12,
    },
    actionsContainer: {
        gap: 12,
        marginBottom: 32,
    },
    gotItButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    gotItButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    manageInterestsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        backgroundColor: '#F0F8FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    manageInterestsText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    aiInfo: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#FFF9E6',
        borderRadius: 12,
        gap: 12,
    },
    aiInfoText: {
        flex: 1,
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
});
