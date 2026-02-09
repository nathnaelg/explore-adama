import { ThemedText } from "@/src/components/themed/ThemedText";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface SearchSuggestionProps {
  type: "place" | "event" | "blog";
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const getIconName = (type: string): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case "place":
      return "location";
    case "event":
      return "calendar";
    case "blog":
      return "newspaper";
    default:
      return "search";
  }
};

const getTypeLabel = (type: string): string => {
  switch (type) {
    case "place":
      return "Place";
    case "event":
      return "Event";
    case "blog":
      return "Blog";
    default:
      return "";
  }
};

export const SearchSuggestion: React.FC<SearchSuggestionProps> = ({
  type,
  title,
  subtitle,
  onPress,
}) => {
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "muted");
  const primary = useThemeColor({}, "primary");
  const card = useThemeColor({}, "card");

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: primary + "15" }]}>
        <Ionicons name={getIconName(type)} size={20} color={primary} />
      </View>
      <View style={styles.content}>
        <ThemedText style={[styles.title, { color: text }]} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText
            style={[styles.subtitle, { color: muted }]}
            numberOfLines={1}
          >
            {subtitle}
          </ThemedText>
        )}
      </View>
      <ThemedText style={[styles.typeLabel, { color: muted }]}>
        {getTypeLabel(type)}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});
