import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TermsConditionsScreen() {
    const { t } = useTranslation();
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const cardColor = useThemeColor({}, 'card');

    const sections = [
        {
            id: 1,
            number: '1.',
            title: t('public.term1Title'),
            content: t('public.term1Content'),
        },
        {
            id: 2,
            number: '2.',
            title: t('public.term2Title'),
            content: t('public.term2Content'),
        },
        {
            id: 3,
            number: '3.',
            title: t('public.term3Title'),
            content: t('public.term3Content'),
        },
        {
            id: 4,
            number: '4.',
            title: t('public.term4Title'),
            content: t('public.term4Content'),
        },
        {
            id: 5,
            number: '5.',
            title: t('public.term5Title'),
            content: t('public.term5Content'),
        },
        {
            id: 6,
            number: '6.',
            title: t('public.term6Title'),
            content: t('public.term6Content'),
        },
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                        {t('public.termsAndConditions')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Last Updated */}
                <View style={[styles.updatedContainer, { backgroundColor: mutedColor + '10' }]}>
                    <ThemedText type="default" style={[styles.updatedText, { color: mutedColor }]}>
                        {t('public.lastUpdated', { date: 'OCTOBER 24, 2023' })}
                    </ThemedText>
                </View>

                {/* Introduction */}
                <View style={[styles.introduction, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="default" style={[styles.introductionText, { color: mutedColor }]}>
                        {t('public.termsIntro')}
                    </ThemedText>
                </View>

                {/* Sections */}
                <View style={styles.sectionsContainer}>
                    {sections.map((section) => (
                        <View key={section.id} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ThemedText type="title" style={[styles.sectionNumber, { color: primaryColor }]}>
                                    {section.number}
                                </ThemedText>
                                <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                                    {section.title}
                                </ThemedText>
                            </View>
                            <ThemedText type="default" style={[styles.sectionContent, { color: mutedColor }]}>
                                {section.content}
                            </ThemedText>
                        </View>
                    ))}
                </View>

                {/* Agreement */}
                <View style={[styles.agreementContainer, { borderTopColor: mutedColor + '20', borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="default" style={[styles.agreementText, { color: mutedColor }]}>
                        {t('public.agreementText')}
                    </ThemedText>
                </View>

                {/* Accept Button */}
                <TouchableOpacity
                    style={[styles.acceptButton, { backgroundColor: primaryColor }]}
                    onPress={() => router.back()}
                >
                    <ThemedText type="default" style={styles.acceptButtonText}>
                        {t('public.acceptContinue')}
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
    updatedContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5F5F5',
    },
    updatedText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    introduction: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    introductionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
    },
    sectionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#007AFF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    agreementContainer: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    agreementText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
    },
    acceptButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
