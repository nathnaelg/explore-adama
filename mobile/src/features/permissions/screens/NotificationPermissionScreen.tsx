import { useThemeColor } from '@/src/hooks/use-theme-color';
import { requestNotificationPermission } from '@/src/services/push.service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationPermissionScreen() {
    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    const enableNotifications = async () => {
        const granted = await requestNotificationPermission();
        router.replace('/notifications');
    };

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <View style={[styles.card, { backgroundColor: card }]}>

                <View style={[styles.iconWrap, { backgroundColor: primary + '20' }]}>
                    <Ionicons name="notifications" size={40} color={primary} />
                    <View style={styles.check}>
                        <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                </View>

                <Text style={[styles.title, { color: text }]}>
                    Don’t miss out on Adama!
                </Text>

                <Text style={[styles.subtitle, { color: muted }]}>
                    Get booking updates, local events, and exclusive offers in real time.
                </Text>

                <Feature icon="calendar-outline" text="Instant booking updates" />
                <Feature icon="pricetag-outline" text="Exclusive deals near you" />

                <TouchableOpacity
                    style={[styles.cta, { backgroundColor: primary }]}
                    onPress={enableNotifications}
                >
                    <Text style={styles.ctaText}>Turn on Notifications</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.replace('/notifications')}>
                    <Text style={[styles.later, { color: muted }]}>Maybe later</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

function Feature({ icon, text }: any) {
    const color = useThemeColor({}, 'text');
    const primary = useThemeColor({}, 'primary');

    return (
        <View style={styles.feature}>
            <Ionicons name={icon} size={18} color={primary} />
            <Text style={{ color, fontWeight: '500' }}>{text}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        borderRadius: 28,
        padding: 28,
        alignItems: 'center',
    },
    iconWrap: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    check: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: '#22C55E',
        borderRadius: 10,
        padding: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    feature: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
        alignItems: 'center',
    },
    cta: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 20,
    },
    ctaText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#000',
    },
    later: {
        marginTop: 16,
        fontSize: 14,
    },
});
