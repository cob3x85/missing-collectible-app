import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import AboutScreen from "./about";
import AddScreen from "./add";
import HomeScreen from "./index";
import Search from "./search";
import SettingsScreen from "./settings";

const Tab = createNativeBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: "house.fill",
            hierarchicalColor: focused
              ? Colors[colorScheme ?? "light"].tabIconSelected
              : Colors[colorScheme ?? "light"].tabIconDefault,
          }),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: "plus.circle.fill",
            hierarchicalColor: focused
              ? Colors[colorScheme ?? "light"].tabIconSelected
              : Colors[colorScheme ?? "light"].tabIconDefault,
          }),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: "info.circle.fill",
            hierarchicalColor: focused
              ? Colors[colorScheme ?? "light"].tabIconSelected
              : Colors[colorScheme ?? "light"].tabIconDefault,
          }),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: "magnifyingglass",
            hierarchicalColor: focused
              ? Colors[colorScheme ?? "light"].tabIconSelected
              : Colors[colorScheme ?? "light"].tabIconDefault,
          }),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => ({
            sfSymbol: "gear",
            hierarchicalColor: focused
              ? Colors[colorScheme ?? "light"].tabIconSelected
              : Colors[colorScheme ?? "light"].tabIconDefault,
          }),
        }}
      />
    </Tab.Navigator>
  );
}
