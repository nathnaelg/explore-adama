
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import { useThemeColor } from '@/src/hooks/use-theme-color';

export default function EventBookingScreen() {
    // Note: In Expo Router file-based routing, the bookingId is automatically 
    // available in the route based on the file structure [bookingId]/index.tsx
    // You can access it if needed, but the sample doesn't show it being used

    const [selectedTicket, setSelectedTicket] = useState('standard');
    const [ticketCount, setTicketCount] = useState(2);

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');

    const tickets = [
        {
            id: 'standard',
            name: 'Standard Ticket',
            description: 'Access to main area',
            price: 15,
        },
        {
            id: 'vip',
            name: 'VIP Access',
            description: 'Front row + Free drinks',
            price: 45,
        },
    ];

    const calculateTotal = () => {
        const ticket = tickets.find(t => t.id === selectedTicket);
        return ticket ? ticket.price * ticketCount : 0;
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={text} />
                    </TouchableOpacity>
                    <ThemedText type="title" style={styles.title}>
                        Event Details
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Event Banner */}
                <View style={[styles.banner, { backgroundColor: primary }]}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <ThemedText type="default" style={styles.rating}>
                            4.8 (120 reviews)
                        </ThemedText>
                    </View>
                    <ThemedText type="title" style={styles.eventTitle}>
                        Adama Cultural Festival 2024
                    </ThemedText>
                </View>

                {/* Date & Time */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar-outline" size={20} color={muted} />
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Date & Time
                        </ThemedText>
                    </View>
                    <ThemedText type="default" style={styles.sectionContent}>
                        Sat, 12 Oct • 16:00 PM
                    </ThemedText>
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={20} color={muted} />
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Location
                        </ThemedText>
                    </View>
                    <ThemedText type="default" style={styles.sectionContent}>
                        Adama City Pavillion
                    </ThemedText>
                    <ThemedText type="default" style={[styles.locationDetail, { color: muted }]}>
                        Kebele 04, Adama, Oromia Region
                    </ThemedText>
                </View>

                {/* About Event */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        About Event
                    </ThemedText>
                    <ThemedText type="default" style={[styles.description, { color: muted }]}>
                        Experience the vibrant culture of Adama with live music, traditional food, and art exhibitions. Join thousands of locals and tourists for a night of celebration under the stars. The festival features top regional artists...
                    </ThemedText>
                    <TouchableOpacity>
                        <ThemedText type="link" style={{ color: primary }}>Read More</ThemedText>
                    </TouchableOpacity>
                </View>

                {/* Select Ticket */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Select Ticket
                    </ThemedText>
                    <View style={styles.ticketsContainer}>
                        {tickets.map((ticket) => {
                            const active = selectedTicket === ticket.id;
                            return (
                                <TouchableOpacity
                                    key={ticket.id}
                                    style={[
                                        styles.ticketCard,
                                        { backgroundColor: card, borderColor: active ? primary : 'transparent' },
                                        active && { backgroundColor: `${primary}10` }
                                    ]}
                                    onPress={() => setSelectedTicket(ticket.id)}
                                >
                                    <View style={styles.ticketInfo}>
                                        <ThemedText type="default" style={styles.ticketName}>
                                            {ticket.name}
                                        </ThemedText>
                                        <ThemedText type="default" style={[styles.ticketDescription, { color: muted }]}>
                                            {ticket.description}
                                        </ThemedText>
                                    </View>
                                    <ThemedText type="title" style={[styles.ticketPrice, { color: primary }]}>
                                        ${ticket.price}.00
                                    </ThemedText>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Number of Tickets */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Number of Tickets
                    </ThemedText>
                    <View style={styles.ticketCounter}>
                        <TouchableOpacity
                            style={[styles.counterButton, { backgroundColor: card }]}
                            onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
                        >
                            <Ionicons name="remove" size={20} color={text} />
                        </TouchableOpacity>
                        <ThemedText type="title" style={styles.ticketCount}>
                            {ticketCount}
                        </ThemedText>
                        <TouchableOpacity
                            style={[styles.counterButton, { backgroundColor: card }]}
                            onPress={() => setTicketCount(ticketCount + 1)}
                        >
                            <Ionicons name="add" size={20} color={text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Total Price */}
                <View style={[styles.totalContainer, { backgroundColor: card }]}>
                    <ThemedText type="subtitle" style={[styles.totalLabel, { color: muted }]}>
                        TOTAL PRICE
                    </ThemedText>
                    <ThemedText type="title" style={[styles.totalPrice, { color: primary }]}>
                        ${calculateTotal()}.00 / {ticketCount} tickets
                    </ThemedText>
                </View>

                {/* Pay Now Button */}
                <TouchableOpacity
                    style={[styles.payButton, { backgroundColor: primary }]}
                    onPress={() => router.push('/payment' as any)}
                >
                    <ThemedText type="default" style={styles.payButtonText}>
                        Pay Now →
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
    banner: {
        backgroundColor: '#007AFF',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 16,
        marginBottom: 24,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    rating: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    eventTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionContent: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    locationDetail: {
        color: '#666',
        fontSize: 14,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 12,
    },
    ticketsContainer: {
        gap: 12,
    },
    ticketCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedTicket: {
        backgroundColor: '#F0F8FF',
        borderColor: '#007AFF',
    },
    ticketInfo: {
        flex: 1,
    },
    ticketName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    ticketDescription: {
        color: '#666',
        fontSize: 14,
    },
    ticketPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    ticketCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    counterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticketCount: {
        fontSize: 24,
        fontWeight: 'bold',
        minWidth: 40,
        textAlign: 'center',
    },
    totalContainer: {
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        marginVertical: 24,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    totalLabel: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    totalPrice: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    payButton: {
        backgroundColor: '#007AFF',
        marginHorizontal: 20,
        marginBottom: 40,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
