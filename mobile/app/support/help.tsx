import { ThemedText } from "@/src/components/themed/ThemedText";
import { ThemedView } from "@/src/components/themed/ThemedView";
import { useThemeColor } from "@/src/hooks/use-theme-color";
import { Stack } from "expo-router/stack";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

export default function HelpSupportScreen() {
  const bg = useThemeColor({}, "bg");
  const { t } = useTranslation();

  return (
    <ThemedView style={[styles.container, { backgroundColor: bg }]}>
      <Stack.Screen options={{ title: t("public.helpSupport") }} />
      <ThemedText type="title">{t("public.helpCenter")}</ThemedText>
      <ThemedText style={styles.content}>
        {t("public.supportMessage")}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.sectionHeader}>
        {t("public.faq")}
      </ThemedText>
      <ThemedText style={styles.content}>
        {t("public.faqQuestion1")}
        {"\n"}
        {t("public.faqAnswer1")}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    marginTop: 10,
    lineHeight: 24,
  },
  sectionHeader: {
    marginTop: 20,
  },
});
