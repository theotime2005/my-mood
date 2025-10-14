import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import { checkHealth } from "../adapters/api-adapter.js";
import { saveBaseUrl } from "../utils/storage.js";

export default function WelcomeScreen({ navigation }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!url.trim()) {
      Alert.alert("Erreur", "Veuillez entrer une URL");
      return;
    }

    setLoading(true);
    const isHealthy = await checkHealth(url.trim());

    if (isHealthy) {
      await saveBaseUrl(url.trim());
      navigation.navigate("Login");
    } else {
      Alert.alert("Erreur", "L'URL saisie n'est pas valide ou le serveur n'est pas accessible");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur My Mood</Text>
      <Text style={styles.subtitle}>Veuillez entrer l&apos;URL de votre plateforme My Mood</Text>

      <TextInput
        style={styles.input}
        placeholder="https://example.com"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <Button
        title={loading ? "Vérification..." : "Continuer"}
        onPress={handleContinue}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});
