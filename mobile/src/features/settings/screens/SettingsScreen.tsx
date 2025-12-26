import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useProfile } from '@/src/features/profile/hooks/useProfile';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
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
                title: 'Privacy Policy',
                icon: 'shield-checkmark-outline',
                screen: '/(public)/legal/privacy',
            },
            {
                id: 2,
                title: 'Terms of Service',
                icon: 'document-text-outline',
                screen: '/(public)/legal/terms',
            },
            {
                id: 3,
                title: 'AI Transparency',
                icon: 'information-circle-outline',
                screen: '/(public)/legal/ai-transparency',
            },
            {
                id: 4,
                title: 'App Version',
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
        return (
            <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={primary} />
            </ThemedView>
        );
    }

    const handleSeedData = async () => {
        try {
            // Seed 3 Places
            const places = [
                {
                    name: "Kuriftu Resort & Spa Adama",
                    description: "Luxury resort with water park and spa.",
                    latitude: 8.5414,
                    longitude: 39.2689,
                    address: "Adama, Ethiopia",
                },
                {
                    name: "Sodere Resort",
                    description: "Famous for its natural hot springs and lush greenery.",
                    latitude: 8.4000,
                    longitude: 39.5167,
                    address: "Sodere, Ethiopia",
                },
                {
                    name: "Adama City Park",
                    description: "A beautiful park in the heart of Adama.",
                    latitude: 8.5500,
                    longitude: 39.2700,
                    address: "Kebele 04, Adama",
                }
            ];

            // Use exploreService to create them
            // We need to import exploreService at top (will add import in next step or use require if lazy)
            // Ideally should use proper import. For now, assuming direct usage or quick import fix.
            const { exploreService } = require('@/src/features/explore/services/explore.service');

            for (const place of places) {
                await exploreService.createPlace(place);
            }

            alert('Database seeded with 3 places! Refresh Home Screen.');
        } catch (error) {
            console.error('Seeding failed:', error);
            alert('Failed to seed: ' + (error as any).message);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={[styles.title, { color: text }]}>
                        Settings
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
                        PREFERENCES
                    </ThemedText>

                    {/* Language */}
                    <TouchableOpacity style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            Language
                        </ThemedText>
                        <View style={styles.settingValue}>
                            <ThemedText type="default" style={[styles.settingValueText, { color: muted }]}>
                                {user?.profile?.locale === 'am' ? 'Amharic' :
                                    user?.profile?.locale === 'om' ? 'Afan Oromo' : 'English'}
                            </ThemedText>
                            <Ionicons name="chevron-forward" size={20} color={muted} />
                        </View>
                    </TouchableOpacity>

                    {/* Country */}
                    <TouchableOpacity style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            Country
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
                        NOTIFICATIONS
                    </ThemedText>

                    <View style={styles.settingItem}>
                        <ThemedText type="default" style={[styles.settingLabel, { color: text }]}>
                            Booking Updates
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
                            Promotions & Offers
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
                            Nearby Attractions
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
                        SUPPORT & LEGAL
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

                {/* DEBUG: SEED DATA BUTTON */}
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: '#E0F2FE', marginBottom: 0 }]}
                    onPress={handleSeedData}
                >
                    <Ionicons name="construct" size={20} color="#0284C7" />
                    <ThemedText type="default" style={[styles.logoutText, { color: '#0284C7' }]}>
                        Seed Demo Data
                    </ThemedText>
                </TouchableOpacity>

                {/* Log Out */}
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: error + '15' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color={error} />
                    <ThemedText type="default" style={[styles.logoutText, { color: error }]}>
                        Log Out
                    </ThemedText>
                </TouchableOpacity>

                {/* App Version */}
                <View style={styles.versionContainer}>
                    <ThemedText type="default" style={[styles.versionText, { color: muted }]}>
                        Adama Smart Tourism v2.4.0
                    </ThemedText>
                    <ThemedText type="default" style={[styles.copyrightText, { color: muted }]}>
                        Made with ❤️ for Adama
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
