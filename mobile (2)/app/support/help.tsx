import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Stack } from 'expo-router/stack';
import { StyleSheet } from 'react-native';

export default function HelpSupportScreen() {
    const bg = useThemeColor({}, 'bg');

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <Stack.Screen options={{ title: 'Help & Support' }} />
            <ThemedText type="title">Help Center</ThemedText>
            <ThemedText style={styles.content}>
                Welcome to Explore Adama support. If you have any questions or need assistance, please contact us at support@exploreadama.com.
            </ThemedText>
            <ThemedText type="subtitle" style={styles.sectionHeader}>FAQ</ThemedText>
            <ThemedText style={styles.content}>
                1. How do I book a place?
                Browse places, select one, and click &apos;Book Now&apos;.
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        marginTop: 10,
        lineHeight: 24,
    },
    sectionHeader: {
        marginTop: 20,
    }
});
