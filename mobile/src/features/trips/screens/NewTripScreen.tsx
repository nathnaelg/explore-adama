
import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function NewTripScreen() {
    const [trip, setTrip] = useState({
        name: '',
        destination: 'Adama',
        startDate: '',
        endDate: '',
        travelers: 2,
        budget: 50000,
    });

    const [selectedPlaces, setSelectedPlaces] = useState<number[]>([]);
    const { isGuest } = useAuth();

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const tint = useThemeColor({}, 'tint');
    const success = useThemeColor({}, 'success');

    const suggestedPlaces = [
        {
            id: 1,
            name: 'Kuriftu Resort & Spa',
            type: 'Hotel',
            price: '$120 /night',
            rating: 4.8,
        },
        {
            id: 2,
            name: 'Sodere Hot Springs',
            type: 'Attraction',
            price: '$45 /entry',
            rating: 4.5,
        },
        {
            id: 3,
            name: 'Traditional Coffee Ceremony',
            type: 'Experience',
            price: '$25 /person',
            rating: 4.7,
        },
        {
            id: 4,
            name: 'Rift Valley Viewpoint',
            type: 'Scenic Spot',
            price: 'Free',
            rating: 4.6,
        },
        {
            id: 5,
            name: 'Local Market Tour',
            type: 'Shopping',
            price: '$35 /person',
            rating: 4.4,
        },
    ];

    const budgetOptions = [
        { id: 1, label: 'Budget', value: 20000, icon: 'cash-outline' },
        { id: 2, label: 'Mid-range', value: 50000, icon: 'wallet-outline' },
        { id: 3, label: 'Luxury', value: 100000, icon: 'diamond-outline' },
    ];

    const travelerOptions = [1, 2, 3, 4, 5, 6];

    const togglePlace = (id: number) => {
        if (selectedPlaces.includes(id)) {
            setSelectedPlaces(selectedPlaces.filter(placeId => placeId !== id));
        } else {
            setSelectedPlaces([...selectedPlaces, id]);
        }
    };

    const calculateEstimatedCost = () => {
        let total = 0;
        selectedPlaces.forEach(placeId => {
            const place = suggestedPlaces.find(p => p.id === placeId);
            if (place) {
                const price = parseInt(place.price.replace(/[^0-9]/g, ''));
                total += price * trip.travelers;
            }
        });
        return total;
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
                        Plan New Trip
                    </ThemedText>
                    <View style={{ width: 24 }} />
                </View>

                {/* Trip Details Form */}
                <View style={[styles.section, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={styles.sectionTitle}>
                        Trip Details
                    </ThemedText>

                    {/* Trip Name */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                            Trip Name
                        </ThemedText>
                        <TextInput
                            style={[styles.input, { backgroundColor: card, color: text }]}
                            placeholder="e.g., Adama Family Vacation"
                            placeholderTextColor={muted}
                            value={trip.name}
                            onChangeText={(text) => setTrip({ ...trip, name: text })}
                        />
                    </View>

                    {/* Destination */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                            Destination
                        </ThemedText>
                        <View style={[styles.destinationSelector, { backgroundColor: card }]}>
                            <Ionicons name="location-outline" size={20} color={primary} />
                            <ThemedText type="default" style={styles.destinationText}>
                                {trip.destination}
                            </ThemedText>
                        </View>
                    </View>

                    {/* Dates */}
                    <View style={styles.row}>
                        <View style={[styles.inputContainer, styles.halfInput]}>
                            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                                Start Date
                            </ThemedText>
                            <TouchableOpacity style={[styles.dateInput, { backgroundColor: card }]}>
                                <Ionicons name="calendar-outline" size={20} color={muted} />
                                <ThemedText type="default" style={[styles.dateText, { color: text }]}>
                                    {trip.startDate || 'Select date'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.inputContainer, styles.halfInput]}>
                            <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                                End Date
                            </ThemedText>
                            <TouchableOpacity style={[styles.dateInput, { backgroundColor: card }]}>
                                <Ionicons name="calendar-outline" size={20} color={muted} />
                                <ThemedText type="default" style={[styles.dateText, { color: text }]}>
                                    {trip.endDate || 'Select date'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Travelers */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                            Number of Travelers
                        </ThemedText>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.travelerOptions}
                        >
                            {travelerOptions.map((count) => (
                                <TouchableOpacity
                                    key={count}
                                    style={[
                                        styles.travelerOption,
                                        { backgroundColor: card },
                                        trip.travelers === count && { backgroundColor: `${primary}20`, borderColor: primary, borderWidth: 1 },
                                    ]}
                                    onPress={() => setTrip({ ...trip, travelers: count })}
                                >
                                    <Ionicons
                                        name="person"
                                        size={20}
                                        color={trip.travelers === count ? primary : muted}
                                    />
                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.travelerCount,
                                            { color: muted },
                                            trip.travelers === count && { color: primary, fontWeight: '600' },
                                        ]}
                                    >
                                        {count}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Budget */}
                    <View style={styles.inputContainer}>
                        <ThemedText type="default" style={[styles.inputLabel, { color: muted }]}>
                            Budget Range
                        </ThemedText>
                        <View style={styles.budgetOptions}>
                            {budgetOptions.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.budgetOption,
                                        { backgroundColor: card },
                                        trip.budget === option.value && { backgroundColor: `${primary}20`, borderColor: primary },
                                    ]}
                                    onPress={() => setTrip({ ...trip, budget: option.value })}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={24}
                                        color={trip.budget === option.value ? primary : muted}
                                    />
                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.budgetLabel,
                                            { color: muted },
                                            trip.budget === option.value && { color: primary, fontWeight: '600' },
                                        ]}
                                    >
                                        {option.label}
                                    </ThemedText>
                                    <ThemedText
                                        type="default"
                                        style={[
                                            styles.budgetValue,
                                            trip.budget === option.value && { color: primary },
                                        ]}
                                    >
                                        ETB {option.value.toLocaleString()}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Suggested Places */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText type="subtitle" style={styles.sectionTitle}>
                            Suggested Places
                        </ThemedText>
                        <ThemedText type="default" style={[styles.selectedCount, { color: primary }]}>
                            {selectedPlaces.length} selected
                        </ThemedText>
                    </View>

                    <FlatList
                        data={suggestedPlaces}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.placeOption,
                                    { backgroundColor: card },
                                    selectedPlaces.includes(item.id) && { backgroundColor: `${primary}10`, borderColor: primary },
                                ]}
                                onPress={() => togglePlace(item.id)}
                            >
                                <View style={styles.placeInfo}>
                                    <ThemedText type="default" style={styles.placeName}>
                                        {item.name}
                                    </ThemedText>
                                    <View style={styles.placeDetails}>
                                        <ThemedText type="default" style={[styles.placeType, { color: muted }]}>
                                            {item.type}
                                        </ThemedText>
                                        <View style={styles.ratingContainer}>
                                            <Ionicons name="star" size={14} color={primary} />
                                            <ThemedText type="default" style={styles.rating}>
                                                {item.rating}
                                            </ThemedText>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.placeRight}>
                                    <ThemedText type="default" style={[styles.placePrice, { color: primary }]}>
                                        {item.price}
                                    </ThemedText>
                                    {selectedPlaces.includes(item.id) ? (
                                        <Ionicons name="checkmark-circle" size={24} color={success} />
                                    ) : (
                                        <Ionicons name="add-circle-outline" size={24} color={muted} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id.toString()}
                        scrollEnabled={false}
                    />
                </View>

                {/* Cost Summary */}
                <View style={styles.summarySection}>
                    <ThemedText type="subtitle" style={styles.summaryTitle}>
                        Cost Summary
                    </ThemedText>

                    <View style={styles.summaryRow}>
                        <ThemedText type="default" style={[styles.summaryLabel, { color: muted }]}>
                            Selected Places
                        </ThemedText>
                        <ThemedText type="default" style={styles.summaryValue}>
                            ${calculateEstimatedCost()}
                        </ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText type="default" style={[styles.summaryLabel, { color: muted }]}>
                            Accommodation (est.)
                        </ThemedText>
                        <ThemedText type="default" style={styles.summaryValue}>
                            $240
                        </ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText type="default" style={[styles.summaryLabel, { color: muted }]}>
                            Food & Transportation
                        </ThemedText>
                        <ThemedText type="default" style={styles.summaryValue}>
                            $180
                        </ThemedText>
                    </View>

                    <View style={[styles.divider, { backgroundColor: muted }]} />

                    <View style={styles.totalRow}>
                        <ThemedText type="title" style={styles.totalLabel}>
                            Estimated Total
                        </ThemedText>
                        <ThemedText type="title" style={[styles.totalValue, { color: primary }]}>
                            ${calculateEstimatedCost() + 240 + 180}
                        </ThemedText>
                    </View>

                    <ThemedText type="default" style={[styles.budgetNote, { color: success }]}>
                        Within your budget of ETB {trip.budget.toLocaleString()}
                    </ThemedText>
                </View>

                {/* Create Trip Button */}
                <TouchableOpacity
                    style={[
                        styles.createButton,
                        { backgroundColor: primary },
                        (!trip.name || !trip.startDate || !trip.endDate) && { backgroundColor: muted, opacity: 0.5 },
                    ]}
                    onPress={() => {
                        if (isGuest) {
                            router.push({
                                pathname: '/(modals)/guest-prompt',
                                params: {
                                    title: 'Sign In Required',
                                    message: 'Save and manage your travel plans by signing in to your account.',
                                    icon: 'rocket-outline'
                                }
                            });
                            return;
                        }
                        // Original creation logic here
                    }}
                    disabled={(!trip.name || !trip.startDate || !trip.endDate) && !isGuest}
                >
                    <Ionicons name="rocket-outline" size={20} color="white" />
                    <ThemedText type="default" style={styles.createButtonText}>
                        Create Trip Plan
                    </ThemedText>
                </TouchableOpacity>
            </ScrollView>


        </ThemedView >
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
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    halfInput: {
        flex: 1,
    },
    destinationSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    destinationText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    dateText: {
        fontSize: 16,
    },
    travelerOptions: {
        gap: 12,
    },
    travelerOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    travelerCount: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    budgetOptions: {
        gap: 12,
    },
    budgetOption: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    budgetLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    budgetValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    selectedCount: {
        fontSize: 14,
        fontWeight: '500',
    },
    placeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    placeInfo: {
        flex: 1,
    },
    placeName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    placeDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    placeType: {
        fontSize: 14,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '500',
    },
    placeRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    placePrice: {
        fontSize: 14,
        fontWeight: '500',
    },
    summarySection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    budgetNote: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 8,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 20,
        marginVertical: 32,
        paddingVertical: 18,
        borderRadius: 12,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
