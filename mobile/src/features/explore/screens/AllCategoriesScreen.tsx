import { ThemedText } from "@/src/components/themed/ThemedText";
import { ThemedView } from "@/src/components/themed/ThemedView";
import { useCategories } from "@/src/features/explore/hooks/useExplore";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3; // Use 3 columns for better density
const GAP = 12;
const PADDING = 20;
const ITEM_WIDTH = Math.floor(
  (width - PADDING * 2 - (COLUMN_COUNT - 1) * GAP) / COLUMN_COUNT,
);

const CATEGORY_ICONS: Record<string, any> = {
  attractions: "location-outline",
  hotels: "bed-outline",
  restaurants: "restaurant-outline",
  events: "calendar-outline",
  shopping: "cart-outline",
  nightlife: "moon-outline",
  historicalsites: "hourglass-outline",
  natureandwildlife: "leaf-outline",
  relaxationandspa: "water-outline",
};

export default function AllCategoriesScreen() {
  const { t } = useTranslation();
  const bg = useThemeColor({}, "bg");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  const { data: categories, isLoading } = useCategories();

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen
        options={{
          title: t("home.categories"),
          headerBackTitle: t("common.back"),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: bg },
          headerTintColor: text,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={primary}
            style={{ marginTop: 50 }}
          />
        ) : (
          <View style={styles.grid}>
            {categories?.map((cat: any) => {
              const KEY_MAP: Record<string, string> = {
                hotel: "hotels",
                hotels: "hotels",
                restaurant: "restaurants",
                restaurants: "restaurants",
                event: "events",
                events: "events",
                attraction: "attractions",
                attractions: "attractions",
                "historical site": "historicalsites",
                "historical sites": "historicalsites",
                "nature & wildlife": "natureandwildlife",
                "nature and wildlife": "natureandwildlife",
                "relaxation & spa": "relaxationandspa",
                "relaxation and spa": "relaxationandspa",
                shopping: "shopping",
                nightlife: "nightlife",
                "governmental service": "governmentalservice",
                bank: "bank",
                "coffie house": "coffeehouse",
                "coffee house": "coffeehouse",
                coffeehouse: "coffeehouse",
                education: "education",
                festival: "festival",
                health: "health",
                hospital: "hospital",
              };
              let rawKey = ((cat as any).key || (cat as any).name || "")
                .toLowerCase()
                .trim();
              if (KEY_MAP[rawKey]) rawKey = KEY_MAP[rawKey];
              else
                rawKey = rawKey.replace(/&/g, "and").replace(/[^a-z0-9]/g, "");

              const title = t(`explore.categories.${rawKey}`, {
                defaultValue: cat.name,
              });
              const iconName =
                cat.icon ||
                CATEGORY_ICONS[rawKey] ||
                CATEGORY_ICONS[cat.key] ||
                "grid-outline";

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.item, { backgroundColor: card }]}
                  onPress={() =>
                    router.push({
                      pathname: "/places",
                      params: {
                        categoryId: cat.id,
                        title: title,
                      },
                    })
                  }
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: primary + "15" },
                    ]}
                  >
                    <Ionicons
                      name={iconName as any}
                      size={28}
                      color={primary}
                    />
                  </View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[styles.itemTitle, { color: text }]}
                    numberOfLines={2}
                  >
                    {title}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    padding: PADDING,
    paddingTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  item: {
    width: ITEM_WIDTH,
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: ITEM_WIDTH * 1.2,
    gap: 10,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
  },
});
