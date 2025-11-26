import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ImageSpinner } from "@/components/ui/image-spinner";
import { useFonts } from "expo-font";
import { GlassContainer, GlassView } from "expo-glass-effect";
import { Image } from "expo-image";
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({
    Slackey: require("@/assets/fonts/Slackey/Slackey-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ImageSpinner />;
  }

  return (
    <GlassContainer style={styles.container}>
      <GlassView style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
           {t('about.title')}
          </ThemedText>
          <View style={styles.logoChip}>
            <Image
              source={require("@/assets/images/PopCollectionImage.png")}
              style={styles.logoImage}
              contentFit="contain"
            />
          </View>
        </View>
      </GlassView>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              {t('appName')}
            </ThemedText>
            <HelloWave />
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.text}>
              {t('about.description')}
              </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              {t('titles.problem')}
            </ThemedText>
            <ThemedText style={styles.text}>
              {t('about.problem')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              {t('titles.solution')}
            </ThemedText>
            <ThemedText style={styles.text}>
              {t('about.solution')}
            </ThemedText>
          </View>

          <View style={[styles.section, { marginBottom: 80 }]}>
            <ThemedText type="subtitle" style={styles.subtitle}>
              {t('titles.disclaimer')}
            </ThemedText>
            <ThemedText style={[styles.text, { fontStyle: "italic" }]}>
              {t('about.disclaimer')}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#f46d03",
    padding: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontFamily: "Slackey",
    fontSize: 24,
    fontWeight: "bold",
  },
  logoChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  title: {
    color: "black",
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    color: "black",
    marginBottom: 8,
  },
  text: {
    color: "black",
    lineHeight: 24,
  },
});
