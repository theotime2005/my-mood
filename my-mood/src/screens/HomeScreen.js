import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { USER_TYPE } from "../constants/userTypes.js";
import { getToken } from "../utils/storage.js";
import { decodeToken } from "../utils/token.js";

export default function HomeScreen({ navigation }) {
  const [userType, setUserType] = useState(null);

  useEffect(function() {
    async function loadUserInfo() {
      try {
        const token = await getToken();
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.userType) {
            setUserType(decoded.userType);
          }
        }
      } catch (_error) {
        // If token decoding fails, userType remains null
      }
    }

    loadUserInfo();
  }, []);

  const canEnterMood = userType === USER_TYPE.ADMIN || userType === USER_TYPE.EMPLOYER;

  return (
    <View style={styles.container}>
      {canEnterMood ? (
        <View style={styles.buttonContainer}>
          <Button
            title="Enregistrer mon humeur"
            onPress={() => navigation.navigate("MoodEntry")}
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
    width: "80%",
    maxWidth: 300,
  },
});
