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

export default function LanguageSelectionScreen() {
    const [selectedLanguage, setSelectedLanguage] = useState('English');

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');

    const languages = [
        {
            id: 1,
            code: 'en',
            name: 'English',
            nativeName: 'English',
            region: 'International',
        },
        {
            id: 2,
            code: 'am',
            name: 'Amharic',
            nativeName: 'አማርኛ',
            region: 'Ethiopia',
        },
        {
            id: 3,
            code: 'om',
            name: 'Afan Oromo',
            nativeName: 'Afaan Oromoo',
            region: 'Oromia',
        },
        {
            id: 4,
            code: 'so',
            name: 'Somali',
            nativeName: 'Soomaali',
            region: 'Somali Region',
        },
        {
            id: 5,
            code: 'ti',
            name: 'Tigrinya',
            nativeName: 'ትግርኛ',
            region: 'Tigray',
        },
        {
            id: 6,
            code: 'ar',
            name: 'Arabic',
            nativeName: 'العربية',
            region: 'Middle East',
        },
        {
            id: 7,
            code: 'fr',
            name: 'French',
            nativeName: 'Français',
            region: 'International',
        },
    ];

    const handleLanguageSelect = (languageName: string) => {
        setSelectedLanguage(languageName);
        // In a real app, you would save this to async storage and update app language
        setTimeout(() => {
            router.back();
        }, 300);
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Language
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Current Language */}
                <View style={[styles.currentLanguageSection, { borderBottomColor: muted + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.currentLanguageTitle, { color: muted }]}>
                        Current Language
                    </ThemedText>
                    <View style={[styles.currentLanguageCard, { backgroundColor: primary + '15', borderColor: primary }]}>
                        <ThemedText type="title" style={[styles.currentLanguageName, { color: text }]}>
                            {selectedLanguage}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.currentLanguageDescription, { color: muted }]}>
                            All text in the app will be displayed in this language
                        </ThemedText>
                    </View>
                </View>

                {/* Available Languages */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Available Languages
                    </ThemedText>

                    <View style={styles.languagesList}>
                        {languages.map((language) => {
                            const isSelected = selectedLanguage === language.name;
                            return (
                                <TouchableOpacity
                                    key={language.id}
                                    style={[
                                        styles.languageOption,
                                        { backgroundColor: card },
                                        isSelected && { backgroundColor: `${primary}15`, borderColor: primary, borderWidth: 2 },
                                    ]}
                                    onPress={() => handleLanguageSelect(language.name)}
                                >
                                    <View style={styles.languageInfo}>
                                        <View style={styles.languageTexts}>
                                            <ThemedText type="default" style={[styles.languageName, { color: text }]}>
                                                {language.name}
                                            </ThemedText>
                                            <ThemedText type="default" style={[styles.languageNativeName, { color: muted }]}>
                                                {language.nativeName}
                                            </ThemedText>
                                        </View>
                                        <ThemedText type="default" style={[styles.languageRegion, { color: muted }]}>
                                            {language.region}
                                        </ThemedText>
                                    </View>

                                    {isSelected && (
                                        <Ionicons name="checkmark-circle" size={24} color={primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Language Info */}
                <View style={[styles.infoSection, { backgroundColor: `${primary}10` }]}>
                    <Ionicons name="information-circle-outline" size={24} color={primary} />
                    <View style={styles.infoTexts}>
                        <ThemedText type="default" style={styles.infoTitle}>
                            Language Support
                        </ThemedText>
                        <ThemedText type="default" style={[styles.infoDescription, { color: muted }]}>
                            Some features like AI recommendations and local content work best in English and Amharic. Other languages have limited support.
                        </ThemedText>
                    </View>
                </View>

                {/* Contribute Button */}
                <TouchableOpacity style={[styles.contributeButton, { backgroundColor: `${primary}10`, borderColor: primary }]}>
                    <Ionicons name="language-outline" size={20} color={primary} />
                    <ThemedText type="default" style={[styles.contributeButtonText, { color: primary }]}>
                        Help Translate
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
    currentLanguageSection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    currentLanguageTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    currentLanguageCard: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 2,
    },
    currentLanguageName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    currentLanguageDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    languagesList: {
        gap: 12,
    },
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedLanguageOption: {
        // Handled inline for theme access
    },
    languageInfo: {
        flex: 1,
    },
    languageTexts: {
        marginBottom: 4,
    },
    languageName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    languageNativeName: {
        fontSize: 14,
    },
    languageRegion: {
        fontSize: 12,
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 24,
        marginHorizontal: 20,
        marginVertical: 24,
        borderRadius: 12,
        gap: 12,
    },
    infoTexts: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    contributeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    contributeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
