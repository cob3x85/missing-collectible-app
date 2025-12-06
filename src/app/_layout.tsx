import { useColorScheme } from "@/hooks/use-color-scheme";
import { db } from "@/services/db";
import { settingsService } from "@/services/settings";
import { updateService } from "@/services/update";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert } from "react-native";
import "react-native-get-random-values";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    // Initialize database and settings when app starts
    db.init()
      .then(async () => {
        // Initialize settings service
        await settingsService.init();
        
        // Check for OTA updates on app launch (silent, only prompts if update available)
        await updateService.checkOnLaunch();
      })
      .catch((error: unknown) => {
        console.error(error);
        Alert.alert(
          "Database Error",
          "Failed to initialize the database. Please restart the app or contact support.",
          [{ text: "OK" }]
        );
      });
  }, []);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",
                title: "Modal",
                scrollEdgeEffects: { left: "auto" },
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
