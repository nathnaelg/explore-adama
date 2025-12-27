import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import am from './locales/am.json';
import en from './locales/en.json';
import om from './locales/om.json';

const resources = {
    en: { translation: en },
    am: { translation: am },
    om: { translation: om },
};

const LANGUAGE_KEY = 'user-language';

const initI18n = async () => {
    // Prevent execution on server/SSR
    if (typeof window === 'undefined') return;

    let savedLanguage = null;
    try {
        savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    } catch (e) {
        console.warn('Failed to load language', e);
    }

    if (!savedLanguage) {
        // Get device locale
        const locales = Localization.getLocales();
        if (locales && locales.length > 0) {
            const deviceLanguage = locales[0].languageCode;
            savedLanguage = resources[deviceLanguage as keyof typeof resources] ? deviceLanguage : 'en';
        } else {
            savedLanguage = 'en';
        }
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage || 'en',
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export default i18n;
