import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Checkbox } from 'react-native-paper';

export default function PrivacyPolicyScreen() {
    const primaryColor = useThemeColor({}, 'primary');
    const textColor = useThemeColor({}, 'text');
    const mutedColor = useThemeColor({}, 'muted');
    const cardColor = useThemeColor({}, 'card');

    const [consents, setConsents] = useState({
        thirdPartyServices: true,
        dataSecurity: false,
        marketingEmails: false,
    });

    const toggleConsent = (key: keyof typeof consents) => {
        setConsents(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        Privacy Policy
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Updated Date */}
                <View style={[styles.dateContainer, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="default" style={[styles.dateText, { color: mutedColor }]}>
                        Updated Oct 24, 2023
                    </ThemedText>
                </View>

                {/* Introduction */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                        Your Privacy Matters
                    </ThemedText>
                    <ThemedText type="default" style={[styles.description, { color: mutedColor }]}>
                        At <ThemedText type="default" style={[styles.brand, { color: primaryColor }]}>Adama Smart Tourism</ThemedText>,
                        we value your trust. Here is a transparent breakdown of how we handle your data while
                        you explore the city.
                    </ThemedText>
                </View>

                {/* Information We Collect */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                        Information We Collect
                    </ThemedText>

                    <View style={styles.subSection}>
                        <ThemedText type="subtitle" style={[styles.subSectionTitle, { color: textColor }]}>
                            Location Data
                        </ThemedText>
                        <ThemedText type="default" style={[styles.subSectionDescription, { color: mutedColor }]}>
                            We collect location data to provide you with nearby attractions, hotels, and services.
                            This helps us personalize your experience and show relevant recommendations.
                        </ThemedText>
                    </View>

                    <View style={styles.consentList}>
                        <TouchableOpacity
                            style={styles.consentItem}
                            onPress={() => toggleConsent('thirdPartyServices')}
                            activeOpacity={0.7}
                        >
                            <Checkbox.Android
                                status={consents.thirdPartyServices ? 'checked' : 'unchecked'}
                                color={primaryColor}
                                uncheckedColor={mutedColor}
                            />
                            <ThemedText type="default" style={[styles.consentText, { color: textColor }]}>
                                Third-Party Services
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.consentItem}
                            onPress={() => toggleConsent('dataSecurity')}
                            activeOpacity={0.7}
                        >
                            <Checkbox.Android
                                status={consents.dataSecurity ? 'checked' : 'unchecked'}
                                color={primaryColor}
                                uncheckedColor={mutedColor}
                            />
                            <ThemedText type="default" style={[styles.consentText, { color: textColor }]}>
                                Data Security
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.consentItem}
                            onPress={() => toggleConsent('marketingEmails')}
                            activeOpacity={0.7}
                        >
                            <Checkbox.Android
                                status={consents.marketingEmails ? 'checked' : 'unchecked'}
                                color={primaryColor}
                                uncheckedColor={mutedColor}
                            />
                            <ThemedText type="default" style={[styles.consentText, { color: textColor }]}>
                                Marketing Communications
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Data Usage */}
                <View style={[styles.section, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                        How We Use Your Data
                    </ThemedText>

                    <View style={styles.usageItem}>
                        <View style={[styles.usageIcon, { backgroundColor: primaryColor + '20' }]}>
                            <Ionicons name="location-outline" size={24} color={primaryColor} />
                        </View>
                        <View style={styles.usageContent}>
                            <ThemedText type="default" style={[styles.usageTitle, { color: textColor }]}>
                                Personalized Recommendations
                            </ThemedText>
                            <ThemedText type="default" style={[styles.usageDescription, { color: mutedColor }]}>
                                Based on your location and preferences to show relevant places and events.
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.usageItem}>
                        <View style={[styles.usageIcon, { backgroundColor: primaryColor + '20' }]}>
                            <Ionicons name="shield-checkmark-outline" size={24} color={primaryColor} />
                        </View>
                        <View style={styles.usageContent}>
                            <ThemedText type="default" style={[styles.usageTitle, { color: textColor }]}>
                                Security & Safety
                            </ThemedText>
                            <ThemedText type="default" style={[styles.usageDescription, { color: mutedColor }]}>
                                To ensure your account security and provide emergency services when needed.
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.usageItem}>
                        <View style={[styles.usageIcon, { backgroundColor: primaryColor + '20' }]}>
                            <Ionicons name="trending-up-outline" size={24} color={primaryColor} />
                        </View>
                        <View style={styles.usageContent}>
                            <ThemedText type="default" style={[styles.usageTitle, { color: textColor }]}>
                                Service Improvement
                            </ThemedText>
                            <ThemedText type="default" style={[styles.usageDescription, { color: mutedColor }]}>
                                To analyze usage patterns and improve our app features and performance.
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Contact Info */}
                <View style={[styles.contactSection, { borderBottomColor: mutedColor + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.contactTitle, { color: textColor }]}>
                        Have specific questions?
                    </ThemedText>
                    <TouchableOpacity
                        style={[styles.contactButton, {
                            backgroundColor: primaryColor + '20',
                            borderColor: primaryColor
                        }]}
                        onPress={() => router.push('/(public)/support/help' as any)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="person-outline" size={20} color={primaryColor} />
                        <ThemedText type="default" style={[styles.contactButtonText, { color: primaryColor }]}>
                            Contact our Data Officer
                        </ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Accept Button */}
                <TouchableOpacity
                    style={[styles.acceptButton, { backgroundColor: primaryColor }]}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <ThemedText type="default" style={styles.acceptButtonText}>
                        I Understand
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
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    dateText: {
        fontSize: 14,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    brand: {
        fontWeight: 'bold',
    },
    subSection: {
        marginTop: 20,
    },
    subSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subSectionDescription: {
        fontSize: 16,
        lineHeight: 24,
    },
    consentList: {
        marginTop: 20,
    },
    consentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    consentText: {
        fontSize: 16,
        marginLeft: 12,
    },
    usageItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    usageIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    usageContent: {
        flex: 1,
    },
    usageTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    usageDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    contactSection: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    contactTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    contactButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    acceptButton: {
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
