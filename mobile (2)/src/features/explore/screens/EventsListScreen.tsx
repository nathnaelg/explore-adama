import { ThemedText } from '@/src/components/themed/ThemedText';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { EventsListSkeleton } from '@/src/features/booking/components/EventsListSkeleton';
import { bookingService } from '@/src/features/booking/services/booking.service';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EventsListScreen() {
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();
    const bg = useThemeColor({}, 'bg');
    const text = useThemeColor({}, 'text');
    const card = useThemeColor({}, 'card');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const { isAuthenticated } = useAuth();

    const { data, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['events', 'list'],
        queryFn: () => bookingService.listEvents(),
    });

    const events = data?.data || [];

    if (isLoading) {
        return <EventsListSkeleton />;
    }

    return (
        <View style={[styles.container, { backgroundColor: bg, paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={[styles.backBtn, { backgroundColor: card }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={text} />
                </TouchableOpacity>
                <ThemedText type="subtitle" style={styles.headerTitle}>{t('home.happeningSoon')}</ThemedText>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={{ color: muted }}>{t('common.noEventsFound') || "No events found"}</ThemedText>
                    </View>
                }
                renderItem={({ item }) => {
                    const date = item.date ? new Date(item.date) : new Date();
                    const day = date.getDate();
                    const month = date.toLocaleDateString(i18n.language === 'am' ? 'am-ET' : i18n.language === 'om' ? 'om-ET' : 'en-US', { month: 'short' }).toUpperCase();
                    // Fallback to place address if available (populated), otherwise generic.
                    const location = item.place?.address || item.place?.name || 'Adama';

                    return (
                        <TouchableOpacity
                            style={[styles.card, { backgroundColor: card }]}
                            onPress={() => {
                                if (!isAuthenticated) {
                                    router.push('/(auth)/login');
                                    return;
                                }
                                router.push({ pathname: '/bookings/new', params: { eventId: item.id } } as any);
                            }}
                        >
                            <View style={[styles.dateBadge, { backgroundColor: primary }]}>
                                <ThemedText style={styles.dateDay}>{day}</ThemedText>
                                <ThemedText style={styles.dateMonth}>{month}</ThemedText>
                            </View>
                            <View style={styles.content}>
                                <ThemedText style={[styles.eventTitle, { color: text }]} numberOfLines={2}>{item.title}</ThemedText>
                                <ThemedText style={[styles.eventLocation, { color: muted }]} numberOfLines={1}>{location}</ThemedText>
                                <ThemedText style={[styles.eventPrice, { color: primary }]}>
                                    {item.price ? `${item.price} ETB` : t('common.free') || 'Free'}
                                </ThemedText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={muted} />
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    list: {
        padding: 20,
        gap: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    card: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    dateBadge: {
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 55,
    },
    dateDay: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    dateMonth: {
        fontSize: 10,
        fontWeight: '600',
        color: 'white',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    eventTitle: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 22,
    },
    eventLocation: {
        fontSize: 13,
    },
    eventPrice: {
        fontWeight: '600',
        fontSize: 14,
        marginTop: 4,
    },
});
