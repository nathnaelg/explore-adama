import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TermsConditionsScreen() {
    const sections = [
        {
            id: 1,
            number: '1.',
            title: 'General Usage Rules',
            content: 'By using Adama Smart Tourism, you agree to use our services for lawful purposes only. You must not violate any applicable laws, infringe on others\' rights, or interfere with the service\'s operation.',
        },
        {
            id: 2,
            number: '2.',
            title: 'Booking & Reservations',
            content: 'All bookings made through our platform are subject to availability and confirmation. We act as an intermediary between you and service providers. Prices may change based on availability and season.',
        },
        {
            id: 3,
            number: '3.',
            title: 'Cancellations & Refunds',
            content: 'Cancellation policies vary by service provider. Refunds are processed according to the provider\'s policy. We recommend reviewing cancellation terms before booking.',
        },
        {
            id: 4,
            number: '4.',
            title: 'User Conduct & Safety',
            content: 'Users must behave respectfully towards other users and service providers. We reserve the right to suspend accounts for inappropriate behavior. Always follow local laws and regulations.',
        },
        {
            id: 5,
            number: '5.',
            title: 'Intellectual Property',
            content: 'All content on the Adama Smart Tourism app, including text, graphics, logos, and software, is our property and protected by copyright laws.',
        },
        {
            id: 6,
            number: '6.',
            title: 'Limitation of Liability',
            content: 'We are not liable for any damages arising from the use of our services, including but not limited to direct, indirect, incidental, or consequential damages.',
        },
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
                        Terms & Conditions
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Last Updated */}
                <View style={styles.updatedContainer}>
                    <ThemedText type="default" style={styles.updatedText}>
                        LAST UPDATED: OCTOBER 24, 2023
                    </ThemedText>
                </View>

                {/* Introduction */}
                <View style={styles.introduction}>
                    <ThemedText type="default" style={styles.introductionText}>
                        Please read these terms carefully before using the Adama Smart Tourism app. By accessing or using the Service you agree to be bound by these Terms and help us keep our community safe.
                    </ThemedText>
                </View>

                {/* Sections */}
                <View style={styles.sectionsContainer}>
                    {sections.map((section) => (
                        <View key={section.id} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <ThemedText type="title" style={styles.sectionNumber}>
                                    {section.number}
                                </ThemedText>
                                <ThemedText type="title" style={styles.sectionTitle}>
                                    {section.title}
                                </ThemedText>
                            </View>
                            <ThemedText type="default" style={styles.sectionContent}>
                                {section.content}
                            </ThemedText>
                        </View>
                    ))}
                </View>

                {/* Agreement */}
                <View style={styles.agreementContainer}>
                    <ThemedText type="default" style={styles.agreementText}>
                        By clicking &quot;Accept & Continue&quot;, you acknowledge that you have read and understood our Privacy Policy.
                    </ThemedText>
                </View>

                {/* Accept Button */}
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => router.back()}
                >
                    <ThemedText type="default" style={styles.acceptButtonText}>
                        Accept & Continue
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
    updatedContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5F5F5',
    },
    updatedText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
    },
    introduction: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    introductionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
    },
    sectionsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#007AFF',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
    },
    agreementContainer: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    agreementText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        textAlign: 'center',
    },
    acceptButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
