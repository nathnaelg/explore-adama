import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EmergencyServicesScreen() {
    const emergencyContacts = [
        {
            id: 1,
            name: 'Police',
            number: '911',
            description: 'Emergency police response',
            icon: 'shield-outline',
            color: '#007AFF',
        },
        {
            id: 2,
            name: 'Ambulance',
            number: '907',
            description: 'Medical emergencies',
            icon: 'medical-outline',
            color: '#FF3B30',
        },
        {
            id: 3,
            name: 'Fire Department',
            number: '939',
            description: 'Fire emergencies',
            icon: 'flame-outline',
            color: '#FF9500',
        },
        {
            id: 4,
            name: 'Tourist Police',
            number: '+251 911 223 344',
            description: 'Tourist assistance',
            icon: 'person-outline',
            color: '#4CAF50',
        },
    ];

    const importantContacts = [
        {
            id: 1,
            name: 'Adama Hospital',
            number: '+251 22 111 2345',
            type: 'Hospital',
            icon: 'medkit-outline',
        },
        {
            id: 2,
            name: 'Tourism Office',
            number: '+251 22 111 5678',
            type: 'Government',
            icon: 'business-outline',
        },
        {
            id: 3,
            name: 'US Embassy',
            number: '+251 11 130 6000',
            type: 'Embassy',
            icon: 'flag-outline',
        },
        {
            id: 4,
            name: 'Taxi Service',
            number: '+251 911 987 654',
            type: 'Transport',
            icon: 'car-outline',
        },
    ];

    const emergencyProcedures = [
        {
            id: 1,
            title: 'Medical Emergency',
            steps: [
                'Call ambulance (907)',
                'Provide location details',
                'Stay with the person',
                'Follow operator instructions',
            ],
        },
        {
            id: 2,
            title: 'Lost or Stolen Items',
            steps: [
                'Contact tourist police',
                'File a police report',
                'Contact your embassy',
                'Cancel credit cards if stolen',
            ],
        },
        {
            id: 3,
            title: 'Natural Disasters',
            steps: [
                'Follow local authorities',
                'Move to safe location',
                'Stay informed via radio',
                'Contact embassy if needed',
            ],
        },
    ];

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleSOS = () => {
        // In a real app, this would trigger emergency protocols
        handleCall('911');
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#666" />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Emergency Services
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Warning Banner */}
                <View style={styles.warningBanner}>
                    <Ionicons name="warning-outline" size={24} color="#FF9500" />
                    <ThemedText type="default" style={styles.warningText}>
                        For immediate life-threatening emergencies, call 911
                    </ThemedText>
                </View>

                {/* SOS Button */}
                <TouchableOpacity
                    style={styles.sosButton}
                    onPress={handleSOS}
                >
                    <View style={styles.sosButtonInner}>
                        <Ionicons name="alert-circle" size={48} color="white" />
                        <ThemedText type="title" style={styles.sosButtonText}>
                            SOS Emergency
                        </ThemedText>
                        <ThemedText type="default" style={styles.sosButtonDescription}>
                            Tap for immediate help
                        </ThemedText>
                    </View>
                </TouchableOpacity>

                {/* Emergency Contacts */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Emergency Contacts
                    </ThemedText>

                    <View style={styles.emergencyGrid}>
                        {emergencyContacts.map((contact) => (
                            <TouchableOpacity
                                key={contact.id}
                                style={[styles.emergencyCard, { borderColor: contact.color }]}
                                onPress={() => handleCall(contact.number)}
                            >
                                <View style={[styles.emergencyIcon, { backgroundColor: `${contact.color}20` }]}>
                                    <Ionicons name={contact.icon as any} size={32} color={contact.color} />
                                </View>
                                <ThemedText type="default" style={styles.emergencyName}>
                                    {contact.name}
                                </ThemedText>
                                <ThemedText type="title" style={[styles.emergencyNumber, { color: contact.color }]}>
                                    {contact.number}
                                </ThemedText>
                                <ThemedText type="default" style={styles.emergencyDescription}>
                                    {contact.description}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Important Contacts */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Important Contacts
                    </ThemedText>

                    <View style={styles.contactsList}>
                        {importantContacts.map((contact) => (
                            <TouchableOpacity
                                key={contact.id}
                                style={styles.contactCard}
                                onPress={() => handleCall(contact.number)}
                            >
                                <View style={styles.contactLeft}>
                                    <View style={styles.contactIcon}>
                                        <Ionicons name={contact.icon as any} size={24} color="#666" />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <ThemedText type="default" style={styles.contactName}>
                                            {contact.name}
                                        </ThemedText>
                                        <ThemedText type="default" style={styles.contactType}>
                                            {contact.type}
                                        </ThemedText>
                                    </View>
                                </View>
                                <View style={styles.contactRight}>
                                    <ThemedText type="default" style={styles.contactNumber}>
                                        {contact.number}
                                    </ThemedText>
                                    <Ionicons name="call-outline" size={20} color="#007AFF" />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Emergency Procedures */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Emergency Procedures
                    </ThemedText>

                    <View style={styles.proceduresList}>
                        {emergencyProcedures.map((procedure) => (
                            <View key={procedure.id} style={styles.procedureCard}>
                                <ThemedText type="default" style={styles.procedureTitle}>
                                    {procedure.title}
                                </ThemedText>
                                <View style={styles.procedureSteps}>
                                    {procedure.steps.map((step, index) => (
                                        <View key={index} style={styles.stepItem}>
                                            <View style={styles.stepNumber}>
                                                <ThemedText type="default" style={styles.stepNumberText}>
                                                    {index + 1}
                                                </ThemedText>
                                            </View>
                                            <ThemedText type="default" style={styles.stepText}>
                                                {step}
                                            </ThemedText>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Safety Tips */}
                <View style={styles.safetyTips}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
                    <View style={styles.safetyTipsTexts}>
                        <ThemedText type="default" style={styles.safetyTipsTitle}>
                            Safety Tips
                        </ThemedText>
                        <ThemedText type="default" style={styles.safetyTipsText}>
                            • Keep emergency numbers saved{'\n'}
                            • Share your location with trusted contacts{'\n'}
                            • Know the address of your accommodation{'\n'}
                            • Keep copies of important documents
                        </ThemedText>
                    </View>
                </View>

                {/* Share Location */}
                <TouchableOpacity style={styles.shareLocationButton}>
                    <Ionicons name="location-outline" size={20} color="#007AFF" />
                    <ThemedText type="default" style={styles.shareLocationText}>
                        Share My Location with Emergency Contacts
                    </ThemedText>
                </TouchableOpacity>
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
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E6',
        paddingHorizontal: 20,
        paddingVertical: 16,
        gap: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
        color: '#FF9500',
        fontWeight: '500',
    },
    sosButton: {
        backgroundColor: '#FF3B30',
        marginHorizontal: 20,
        marginVertical: 24,
        borderRadius: 16,
        overflow: 'hidden',
    },
    sosButtonInner: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    sosButtonText: {
        color: 'white',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    sosButtonDescription: {
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emergencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    emergencyCard: {
        width: '48%',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    emergencyIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emergencyName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emergencyNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emergencyDescription: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    contactsList: {
        gap: 12,
    },
    contactCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    contactLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    contactIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    contactType: {
        fontSize: 12,
        color: '#666',
    },
    contactRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactNumber: {
        fontSize: 14,
        fontWeight: '500',
    },
    proceduresList: {
        gap: 16,
    },
    procedureCard: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    procedureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    procedureSteps: {
        gap: 12,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    stepNumber: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    safetyTips: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 24,
        backgroundColor: '#F0F8FF',
        marginHorizontal: 20,
        marginVertical: 24,
        borderRadius: 12,
        gap: 12,
    },
    safetyTipsTexts: {
        flex: 1,
    },
    safetyTipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    safetyTipsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    shareLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F0F8FF',
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    shareLocationText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
