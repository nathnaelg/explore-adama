import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Stack } from 'expo-router/stack';
import { ScrollView, StyleSheet } from 'react-native';

export default function TermsScreen() {
    const bg = useThemeColor({}, 'bg');

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <Stack.Screen options={{ title: 'Terms & Conditions' }} />
            <ScrollView contentContainerStyle={styles.scroll}>
                <ThemedText type="title">Terms & Conditions</ThemedText>
                <ThemedText style={styles.content}>
                    Last updated: December 2025
                </ThemedText>
                <ThemedText style={styles.content}>
                    Welcome to Explore Adama. By using our app, you agree to these terms.
                </ThemedText>

                <ThemedText type="subtitle" style={styles.section}>1. Acceptance</ThemedText>
                <ThemedText style={styles.content}>
                    By accessing or using the Service you agree to be bound by these Terms.
                </ThemedText>

                <ThemedText type="subtitle" style={styles.section}>2. Bookings</ThemedText>
                <ThemedText style={styles.content}>
                    All bookings are subject to availability and confirmation.
                </ThemedText>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scroll: {
        padding: 20,
    },
    content: {
        marginTop: 10,
        lineHeight: 24,
    },
    section: {
        marginTop: 20,
        marginBottom: 5,
    }
});
