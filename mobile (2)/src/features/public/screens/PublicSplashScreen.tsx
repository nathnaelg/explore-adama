import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Image, StyleSheet, View } from 'react-native';

export default function PublicSplashScreen() {
    // Simplified splash screen - just renders the view
    // The delay is now handled by the native splash screen and _layout.tsx
    // This component might not even be seen if _layout redirects fast enough

    return (
        <ThemedView style={styles.container}>
            {/* App Logo */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* App Title */}
            <View style={styles.content}>
                <ThemedText type="title" style={styles.appTitle}>
                    Adama Smart Tourism
                </ThemedText>
                <ThemedText type="default" style={styles.tagline}>
                    Explore Adama Smarter
                </ThemedText>
            </View>

            {/* Version Info */}
            <View style={styles.footer}>
                <ThemedText type="default" style={styles.version}>
                    v1.0.0
                </ThemedText>
                <ThemedText type="default" style={styles.copyright}>
                    Adama City
                </ThemedText>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    appTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 18,
        color: '#666',
    },
    footer: {
        padding: 32,
        alignItems: 'center',
    },
    version: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    copyright: {
        fontSize: 14,
        color: '#999',
    },
});
