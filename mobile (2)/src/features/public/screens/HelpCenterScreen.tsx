import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Linking,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpCenterScreen() {
    const { t } = useTranslation();
    const primaryColor = useThemeColor({}, 'primary');
    const backgroundColor = useThemeColor({}, 'bg');
    const cardColor = useThemeColor({}, 'card');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const tintColor = useThemeColor({}, 'tint');

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

    const faqs = [
        {
            id: 1,
            question: t('public.faq1Question', { defaultValue: 'How do I book a tour in Adama?' }),
            answer: t('public.faq1Answer', { defaultValue: 'Navigate to the Explore tab, find the tour you want, and click Book Now.' }),
        },
        {
            id: 2,
            question: t('public.faq2Question', { defaultValue: 'Can I cancel my reservation?' }),
            answer: t('public.faq2Answer', { defaultValue: 'Yes, you can cancel up to 24 hours before the booking time from your bookings page.' }),
        },
        {
            id: 3,
            question: t('public.faq3Question', { defaultValue: 'Are there guides for Sodere Resort?' }),
            answer: t('public.faq3Answer', { defaultValue: 'Yes, we offer guided tours. You can book them through our app.' }),
        },
        {
            id: 4,
            question: t('public.faq4Question', { defaultValue: 'How do I contact emergency services?' }),
            answer: t('public.faq4Answer', { defaultValue: 'Emergency contacts are available in the app settings under Safety Information.' }),
        },
    ];

    const contactMethods = [
        {
            id: 1,
            title: t('public.callUs'),
            icon: 'call',
            action: () => Linking.openURL('tel:+251911123456'),
        },
        {
            id: 2,
            title: t('public.liveChat'),
            icon: 'chatbubble',
            action: () => router.push('/chat'),
        },
        {
            id: 3,
            title: t('public.emailUs'),
            icon: 'mail',
            action: () => Linking.openURL('mailto:support@adamacity.gov.et'),
        },
    ];

    const toggleFaq = (id: number) => {
        setExpandedFaqId(expandedFaqId === id ? null : id);
    };

    return (
        <ThemedView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color={textColor} />
                </TouchableOpacity>
                <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                    {t('public.helpSupport')}
                </ThemedText>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[styles.searchBar, { backgroundColor: cardColor }]}>
                        <Ionicons name="search" size={20} color={mutedColor} style={{ marginRight: 10 }} />
                        <TextInput
                            placeholder={t('public.howCanWeHelp', { defaultValue: 'How can we help you?' })}
                            placeholderTextColor={mutedColor}
                            style={[styles.searchInput, { color: textColor }]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Contact Methods */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        {t('public.contactUs')}
                    </ThemedText>
                    <View style={styles.contactGrid}>
                        {contactMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[styles.contactCard, { backgroundColor: cardColor }]}
                                onPress={method.action}
                            >
                                <View style={[styles.contactIconCircle, { backgroundColor: '#FEF9C3' }]}>
                                    {/* Using a light yellow/gold tint for the icon bg to match branding */}
                                    <Ionicons name={method.icon as any} size={24} color="#1F2937" />
                                </View>
                                <ThemedText type="default" style={[styles.contactTitle, { color: textColor }]}>
                                    {method.title}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: textColor }]}>
                        {t('public.frequentlyAskedQuestions')}
                    </ThemedText>
                    <View style={styles.faqList}>
                        {faqs.map((faq) => {
                            const isExpanded = expandedFaqId === faq.id;
                            return (
                                <View key={faq.id} style={[styles.faqItem, { backgroundColor: cardColor }]}>
                                    <TouchableOpacity
                                        style={styles.faqHeader}
                                        onPress={() => toggleFaq(faq.id)}
                                        activeOpacity={0.7}
                                    >
                                        <ThemedText type="default" style={[styles.faqQuestionText, { color: textColor }]}>
                                            {faq.question}
                                        </ThemedText>
                                        <Ionicons
                                            name={isExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color={mutedColor}
                                        />
                                    </TouchableOpacity>
                                    {isExpanded && (
                                        <View style={styles.faqContent}>
                                            <ThemedText type="default" style={[styles.faqAnswer, { color: mutedColor }]}>
                                                {faq.answer}
                                            </ThemedText>
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Legal Links & Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.legalRow}
                        onPress={() => router.push('/privacy-policy')}
                    >
                        <ThemedText style={{ color: textColor }}>{t('public.privacyPolicy')}</ThemedText>
                        <Ionicons name="chevron-forward" size={16} color={mutedColor} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.legalRow}
                        onPress={() => router.push('/terms')}
                    >
                        <ThemedText style={{ color: textColor }}>{t('public.termsOfService')}</ThemedText>
                        <Ionicons name="chevron-forward" size={16} color={mutedColor} />
                    </TouchableOpacity>

                    <View style={styles.brandFooter}>
                        <View style={styles.logoCircle}>
                            <Ionicons name="search" size={24} color="#000" />
                            {/* Placeholder for the specific yellow branding icon if image asset not available */}
                        </View>
                        <ThemedText style={[styles.versionText, { color: mutedColor }]}>
                            Adama Smart Tourism v1.0.2
                        </ThemedText>
                        <ThemedText style={[styles.copyrightText, { color: mutedColor }]}>
                            © 2023 Adama City Administration
                        </ThemedText>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60, // Adjust for safe area or use SafeAreaView
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    contactGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    contactCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 8,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    contactIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    contactTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    faqList: {
        gap: 12,
    },
    faqItem: {
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestionText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
        marginRight: 10,
    },
    faqContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 22,
    },
    footer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    legalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    brandFooter: {
        alignItems: 'center',
        marginTop: 40,
        paddingBottom: 20,
    },
    logoCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFD700', // Gold color for branding
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    versionText: {
        fontSize: 12,
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
    },
});
