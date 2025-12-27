
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

export default function MapScreen() {
    const card = useThemeColor({}, 'card');

    return (
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <View style={[styles.card, { backgroundColor: card }]}>
                <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 12 }}>
                    Map Not Available
                </ThemedText>
                <ThemedText type="default" style={{ textAlign: 'center' }}>
                    The interactions map is only available on iOS and Android devices.
                </ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 24,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        maxWidth: 400
    }
});
