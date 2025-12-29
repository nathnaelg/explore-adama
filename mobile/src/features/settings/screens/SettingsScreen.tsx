import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useProfile } from '@/src/features/profile/hooks/useProfile';
import { SettingsSkeleton } from '@/src/features/settings/components/SettingsSkeleton';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const { user: authUser, logout, isAuthenticated } = useAuth();
    const { data: user, isLoading } = useProfile(authUser?.id, isAuthenticated);
    const insets = useSafeAreaInsets();

    const primary = useThemeColor({}, 'primary');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');
    const bg = useThemeColor({}, 'bg');
    const error = useThemeColor({}, 'error');

    // Local state for notification preferences (would be saved to backend in production)
    const [notifications, setNotifications] = useState({
        bookingUpdates: true,
        promotions: true,
        nearbyAttractions: false,
    });

    const settingsItems: Array<{
        id: number;
        title: string;
        icon: IoniconsName;
        screen: string;
        color?: string;
    }> = [
            {
                id: 1,
                title: t('settings.privacyPolicy'),
                icon: 'shield-checkmark-outline',
                screen: '/(public)/legal/privacy',
            },
            {
                id: 2,
                title: t('settings.termsOfService'),
                icon: 'document-text-outline',
                screen: '/(public)/legal/terms',
            },
            {
                id: 3,
                title: t('settings.aiTransparency'),
                icon: 'information-circle-outline',
                screen: '/(public)/legal/ai-transparency',
            },
            {
                id: 4,
                title: t('settings.appVersion'),
                icon: 'code-outline',
                screen: '/(public)/meta/app-version',
            },
        ];

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return <SettingsSkeleton />;
    }


    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: text }]}>
                        {t('common.settings')}
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Profile Info */}
                <TouchableOpacity
                    style={[styles.profileSection, { borderBottomColor: muted + '20' }]}
                    onPress={() => router.push('/profile/edit')}
                >
                    {user?.profile?.avatar ? (
                        <Image
                            source={{ uri: user.profile.avatar }}
                            style={styles.profileAvatar}
                        />
                    ) : (
                        <View style={[styles.avatar, { backgroundColor: card }]}>
                            <Ionicons name="person" size={28} color={primary} />
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <ThemedText type="title" style={[styles.profileName, { color: text }]}>
                            {user?.profile?.name || authUser?.email || 'User'}
                        </ThemedText>
                        <ThemedText type="default" style={[styles.profileEmail, { color: muted }]}>
                            {user?.email || authUser?.email}
                        </ThemedText>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={muted} />
                </TouchableOpacity>

                {/* Preferences */}
                <View style={[styles.section, { borderBottomColor: muted + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        {t('settings.preferences')}
                    </ThemedText>

                    {/* Language */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => router.push('/settings/language')}
                    >
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            {t('common.language')}
                        </ThemedText>
                        <View style={styles.settingValue}>
                            <ThemedText type="default" style={[styles.settingValueText, { color: muted }]}>
                                {i18n.language === 'am' ? 'Amharic' :
                                    i18n.language === 'om' ? 'Afan Oromo' : 'English'}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={muted} />
                        </View>
                    </TouchableOpacity>

                    {/* Country */}
                    <TouchableOpacity style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            {t('common.country')}
                        </ThemedText>
                        <View style={styles.settingValue}>
                            <ThemedText type="default" style={[styles.settingValueText, { color: muted }]}>
                                {user?.profile?.country || 'Not set'}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={muted} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Notifications */}
                <View style={[styles.section, { borderBottomColor: muted + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        {t('common.notifications')}
                    </ThemedText>

                    <View style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            {t('settings.notifUpdates')}
                        </ThemedText>
                        <Switch
                            value={notifications.bookingUpdates}
                            onValueChange={(value) =>
                                setNotifications({ ...notifications, bookingUpdates: value })
                            }
                            trackColor={{ false: muted + '40', true: primary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            {t('settings.notifPromos')}
                        </ThemedText>
                        <Switch
                            value={notifications.promotions}
                            onValueChange={(value) =>
                                setNotifications({ ...notifications, promotions: value })
                            }
                            trackColor={{ false: muted + '40', true: primary }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            {t('settings.notifNearby')}
                        </ThemedText>
                        <Switch
                            value={notifications.nearbyAttractions}
                            onValueChange={(value) =>
                                setNotifications({ ...notifications, nearbyAttractions: value })
                            }
                            trackColor={{ false: muted + '40', true: primary }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                {/* Support & Legal */}
                <View style={[styles.section, { borderBottomColor: muted + '20' }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        {t('settings.supportLegal')}
                    </ThemedText>

                    {settingsItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.settingItem}
                            onPress={() => router.push(item.screen as any)}
                        >
                            <View style={styles.settingItemLeft}>
                                <Ionicons name={item.icon} size={20} color={primary} />
                                <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                                    {item.title}
                                </ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={muted} />
                        </TouchableOpacity>
                    ))}
                </View>


                {/* Log Out */}
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: error + '15' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color={error} />
                    <ThemedText type="default" style={[styles.logoutText, { color: error }]}>
                        {t('common.logout')}
                    </ThemedText>
                </TouchableOpacity>

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <ThemedText type="default" style={[styles.versionText, { color: muted }]}>
                        Adama Smart Tourism v2.4.0
                    </ThemedText>
                    <ThemedText type="default" style={[styles.copyrightText, { color: muted }]}>
                        {t('settings.madeWithLove')}
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        // paddingTop handled by insets in render
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        gap: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 14,
        marginTop: 4,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 16,
        letterSpacing: 1,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValueText: {
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
    versionContainer: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    versionText: {
        fontSize: 14,
        marginBottom: 8,
    },
    copyrightText: {
        fontSize: 14,
    },
});
