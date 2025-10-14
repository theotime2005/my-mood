import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";

import HomeScreen from "./src/screens/HomeScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import { getBaseUrl, getToken } from "./src/utils/storage.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(function() {
    async function checkInitialState() {
      const baseUrl = await getBaseUrl();
      const token = await getToken();

      if (token) {
        setInitialRoute("Home");
      } else if (baseUrl) {
        setInitialRoute("Login");
      } else {
        setInitialRoute("Welcome");
      }
    }

    checkInitialState();
  }, []);

  if (!initialRoute) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
