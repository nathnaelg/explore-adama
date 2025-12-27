import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HelpCenterScreen() {
    const { t } = useTranslation();
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
            icon: 'call-outline',
            description: '+251 911 123 456',
            action: () => Linking.openURL('tel:+251911123456'),
        },
        {
            id: 2,
            title: t('public.liveChat'),
            icon: 'chatbubble-outline',
            description: t('public.available247'),
            action: () => router.push('/chat'),
        },
        {
            id: 3,
            title: t('public.emailUs'),
            icon: 'mail-outline',
            description: 'support@adamacity.gov.et',
            action: () => Linking.openURL('mailto:support@adamacity.gov.et'),
        },
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#666" />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        {t('public.helpSupport')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <ThemedText type="title" style={styles.heroTitle}>
                        {t('public.howCanWeHelp')}
                    </ThemedText>
                    <ThemedText type="default" style={styles.heroDescription}>
                        {t('public.heroDesc')}
                    </ThemedText>
                </View>

                {/* Contact Methods */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        {t('public.contactUs')}
                    </ThemedText>
                    <View style={styles.contactMethods}>
                        {contactMethods.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={styles.contactCard}
                                onPress={method.action}
                            >
                                <View style={styles.contactIcon}>
                                    <Ionicons name={method.icon as any} size={32} color="#007AFF" />
                                </View>
                                <ThemedText type="default" style={styles.contactTitle}>
                                    {method.title}
                                </ThemedText>
                                <ThemedText type="default" style={styles.contactDescription}>
                                    {method.description}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* FAQ Section */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        {t('public.faq')}
                    </ThemedText>
                    <View style={styles.faqList}>
                        {faqs.map((faq) => (
                            <TouchableOpacity key={faq.id} style={styles.faqItem}>
                                <View style={styles.faqQuestion}>
                                    <ThemedText type="default" style={styles.faqQuestionText}>
                                        {faq.question}
                                    </ThemedText>
                                    <Ionicons name="chevron-down" size={20} color="#666" />
                                </View>
                                <ThemedText type="default" style={styles.faqAnswer}>
                                    {faq.answer}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Legal Links */}
                <View style={styles.legalSection}>
                    <TouchableOpacity
                        style={styles.legalLink}
                        onPress={() => router.push('/privacy-policy')}
                    >
                        <ThemedText type="link">{t('public.privacyPolicy')}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.legalLink}
                        onPress={() => router.push('/terms')}
                    >
                        <ThemedText type="link">{t('public.termsOfService')}</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <ThemedText type="default" style={styles.version}>
                        {t('public.version', { version: '1.0.2' })}
                    </ThemedText>
                    <ThemedText type="default" style={styles.copyright}>
                        {t('public.copyright')}
                    </ThemedText>
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
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    hero: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    heroDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    contactMethods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    contactCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    contactIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    contactDescription: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
    faqList: {
        gap: 16,
    },
    faqItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 12,
    },
    faqAnswer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
        color: '#666',
        fontSize: 14,
        lineHeight: 20,
    },
    legalSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        paddingVertical: 32,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    legalLink: {
        padding: 8,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    version: {
        color: '#666',
        fontSize: 14,
        marginBottom: 8,
    },
    copyright: {
        color: '#666',
        fontSize: 14,
    },
});
