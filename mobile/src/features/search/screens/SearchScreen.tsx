import { ThemedText } from "@/src/components/themed/ThemedText";
import { ThemedView } from "@/src/components/themed/ThemedView";
import { useAuth } from "@/src/features/auth/contexts/AuthContext";
import { useCategories } from "@/src/features/explore/hooks/useExplore";
import { SearchSuggestion } from "@/src/features/search/components/SearchSuggestion";
import { useDebouncedSearch } from "@/src/features/search/hooks/useSearch";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const {
    debouncedQuery,
    data: searchResults,
    isLoading,
    isError,
    error,
    refetch,
  } = useDebouncedSearch(query, 300);
  const { isAuthenticated } = useAuth();
  const { data: categoriesData } = useCategories();
  const categories = categoriesData || [];

  // Debug logging
  React.useEffect(() => {
    if (query.length > 0) {
      console.log("[Search Debug] Query:", query);
      console.log("[Search Debug] Debounced Query:", debouncedQuery);
      console.log("[Search Debug] Loading:", isLoading);
      console.log("[Search Debug] Error:", isError ? error : "None");
      console.log("[Search Debug] Results:", searchResults);
    }
  }, [query, debouncedQuery, isLoading, searchResults, isError, error]);

  const bg = useThemeColor({}, "bg");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");
  const chip = useThemeColor({}, "chip");
  const insets = useSafeAreaInsets();

  const handleResultPress = (result: any) => {
    if (result.type === "place") {
      router.push(`/place/${result.id}`);
    } else if (result.type === "event") {
      if (!isAuthenticated) {
        router.push("/(auth)/login");
        return;
      }
      router.push({
        pathname: "/bookings/new",
        params: { eventId: result.id },
      } as any);
    } else if (result.type === "blog") {
      router.push(`/blog/${result.id}`);
    }
  };

  const showSuggestions =
    query.length > 0 &&
    (isLoading || (searchResults && searchResults.length > 0));
  const showNoResults =
    query.length > 0 &&
    !isLoading &&
    !isError &&
    debouncedQuery === query &&
    (!searchResults || searchResults.length === 0);

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      {/* Search Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 10,
            backgroundColor: card,
            borderBottomColor: chip,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={text} />
        </TouchableOpacity>
        <View style={[styles.searchInputContainer, { backgroundColor: bg }]}>
          <Ionicons name="search" size={20} color={muted} />
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search places, events, blogs..."
            placeholderTextColor={muted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => setQuery("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color={muted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {/* Loading State */}
        {isLoading && query.length > 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={primary} />
            <ThemedText style={[styles.loadingText, { color: muted }]}>
              Searching...
            </ThemedText>
          </View>
        )}

        {/* Error State */}
        {isError && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color={muted} />
            <ThemedText style={[styles.errorTitle, { color: text }]}>
              Search failed
            </ThemedText>
            <ThemedText style={[styles.errorText, { color: muted }]}>
              Something went wrong while searching. Please try again.
            </ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: card }]}
              onPress={() => refetch()}
            >
              <ThemedText style={[styles.retryText, { color: primary }]}>
                Retry
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Suggestions */}
        {showSuggestions && !isLoading && (
          <View
            style={[styles.suggestionsContainer, { backgroundColor: card }]}
          >
            {searchResults?.slice(0, 8).map((result: any, index: number) => (
              <SearchSuggestion
                key={`${result.type}-${result.id}`}
                type={result.type}
                title={result.name}
                subtitle={result.description}
                onPress={() => handleResultPress(result)}
              />
            ))}
          </View>
        )}

        {/* No Results */}
        {showNoResults && (
          <View style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={48} color={muted} />
            <ThemedText style={[styles.noResultsTitle, { color: text }]}>
              No results found
            </ThemedText>
            <ThemedText style={[styles.noResultsText, { color: muted }]}>
              Try searching for something else
            </ThemedText>
          </View>
        )}

        {/* Empty State */}
        {query.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={muted + "40"} />
            <ThemedText style={[styles.emptyStateText, { color: muted }]}>
              Search for events, places, and blogs
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  suggestionsContainer: {
    marginTop: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  noResultsText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  section: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    fontWeight: "600",
  },
});
