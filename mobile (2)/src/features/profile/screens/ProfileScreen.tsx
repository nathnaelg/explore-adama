
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Update this import to use the consolidated hook
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useNotificationStats } from '@/src/features/notifications/hooks/useNotifications';
import { ProfileSkeleton } from '@/src/features/profile/components/ProfileSkeleton';
import { useProfile, useUserStats } from '@/src/features/profile/hooks/useProfile';

/* ================= COMPONENTS ================= */
function Section({ title }: { title: string }) {
    return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Card({ children }: any) {
    const card = useThemeColor({}, 'card');
    return <View style={[styles.card, { backgroundColor: card }]}>{children}</View>;
}

function Divider() {
    const chip = useThemeColor({}, 'chip');
    return <View style={[styles.divider, { backgroundColor: chip }]} />;
}

function MenuItem({
    icon,
    title,
    right,
    onPress,
    danger,
}: any) {
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const error = useThemeColor({}, 'error');

    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuLeft}>
                <Ionicons
                    name={icon}
                    size={22}
                    color={danger ? error : primary}
                />
                <Text
                    style={[
                        styles.menuText,
                        { color: danger ? error : text },
                    ]}
                >
                    {title}
                </Text>
            </View>

            {right ? (
                <Text style={{ color: muted }}>{right}</Text>
            ) : (
                <Ionicons name="chevron-forward" size={20} color={muted} />
            )}
        </TouchableOpacity>
    );
}

/* ================= MAIN COMPONENT ================= */
export default function ProfileScreen() {
    const { t } = useTranslation();
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const errorColor = useThemeColor({}, 'error');
    const { user: authUser, logout, isAuthenticated } = useAuth();
    const insets = useSafeAreaInsets();
    const [isManualRefreshing, setIsManualRefreshing] = useState(false);

    // Use Auth ID if available, otherwise just rely on AuthContext user.
    // Since backend lacks /users/profile, we must fetch by ID if we want fresh data.
    const { data: user, isLoading: loading, error, refetch: refetchProfile } = useProfile(authUser?.id, isAuthenticated);
    const { data: stats, refetch: refetchStats } = useUserStats();
    const { data: notificationStats, refetch: refetchNotifications } = useNotificationStats();

    const onRefresh = async () => {
        setIsManualRefreshing(true);
        await Promise.all([refetchProfile(), refetchStats(), refetchNotifications()]);
        setIsManualRefreshing(false);
    };

    const unreadCount = notificationStats?.unreadCount || 0;

    const handleLogout = async () => {
        try {
            await logout();
            router.replace('/(auth)/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading && isAuthenticated) {
        return <ProfileSkeleton />;
    }


    if (loading && isAuthenticated) {
        return <ProfileSkeleton />;
    }

    if (!isAuthenticated) {
        return (
            <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person-circle-outline" size={80} color={muted} />
                <Text style={[styles.screenTitle, { color: text, marginBottom: 16 }]}>
                    {t('profile.pleaseLogin')}
                </Text>
                <Text style={{ color: muted, textAlign: 'center', marginHorizontal: 40, marginBottom: 32 }}>
                    {t('profile.needLoginToProfile')}
                </Text>
                <TouchableOpacity
                    style={[styles.editBtn, { borderColor: primary, backgroundColor: primary }]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={[styles.editText, { color: 'white' }]}>{t('auth.login')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Ionicons name="alert-circle-outline" size={60} color={errorColor} />
                <Text style={[styles.screenTitle, { color: text }]}>{t('profile.profileError')}</Text>
                <Text style={{ color: muted, textAlign: 'center', marginBottom: 20 }}>
                    {(error as any)?.response?.data?.message || (error as any)?.message || t('profile.failedLoadProfile')}
                </Text>
                <TouchableOpacity
                    style={[styles.editBtn, { borderColor: primary }]}
                    onPress={() => refetchProfile()}
                >
                    <Text style={[styles.editText, { color: primary }]}>{t('profile.retry')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginTop: 20 }}
                    onPress={handleLogout}
                >
                    <Text style={{ color: muted }}>{t('profile.logoutRetry')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isManualRefreshing} onRefresh={onRefresh} tintColor={primary} />
                }
            >
                {/* ===== HEADER ===== */}
                <Text style={[styles.screenTitle, { color: text, marginTop: insets.top + 20 }]}>
                    {t('common.profile')}
                </Text>

                {/* ===== PROFILE CARD ===== */}
                <View style={[styles.profileCard, { backgroundColor: card }]}>
                    <View style={styles.avatarWrapper}>
                        {user?.profile?.avatar ? (
                            <Image
                                source={{ uri: user.profile.avatar }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: chip }]}>
                                <Ionicons name="person" size={50} color={muted} />
                            </View>
                        )}
                        {user?.role === 'ADMIN' && (
                            <View style={[styles.proBadge, { backgroundColor: primary }]}>
                                <Text style={styles.proText}>{user.role}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={[styles.name, { color: text }]}>
                        {user?.profile?.name || authUser?.email || 'User'}
                    </Text>
                    <Text style={[styles.email, { color: muted }]}>
                        {user?.email || authUser?.email}
                    </Text>

                    {user?.profile?.country && (
                        <View style={[styles.countryBadge, { backgroundColor: chip }]}>
                            <Ionicons name="location-outline" size={14} color={muted} />
                            <Text style={[styles.countryText, { color: muted }]}>{user.profile.country}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.editBtn, { borderColor: primary }]}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <Text style={[styles.editText, { color: primary }]}>{t('profile.editProfile')}</Text>
                    </TouchableOpacity>
                </View>

                {/* ===== STATS ===== */}
                <View style={[styles.statsCard, { backgroundColor: card }]}>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: text }]}>{stats?.bookings || 0}</Text>
                        <Text style={[styles.statLabel, { color: muted }]}>
                            {t('profile.bookings')}
                        </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: text }]}>{stats?.reviews || 0}</Text>
                        <Text style={[styles.statLabel, { color: muted }]}>
                            {t('profile.reviews')}
                        </Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: chip }]} />
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, { color: text }]}>{stats?.favorites || 0}</Text>
                        <Text style={[styles.statLabel, { color: muted }]}>
                            {t('profile.favorites')}
                        </Text>
                    </View>
                </View>

                {/* ===== MY ACTIVITY ===== */}
                <Section title={t('profile.myActivity')} />

                <Card>
                    <MenuItem
                        icon="time-outline"
                        title={t('profile.bookingHistory')}
                        onPress={() => router.push('/bookings/history')}
                    />
                    <Divider />
                    <MenuItem
                        icon="bookmark-outline"
                        title={t('profile.savedPlaces')}
                        onPress={() => router.push('/profile/my-activity')}
                    />
                    <Divider />
                    <MenuItem
                        icon="star-outline"
                        title={t('profile.myReviews')}
                        onPress={() => router.push('/reviews')}
                    />
                </Card>

                {/* ===== SETTINGS ===== */}
                <Section title={t('common.settings').toUpperCase()} />

                <Card>
                    <MenuItem
                        icon="settings-outline"
                        title={t('common.settings')}
                        onPress={() => router.push('/settings')}
                    />
                    <Divider />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        title={t('profile.changePassword')}
                        onPress={() => router.push('/profile/change-password')}
                    />
                    <Divider />
                    <MenuItem
                        icon="notifications-outline"
                        title={t('common.notifications')}
                        right={unreadCount > 0 ? (
                            <View style={[styles.menuBadge, { backgroundColor: primary }]}>
                                <Text style={styles.menuBadgeText}>{unreadCount}</Text>
                            </View>
                        ) : null}
                        onPress={() => router.push('/notifications')}
                    />
                    <Divider />
                    <MenuItem
                        icon="help-circle-outline"
                        title={t('profile.helpSupport')}
                        onPress={() => router.push('/support/help')}
                    />
                    <Divider />
                    <MenuItem
                        icon="document-text-outline"
                        title={t('settings.termsOfService')}
                        onPress={() => router.push('/legal/terms')}
                    />
                    <Divider />
                    <MenuItem
                        icon="log-out-outline"
                        title={t('common.logout')}
                        danger
                        onPress={handleLogout}
                    />
                </Card>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    screenTitle: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },

    profileCard: {
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: 'white',
    },
    placeholderAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
    },

    proBadge: {
        position: 'absolute',
        bottom: 0,
        right: -6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
    },

    proText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 12,
    },

    name: {
        fontSize: 22,
        fontWeight: '700',
        marginTop: 8,
    },

    email: {
        marginTop: 4,
        fontSize: 14,
    },

    editBtn: {
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },

    editText: {
        fontWeight: '600',
    },

    sectionTitle: {
        marginTop: 32,
        marginBottom: 12,
        marginHorizontal: 20,
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1,
    },

    card: {
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },

    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },

    menuText: {
        fontSize: 16,
        fontWeight: '500',
    },

    divider: {
        height: 1,
        marginLeft: 60,
    },

    statsCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },

    statItem: {
        alignItems: 'center',
    },

    statDivider: {
        width: 1,
        height: 40,
    },

    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },

    countryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginTop: 8,
        gap: 4,
    },

    countryText: {
        fontSize: 12,
    },
    menuBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
