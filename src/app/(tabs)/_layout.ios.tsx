import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import AboutScreen from "./about";
import AddScreen from "./add";
import HomeScreen from "./index";
import Search from "./search";

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
          tabBarIcon: () => ({
            sfSymbol: "house.fill",
          }),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          title: "Add",
          tabBarIcon: () => ({ sfSymbol: "plus.circle.fill" }),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About",
          tabBarIcon: () => ({ sfSymbol: "info.circle.fill" }),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          title: "Search",
          tabBarIcon: () => ({ sfSymbol: "magnifyingglass" }),
        }}
      />
    </Tab.Navigator>
  );
}
