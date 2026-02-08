import React from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "../themed/ThemedText";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
  actionColor?: string;
  style?: ViewStyle;
}

export const SectionHeader = ({
  title,
  action,
  onActionPress,
  actionColor,
  style,
}: SectionHeaderProps) => {
  return (
    <View style={[styles.sectionHeader, style]}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {action && (
        <TouchableOpacity onPress={onActionPress}>
          <ThemedText style={{ color: actionColor, fontWeight: "600" }}>
            {action}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
});
