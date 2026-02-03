import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function FilterSortScreen() {
    const [filters, setFilters] = useState({
        sortBy: 'nearest',
        priceRange: [50, 350],
        categories: {
            hotels: true,
            food: true,
            events: true,
            nature: true,
            shopping: false,
            culture: false,
        },
        maxDistance: 5,
        minRating: 4.0,
    });

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const primary = useThemeColor({}, 'primary');
    const chip = useThemeColor({}, 'chip');
    const tint = useThemeColor({}, 'tint');

    const sortOptions = [
        { id: 'nearest', label: 'Nearest' },
        { id: 'mostPopular', label: 'Most Popular' },
        { id: 'highestRated', label: 'Highest Rated' },
        { id: 'priceLowToHigh', label: 'Price: Low to High' },
        { id: 'priceHighToLow', label: 'Price: High to Low' },
    ];

    const categories = [
        { id: 'hotels', label: 'Hotels', icon: 'bed-outline' },
        { id: 'food', label: 'Food', icon: 'restaurant-outline' },
        { id: 'events', label: 'Events', icon: 'calendar-outline' },
        { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
        { id: 'shopping', label: 'Shopping', icon: 'cart-outline' },
        { id: 'culture', label: 'Culture', icon: 'library-outline' },
    ];

    const resetFilters = () => {
        setFilters({
            sortBy: 'nearest',
            priceRange: [50, 350],
            categories: {
                hotels: true,
                food: true,
                events: true,
                nature: true,
                shopping: false,
                culture: false,
            },
            maxDistance: 5,
            minRating: 4.0,
        });
    };

    const toggleCategory = (categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryId]: !prev.categories[categoryId as keyof typeof prev.categories]
            }
        }));
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor: bg }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: muted }]}>
                <ThemedText type="title" style={styles.title}>
                    Filter & Sort
                </ThemedText>
                <TouchableOpacity onPress={resetFilters}>
                    <ThemedText type="link">Reset</ThemedText>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Sort By */}
                <View style={[styles.section, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        SORT BY
                    </ThemedText>
                    <View style={styles.sortOptions}>
                        {sortOptions.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.sortOption,
                                    { backgroundColor: card },
                                    filters.sortBy === option.id && { backgroundColor: primary },
                                ]}
                                onPress={() => setFilters({ ...filters, sortBy: option.id })}
                            >
                                <ThemedText
                                    type="default"
                                    style={[
                                        styles.sortOptionText,
                                        { color: text },
                                        filters.sortBy === option.id && styles.selectedSortOptionText,
                                    ]}
                                >
                                    {option.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Price Range */}
                <View style={[styles.section, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        PRICE RANGE
                    </ThemedText>
                    <View style={styles.priceRangeContainer}>
                        <ThemedText type="title" style={styles.priceRangeText}>
                            ${filters.priceRange[0]} - ${filters.priceRange[1]}
                        </ThemedText>
                        <View style={styles.priceLabels}>
                            <ThemedText type="default" style={[styles.priceLabel, { color: muted }]}>
                                $0
                            </ThemedText>
                            <ThemedText type="default" style={[styles.priceLabel, { color: muted }]}>
                                $1000+
                            </ThemedText>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={1000}
                            value={filters.priceRange[1]}
                            onValueChange={(value) => setFilters({ ...filters, priceRange: [filters.priceRange[0], value] })}
                            minimumTrackTintColor={primary}
                            maximumTrackTintColor={muted}
                            thumbTintColor={primary}
                        />
                    </View>
                </View>

                {/* Categories */}
                <View style={[styles.section, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        CATEGORIES
                    </ThemedText>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryOption,
                                    { backgroundColor: card },
                                    filters.categories[category.id as keyof typeof filters.categories] && { backgroundColor: `${primary}20`, borderColor: primary, borderWidth: 1 },
                                ]}
                                onPress={() => toggleCategory(category.id)}
                            >
                                <Ionicons
                                    name={category.icon as any}
                                    size={24}
                                    color={filters.categories[category.id as keyof typeof filters.categories] ? primary : muted}
                                />
                                <ThemedText
                                    type="default"
                                    style={[
                                        styles.categoryLabel,
                                        { color: text },
                                        filters.categories[category.id as keyof typeof filters.categories] && { color: primary, fontWeight: '600' },
                                    ]}
                                >
                                    {category.label}
                                </ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Max Distance */}
                <View style={[styles.section, { borderBottomColor: muted }]}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        MAX DISTANCE
                    </ThemedText>
                    <View style={styles.distanceContainer}>
                        <ThemedText type="title" style={styles.distanceText}>
                            Within {filters.maxDistance} km
                        </ThemedText>
                        <Slider
                            style={styles.slider}
                            minimumValue={1}
                            maximumValue={50}
                            value={filters.maxDistance}
                            onValueChange={(value) => setFilters({ ...filters, maxDistance: value })}
                            minimumTrackTintColor={primary}
                            maximumTrackTintColor={muted}
                            thumbTintColor={primary}
                            step={1}
                        />
                        <View style={styles.distanceLabels}>
                            <ThemedText type="default" style={[styles.distanceLabel, { color: muted }]}>
                                1 km
                            </ThemedText>
                            <ThemedText type="default" style={[styles.distanceLabel, { color: muted }]}>
                                50 km
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Rating */}
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={[styles.sectionTitle, { color: muted }]}>
                        RATING
                    </ThemedText>
                    <View style={styles.ratingContainer}>
                        <TouchableOpacity
                            style={[
                                styles.ratingOption,
                                { backgroundColor: card },
                                filters.minRating === 4.0 && { backgroundColor: `${primary}20`, borderColor: primary, borderWidth: 1 },
                            ]}
                            onPress={() => setFilters({ ...filters, minRating: 4.0 })}
                        >
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <ThemedText
                                type="default"
                                style={[
                                    styles.ratingText,
                                    { color: text },
                                    filters.minRating === 4.0 && { color: primary, fontWeight: '600' },
                                ]}
                            >
                                4.0 & up
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.ratingOption,
                                { backgroundColor: card },
                                filters.minRating === 4.5 && { backgroundColor: `${primary}20`, borderColor: primary, borderWidth: 1 },
                            ]}
                            onPress={() => setFilters({ ...filters, minRating: 4.5 })}
                        >
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <ThemedText
                                type="default"
                                style={[
                                    styles.ratingText,
                                    { color: text },
                                    filters.minRating === 4.5 && { color: primary, fontWeight: '600' },
                                ]}
                            >
                                4.5 & up
                            </ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.ratingOption,
                                { backgroundColor: card },
                                filters.minRating === 5.0 && { backgroundColor: `${primary}20`, borderColor: primary, borderWidth: 1 },
                            ]}
                            onPress={() => setFilters({ ...filters, minRating: 5.0 })}
                        >
                            <Ionicons name="star" size={20} color="#FFD700" />
                            <ThemedText
                                type="default"
                                style={[
                                    styles.ratingText,
                                    { color: text },
                                    filters.minRating === 5.0 && { color: primary, fontWeight: '600' },
                                ]}
                            >
                                5.0 only
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity style={[styles.applyButton, { backgroundColor: primary }]}>
                <ThemedText type="default" style={styles.applyButtonText}>
                    Show 124 Results
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // borderTopLeftRadius: 24, // Removing border radius as screen
        // borderTopRightRadius: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 32,
        paddingBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
        letterSpacing: 1,
    },
    sortOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sortOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sortOptionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedSortOptionText: {
        color: 'white',
    },
    priceRangeContainer: {
        alignItems: 'center',
    },
    priceRangeText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 12,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryOption: {
        width: '30%',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '500',
    },
    distanceContainer: {
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    distanceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 8,
    },
    distanceLabel: {
        fontSize: 12,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ratingOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '500',
    },
    applyButton: {
        margin: 20,
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
