import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import AboutScreen from "./about";
import AddScreen from "./add";
import HomeScreen from "./index";

const Tab = createNativeBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarBlurEffect: "prominent",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarActiveIndicatorEnabled: true,
          // tabBarIcon: {
          //   type: "image",
          //   source: require("../../../assets/images/missingfunko.png"),
          // }
          // tabBarIcon: () => ({ sfSymbolName: "house.fill" } as any),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddScreen}
        options={{
          title: "Add",
          // tabBarIcon: () => ({ sfSymbolName: "plus.circle.fill" } as any),
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "About",
          // tabBarIcon: () => ({ sfSymbolName: "info.circle.fill" } as any),
        }}
      />
    </Tab.Navigator>
  );
}
