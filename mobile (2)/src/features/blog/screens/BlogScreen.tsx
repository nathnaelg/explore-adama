import { ThemedText } from "@/src/components/themed/ThemedText";
import { ThemedView } from "@/src/components/themed/ThemedView";
import { useAuth } from "@/src/features/auth/contexts/AuthContext";
import { BlogPostCard } from "@/src/features/blog/components/BlogPostCard";
import { BlogSkeleton } from "@/src/features/blog/components/BlogSkeleton";
import {
  useBlogCategories,
  useBlogPosts,
  useToggleLike,
} from "@/src/features/blog/hooks/useBlog";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BlogScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const bg = useThemeColor({}, "bg");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");
  const chip = useThemeColor({}, "chip");
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const { data, isLoading, isFetching, isRefetching, refetch } = useBlogPosts({
    page,
    limit: 20,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  const { mutate: toggleLike } = useToggleLike();

  const { data: categoryData } = useBlogCategories();

  const blogPosts = data?.items || [];
  const total = data?.total || 0;

  // Use fetched categories or fallback to defaults
  const hardcodedCategories = [
    "travel",
    "hotels",
    "restaurants",
    "culture",
    "events",
    "tips",
  ];
  const categories = ["all", ...hardcodedCategories, ...(categoryData || [])];
  const uniqueCategories = Array.from(new Set(categories));

  const onRefresh = async () => {
    setIsManualRefreshing(true);
    setPage(1);
    await refetch();
    setIsManualRefreshing(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleCreatePost = () => router.push("/blog/new");

  const handleLike = (postId: string) => toggleLike(postId);

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={{ flex: 1 }}>
        <ThemedText type="title" style={styles.title}>
          {t("blog.communityFeed")}
        </ThemedText>
        <ThemedText type="default" style={[styles.subtitle, { color: muted }]}>
          {t("blog.discoverStories")}
        </ThemedText>
      </View>

      <View style={styles.headerIcons}>
        <TouchableOpacity
          style={[styles.iconCircle, { backgroundColor: card }]}
          onPress={handleCreatePost}
        >
          <Ionicons name="add-outline" size={22} color={text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconCircle, { backgroundColor: card }]}
          onPress={() => router.push("/search?type=blog")}
        >
          <Ionicons name="search-outline" size={22} color={text} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ paddingLeft: 20, marginBottom: 16 }}
    >
      {uniqueCategories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category ? primary : chip,
              marginRight: 12,
            },
          ]}
          onPress={() => handleCategoryChange(category)}
        >
          <ThemedText
            type="default"
            style={[
              styles.categoryText,
              { color: selectedCategory === category ? "white" : text },
            ]}
          >
            {category === "all"
              ? t("explore.all")
              : t(`blog.categories.${category.toLowerCase()}`, {
                defaultValue: category,
              })}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  if (isLoading && page === 1) {
    return <BlogSkeleton />;
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isManualRefreshing}
            onRefresh={onRefresh}
            tintColor={primary}
          />
        }
      >
        {renderHeader()}
        {renderCategories()}

        {/* Blog Posts */}
        {blogPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="newspaper-outline" size={64} color={muted} />
            <ThemedText
              type="title"
              style={[styles.emptyTitle, { color: text }]}
            >
              {t("blog.noPostsYet")}
            </ThemedText>
            <ThemedText
              type="default"
              style={[styles.emptyDescription, { color: muted }]}
            >
              {t("blog.beFirstToShare")}
            </ThemedText>
            {user && (
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: primary }]}
                onPress={() => router.push("/blog/new")}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <ThemedText
                  type="default"
                  style={[styles.createButtonText, { color: "#fff" }]}
                >
                  {t("blog.createFirstPost")}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <ThemedText type="title" style={styles.sectionTitle}>
                {selectedCategory === "all"
                  ? t("blog.recentPosts")
                  : t(`blog.categories.${selectedCategory.toLowerCase()}`, {
                    defaultValue: selectedCategory,
                  })}
              </ThemedText>
              <ThemedText type="default" style={{ color: muted }}>
                {t("blog.postsCount", { count: total })}
              </ThemedText>
            </View>

            <View style={styles.postsContainer}>
              {blogPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onPress={() => router.push(`/blog/${post.id}`)}
                  onLike={() => handleLike(post.id)}
                  onComment={() => router.push(`/blog/${post.id}`)}
                />
              ))}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 4 },
  headerIcons: { flexDirection: "row", gap: 12, marginTop: 4 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: { fontSize: 14, fontWeight: "500" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  postsContainer: { paddingHorizontal: 20 },
  emptyState: { alignItems: "center", paddingHorizontal: 20, paddingTop: 60 },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: { fontSize: 16, textAlign: "center", marginBottom: 32 },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: { fontSize: 16, fontWeight: "600" },
});
