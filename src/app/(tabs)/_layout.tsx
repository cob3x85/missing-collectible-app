import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: undefined,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: undefined,
        tabBarItemStyle: undefined,
        tabBarPosition: "bottom",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("menu.home"),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: t("menu.add"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: t("menu.about"),
          tabBarIcon: ({ color }) => (
            <Ionicons name="information-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t("menu.search"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search"
              size={28}
              color={
                focused
                  ? Colors[colorScheme ?? "light"].tabIconSelected
                  : Colors[colorScheme ?? "light"].tabIconDefault
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("menu.settings"),
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings"
              size={28}
              color={
                focused
                  ? Colors[colorScheme ?? "light"].tabIconSelected
                  : Colors[colorScheme ?? "light"].tabIconDefault
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
