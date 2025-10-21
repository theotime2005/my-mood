import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

import { USER_TYPE } from "../constants.js";
import { useUser } from "../contexts/UserContext.js";

export default function HomeScreen({ navigation }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
        <StatusBar style="auto" />
      </View>
    );
  }

  const canEnterMood = user && (user.userType === USER_TYPE.ADMIN || user.userType === USER_TYPE.EMPLOYER);

  return (
    <View style={styles.container}>
      {canEnterMood ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>Bienvenue {user.firstname} !</Text>
          <Button
            title="Saisir mon humeur"
            onPress={() => navigation.navigate("MoodEntry")}
            testID="mood-entry-button"
          />
        </View>
      ) : (
        <Text style={styles.text}>Hello world</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
  },
  buttonContainer: {
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
});
