import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

export default function AppVersionScreen() {
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [latestVersion, setLatestVersion] = useState(true);

    const versionInfo = {
        name: 'Adama Smart Tourism',
        version: '1.0.1',
        build: '203'
    };

    const features = [
        'AI-powered recommendations',
        'Offline maps for Adama city',
        'Local payment integration (Chapa, Telebirr)',
        'Enhanced chat assistant',
        'Bug fixes and performance improvements',
    ];

    const legalItems = [
        { id: 1, name: 'Privacy Policy', screen: '/(public)/legal/privacy-policy' },
        { id: 2, name: 'Terms of Service', screen: '/(public)/legal/terms' },
        { id: 3, name: 'Open Source Licenses', screen: '/license' }, // Assuming this exists or will be created
    ];

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#666" />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        App Version
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* App Info */}
                <View style={styles.appInfo}>
                    <View style={styles.appIcon}>
                        <Ionicons name="compass" size={48} color="#007AFF" />
                    </View>
                    <ThemedText type="title" style={styles.appName}>
                        {versionInfo.name}
                    </ThemedText>
                    <ThemedText type="default" style={styles.appVersion}>
                        Version {versionInfo.version} (Build {versionInfo.build})
                    </ThemedText>
                </View>

                {/* Update Status */}
                <View style={styles.updateStatus}>
                    <View style={styles.updateStatusItem}>
                        <Ionicons
                            name={latestVersion ? 'checkmark-circle' : 'alert-circle'}
                            size={24}
                            color={latestVersion ? '#4CAF50' : '#FF9800'}
                        />
                        <ThemedText type="default" style={styles.updateStatusText}>
                            {latestVersion ? 'You have the latest version' : 'Update available'}
                        </ThemedText>
                    </View>
                </View>

                {/* What's New */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.whatsNewHeader}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            What&apos;s New
                        </ThemedText>
                        <Ionicons name="chevron-forward" size={20} color="#666" />
                    </TouchableOpacity>
                    <View style={styles.featuresList}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                                <ThemedText type="default" style={styles.featureText}>
                                    {feature}
                                </ThemedText>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Update Settings */}
                <View style={styles.section}>
                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="refresh-circle-outline" size={24} color="#666" />
                            <ThemedText type="default" style={styles.settingName}>
                                Check for Updates
                            </ThemedText>
                        </View>
                        <Switch
                            value={autoUpdate}
                            onValueChange={setAutoUpdate}
                            trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                        />
                    </View>
                </View>

                {/* Legal */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        LEGAL
                    </ThemedText>
                    <View style={styles.legalList}>
                        {legalItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.legalItem}
                                onPress={() => router.push(item.screen as any)}
                            >
                                <ThemedText type="default" style={styles.legalItemText}>
                                    {item.name}
                                </ThemedText>
                                <Ionicons name="chevron-forward" size={20} color="#666" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <ThemedText type="default" style={styles.copyright}>
                        © 2024 Adama City Administration.
                    </ThemedText>
                    <ThemedText type="default" style={styles.rights}>
                        All rights reserved.
                    </ThemedText>
                </View>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    appInfo: {
        alignItems: 'center',
        paddingVertical: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    appIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    appVersion: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    releaseDate: {
        fontSize: 14,
        color: '#999',
    },
    updateStatus: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    updateStatusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    updateStatusText: {
        fontSize: 16,
        fontWeight: '500',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    whatsNewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingName: {
        fontSize: 16,
        fontWeight: '500',
    },
    legalList: {
        gap: 16,
    },
    legalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    legalItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    copyright: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    rights: {
        fontSize: 14,
        color: '#666',
    },
});
