import { ThemedText } from '@/src/components/themed/ThemedText';
import { ThemedView } from '@/src/components/themed/ThemedView';
import { useCategories, usePlaces } from '@/src/features/explore/hooks/useExplore';
import { Place } from '@/src/features/explore/types';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function MapScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const { data: categoriesData } = useCategories();
    const { data: placesData, isLoading } = usePlaces({
        categoryId: selectedCategory || undefined,
        q: searchQuery || undefined
    });

    const categories = categoriesData || [];
    const places = placesData?.data || [];

    const bg = useThemeColor({}, 'bg');
    const card = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');
    const muted = useThemeColor({}, 'muted');
    const text = useThemeColor({}, 'text');

    // Adama city center coordinates
    const ADAMA_CENTER = {
        latitude: 8.5414,
        longitude: 39.2685,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    };

    const handleMarkerPress = (place: Place) => {
        setSelectedPlace(place);
    };

    const handleNavigate = () => {
        if (selectedPlace) {
            router.push(`/place/${selectedPlace.id}`);
        }
    };

    return (
        <ThemedView style={{ flex: 1 }}>
            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={StyleSheet.absoluteFillObject}
                initialRegion={ADAMA_CENTER}
                showsUserLocation
                showsMyLocationButton={false}
            >
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{
                            latitude: place.latitude,
                            longitude: place.longitude,
                        }}
                        onPress={() => handleMarkerPress(place)}
                    >
                        <View style={[styles.marker, {
                            backgroundColor: selectedPlace?.id === place.id ? primary : card
                        }]}>
                            <Ionicons
                                name="location"
                                color={selectedPlace?.id === place.id ? '#fff' : primary}
                                size={20}
                            />
                        </View>
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar */}
            <View style={[styles.searchWrapper, { backgroundColor: card }]}>
                <Ionicons name="search" size={20} color={muted} />
                <TextInput
                    placeholder="Search places..."
                    placeholderTextColor={muted}
                    style={[styles.searchInput, { color: text }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {isLoading && <ActivityIndicator size="small" color={primary} />}
            </View>

            {/* Categories */}
            <View style={styles.categoriesRow}>
                <TouchableOpacity
                    style={[
                        styles.categoryChip,
                        { backgroundColor: !selectedCategory ? primary : card },
                    ]}
                    onPress={() => setSelectedCategory(null)}
                >
                    <Ionicons
                        name="apps-outline"
                        size={16}
                        color={!selectedCategory ? '#fff' : muted}
                    />
                    <ThemedText style={{ color: !selectedCategory ? '#fff' : muted, fontWeight: '600' }}>
                        All
                    </ThemedText>
                </TouchableOpacity>
                {categories.slice(0, 3).map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryChip,
                            { backgroundColor: selectedCategory === category.id ? primary : card },
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                    >
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color={selectedCategory === category.id ? '#fff' : muted}
                        />
                        <ThemedText
                            style={{
                                color: selectedCategory === category.id ? '#fff' : muted,
                                fontWeight: '600',
                            }}
                            numberOfLines={1}
                        >
                            {category.name}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bottom Place Card */}
            {selectedPlace && (
                <View style={[styles.placeCard, { backgroundColor: card }]}>
                    <Image
                        source={{
                            uri: selectedPlace.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
                        }}
                        style={styles.placeImage}
                    />
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.placeTitle} numberOfLines={1}>
                            {selectedPlace.name}
                        </ThemedText>
                        {selectedPlace.avgRating && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <ThemedText style={{ color: text, marginLeft: 4, fontSize: 12 }}>
                                    {selectedPlace.avgRating.toFixed(1)}
                                </ThemedText>
                            </View>
                        )}
                        <ThemedText style={{ color: muted, fontSize: 12 }} numberOfLines={1}>
                            {selectedPlace.address || 'Adama, Ethiopia'}
                        </ThemedText>
                        <View style={styles.placeFooter}>
                            <TouchableOpacity
                                style={[styles.navigateBtn, { backgroundColor: primary }]}
                                onPress={handleNavigate}
                            >
                                <Ionicons name="navigate" size={14} color="#fff" />
                                <ThemedText style={{ fontWeight: '700', color: '#fff' }}>View Details</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setSelectedPlace(null)}
                    >
                        <Ionicons name="close" size={20} color={muted} />
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    searchWrapper: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 14,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 12,
        fontSize: 15,
    },
    categoriesRow: {
        position: 'absolute',
        top: 130,
        left: 16,
        right: 16,
        flexDirection: 'row',
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    marker: {
        padding: 8,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    placeCard: {
        position: 'absolute',
        bottom: 90,
        left: 16,
        right: 16,
        flexDirection: 'row',
        padding: 12,
        borderRadius: 18,
        elevation: 10,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    placeImage: {
        width: 90,
        height: 90,
        borderRadius: 14,
    },
    placeTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    placeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        alignItems: 'center',
    },
    navigateBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
    },
});
