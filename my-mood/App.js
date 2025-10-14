import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import HomeScreen from "./src/screens/HomeScreen.js";
import LoginScreen from "./src/screens/LoginScreen.js";
import WelcomeScreen from "./src/screens/WelcomeScreen.js";
import { getBaseUrl, getToken } from "./src/utils/storage.js";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(function() {
    async function checkInitialState() {
      try {
        const baseUrl = await getBaseUrl();
        const token = await getToken();

        if (token) {
          setInitialRoute("Home");
        } else if (baseUrl) {
          setInitialRoute("Login");
        } else {
          setInitialRoute("Welcome");
        }
      } catch (error) {
        // If there's an error accessing storage, default to Welcome screen
        setInitialRoute("Welcome");
      } finally {
        setIsLoading(false);
      }
    }

    checkInitialState();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
