import { ThemedText } from '@/src/components/themed/ThemedText';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SearchSuggestionsProps {
    recentSearches: string[];
    popularSearches: string[];
    onSelectSuggestion: (suggestion: string) => void;
    onClearRecent: () => void;
    searchType?: 'all' | 'blog' | 'place' | 'event';
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
    recentSearches,
    popularSearches,
    onSelectSuggestion,
    onClearRecent,
    searchType = 'all'
}) => {
    const text = useThemeColor({}, 'text');
    const muted = useThemeColor({}, 'muted');
    const card = useThemeColor({}, 'card');
    const primary = useThemeColor({}, 'primary');

    return (
        <View style={styles.container}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <ThemedText type="subtitle" style={{ color: text, fontSize: 16 }}>
                            Recent Searches
                        </ThemedText>
                        <TouchableOpacity onPress={onClearRecent}>
                            <ThemedText style={{ color: primary, fontSize: 14 }}>
                                Clear
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                    {recentSearches.map((search, index) => (
                        <TouchableOpacity
                            key={`recent-${index}`}
                            style={[styles.suggestionItem, { backgroundColor: card }]}
                            onPress={() => onSelectSuggestion(search)}
                        >
                            <Ionicons name="time-outline" size={20} color={muted} />
                            <ThemedText style={[styles.suggestionText, { color: text }]}>
                                {search}
                            </ThemedText>
                            <Ionicons name="arrow-up-outline" size={18} color={muted} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
                <View style={styles.section}>
                    <ThemedText type="subtitle" style={{ color: text, marginBottom: 12, fontSize: 16 }}>
                        {searchType === 'blog' ? 'Popular Topics' : 'Popular Searches'}
                    </ThemedText>
                    {popularSearches.map((search, index) => (
                        <TouchableOpacity
                            key={`popular-${index}`}
                            style={[styles.suggestionItem, { backgroundColor: card }]}
                            onPress={() => onSelectSuggestion(search)}
                        >
                            <Ionicons name="trending-up-outline" size={20} color={primary} />
                            <ThemedText style={[styles.suggestionText, { color: text }]}>
                                {search}
                            </ThemedText>
                            <Ionicons name="arrow-up-outline" size={18} color={muted} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        gap: 12,
    },
    suggestionText: {
        flex: 1,
        fontSize: 15,
    },
});
