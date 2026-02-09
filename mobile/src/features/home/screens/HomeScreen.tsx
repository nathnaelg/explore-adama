import { OptimizedImage } from "@/src/components/common/OptimizedImage";
import { SectionHeader } from "@/src/components/common/SectionHeader";
import { useAuth } from "@/src/features/auth/contexts/AuthContext";
import {
    useCategories,
    useGlobalRecommendations,
    useNearbyPlaces,
} from "@/src/features/explore/hooks/useExplore";
import { BlogRail } from "@/src/features/home/components/BlogRail";
import { EventRail } from "@/src/features/home/components/EventRail";
import { FeaturedCarousel } from "@/src/features/home/components/FeaturedCarousel";
import { HomeSkeleton } from "@/src/features/home/components/HomeSkeleton";
import { useNotificationStats } from "@/src/features/notifications/hooks/useNotifications";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CATEGORY_ICONS: Record<string, string> = {
  attractions: "location-outline",
  hotels: "bed-outline",
  restaurants: "restaurant-outline",
  events: "calendar-outline",
  shopping: "cart-outline",
  nightlife: "moon-outline",
};

export default function HomeScreen() {
  const { t } = useTranslation();
  const bg = useThemeColor({}, "bg");
  const card = useThemeColor({}, "card");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");
  const accent = useThemeColor({}, "accent");

  const { user: authUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { data: recommendations, isLoading: recommendationsLoading } =
    useGlobalRecommendations();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  // Use Adama center coordinates as default for nearby
  const { data: nearby, isLoading: nearbyLoading } = useNearbyPlaces({
    lat: 8.5414,
    lng: 39.2689,
    radius: 20,
  });
  const { data: notificationStats } = useNotificationStats();

  const unreadCount = notificationStats?.unreadCount || 0;

  /** 🔔 Notification Icon Handler */
  const openNotifications = () => {
    router.push("/notifications");
  };

  const { data: userProfile } = useProfile(authUser?.id, !!authUser);
  const userName =
    userProfile?.profile?.name?.split(" ")[0] ||
    authUser?.email?.split("@")[0] ||
    t("common.traveler");

  const isLoading =
    recommendationsLoading || categoriesLoading || nearbyLoading;

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= HEADER ================= */}
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <View>
            <Text style={[styles.title, { color: text }]}>
              {t("common.hello")}, {userName} 👋
            </Text>
            <Text style={{ color: muted }}>{t("home.adamaEthiopia")}</Text>
          </View>

          <View style={styles.headerIcons}>
            {/* Notification */}
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: card }]}
              onPress={openNotifications}
            >
              <Ionicons name="notifications-outline" size={22} color={text} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: primary }]}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              style={[styles.iconCircle, { backgroundColor: card }]}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-outline" size={22} color={text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= HERO CAROUSEL ================= */}
        <View style={{ marginTop: 24 }}>
          <FeaturedCarousel places={recommendations?.popularPlaces || []} />
        </View>

        {/* ================= CATEGORIES ================= */}
        <SectionHeader
          title={t("home.categories")}
          action={t("common.seeAll")}
          actionColor={primary}
          onActionPress={() => router.push("/categories")}
          style={{ marginTop: 0 }}
        />

        <View style={styles.categories}>
          {categoriesLoading ? (
            <ActivityIndicator size="small" color={primary} />
          ) : (
            categories?.slice(0, 6).map((cat: any) => {
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

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.category, { backgroundColor: card }]}
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
                  <Ionicons
                    name={
                      (cat.icon ||
                        CATEGORY_ICONS[cat.key] ||
                        "grid-outline") as any
                    }
                    size={22}
                    color={primary}
                  />
                  <Text style={{ color: text, fontSize: 12 }} numberOfLines={1}>
                    {title}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* ================= EVENTS ================= */}
        <View style={{ marginTop: 24 }}>
          <EventRail events={recommendations?.popularEvents || []} />
        </View>

        {/* ================= POPULAR PLACES ================= */}
        <SectionHeader
          title={t("home.popularPlaces")}
          action={t("common.seeAll")}
          actionColor={primary}
          onActionPress={() => router.push("/(tabs)/explore")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
        >
          {recommendationsLoading ? (
            <ActivityIndicator
              size="large"
              color={primary}
              style={{ margin: 50 }}
            />
          ) : (
            recommendations?.popularPlaces?.map((place: any) => (
              <HotelCard
                key={place.id}
                place={place}
                card={card}
                text={text}
                muted={muted}
                primary={primary}
                accent={accent}
              />
            ))
          )}
        </ScrollView>

        {/* ================= BLOGS / STORIES ================= */}
        <View style={{ marginTop: 12 }}>
          <BlogRail />
        </View>

        {/* ================= NEARBY ================= */}
        <SectionHeader
          title={t("home.nearbyPlaces")}
          action={t("home.viewMap")}
          actionColor={primary}
          onActionPress={() => router.push("/(tabs)/map")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20 }}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {nearbyLoading ? (
            <ActivityIndicator
              size="small"
              color={primary}
              style={{ margin: 50 }}
            />
          ) : (
            nearby?.data?.slice(0, 5).map((place: any) => (
              <TouchableOpacity
                key={place.id}
                style={[styles.nearby, { backgroundColor: card }]}
                onPress={() => router.push(`/place/${place.id}`)}
              >
                <OptimizedImage
                  source={{
                    uri:
                      place.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
                  }}
                  style={styles.nearbyImage}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.nearbyContent}>
                  <Text
                    style={{ color: text, fontWeight: "700", fontSize: 15 }}
                    numberOfLines={1}
                  >
                    {place.name}
                  </Text>
                  <Text
                    style={{ color: muted, fontSize: 12 }}
                    numberOfLines={1}
                  >
                    {place.address || t("home.adamaEthiopia")}
                  </Text>
                  <Text
                    style={{ color: primary, fontSize: 13, fontWeight: "600" }}
                  >
                    ⭐ {place.avgRating || t("explore.new")}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

/* ================= COMPONENTS ================= */

/* ================= COMPONENTS ================= */

function HotelCard({ place, card, text, muted, primary, accent }: any) {
  const { t } = useTranslation();

  if (!place) return null;

  return (
    <TouchableOpacity
      style={[styles.hotelCard, { backgroundColor: card }]}
      onPress={() => router.push(`/place/${place.id}`)}
    >
      <OptimizedImage
        source={{
          uri:
            place.images?.[0]?.url ||
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        }}
        style={styles.hotelImage}
        contentFit="cover"
        transition={300}
      />
      <Text style={[styles.hotelTitle, { color: text }]} numberOfLines={1}>
        {place.name}
      </Text>
      <Text style={{ color: muted }} numberOfLines={1}>
        {place.description || t("home.premiumExperience")}
      </Text>
      <View style={styles.hotelFooter}>
        <Text style={{ color: primary, fontWeight: "700" }}>
          ⭐ {place.avgRating || t("explore.new")}
        </Text>
        <View style={[styles.bookBtn, { backgroundColor: accent }]}>
          <Text style={{ color: "#fff" }}>{t("common.view")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    padding: 20,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "700" },

  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "white", // Using white for contrast
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  hotelCard: {
    width: 260,
    borderRadius: 20,
    padding: 14,
    marginRight: 16,
  },
  hotelImage: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 10,
  },
  hotelTitle: { fontSize: 16, fontWeight: "700" },
  hotelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  bookBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingHorizontal: 20,
  },
  category: {
    width: "30%",
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    gap: 6,
  },

  nearby: {
    width: 200,
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
    flexDirection: "column",
  },
  nearbyImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  nearbyContent: {
    gap: 4,
  },
});
