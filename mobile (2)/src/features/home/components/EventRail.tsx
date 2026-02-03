
import { ThemedText } from '@/src/components/themed/ThemedText';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface EventRailProps {
    events: any[];
}

export function EventRail({ events }: EventRailProps) {
    const { t, i18n } = useTranslation();
    const { isAuthenticated } = useAuth();
    const text = useThemeColor({}, 'text');
    const primary = useThemeColor({}, 'primary');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');

    if (!events || events.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="subtitle" style={styles.title}>{t('home.happeningSoon')}</ThemedText>
                <TouchableOpacity onPress={() => router.push('/events')}>
                    <ThemedText style={{ color: primary, fontWeight: '600' }}>{t('common.seeAll')}</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
                {events.map((event) => {
                    const date = event.date ? new Date(event.date) : new Date();
                    const day = date.getDate();
                    const month = date.toLocaleDateString(i18n.language === 'am' ? 'am-ET' : i18n.language === 'om' ? 'om-ET' : 'en-US', { month: 'short' }).toUpperCase();
                    // Fallback to place address if available (populated), otherwise generic.
                    const location = event.place?.address || event.place?.name || 'Adama';

                    return (
                        <TouchableOpacity
                            key={event.id}
                            style={[styles.card, { backgroundColor: card, borderColor: muted + '40' }]}
                            onPress={() => {
                                if (!isAuthenticated) {
                                    router.push('/(auth)/login');
                                    return;
                                }
                                router.push({ pathname: '/bookings/new', params: { eventId: event.id } } as any);
                            }}
                        >
                            <View style={[styles.dateBadge, { backgroundColor: primary }]}>
                                <ThemedText style={styles.dateDay}>{day}</ThemedText>
                                <ThemedText style={styles.dateMonth}>{month}</ThemedText>
                            </View>
                            <View style={styles.content}>
                                <ThemedText style={[styles.eventTitle, { color: text }]} numberOfLines={2}>{event.title}</ThemedText>
                                <ThemedText style={[styles.eventLocation, { color: muted }]} numberOfLines={1}>{location}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    list: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 240,
        height: 100,
        // backgroundColor set in render
        borderRadius: 20,
        padding: 16,
        marginTop: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderWidth: 1,
        // borderColor set in render
    },
    dateBadge: {
        // backgroundColor set in render
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 50,
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
        fontSize: 15,
        lineHeight: 20,
    },
    eventLocation: {
        fontSize: 12,
    },
});
