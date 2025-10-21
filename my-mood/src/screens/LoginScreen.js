import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import { login } from "../adapters/api-adapter.js";
import { useUser } from "../contexts/UserContext.js";
import { getBaseUrl, saveToken } from "../utils/storage.js";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useUser();

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    const baseUrl = await getBaseUrl();
    const result = await login({ baseUrl, email: email.trim(), password });

    if (result.success) {
      await saveToken(result.token);
      // After saving the token we force-refresh the user info so the app
      // has the current user before navigating to Home. This prevents the
      // Home screen from rendering without user data on first login.
      try {
        await refreshUser();
      } catch (_err) {
        Alert.alert(
          "Erreur",
          "Impossible de charger le profil utilisateur. Veuillez réessayer.",
        );
      }
      navigation.navigate("Home");
    } else {
      Alert.alert("Erreur", result.message || "Email ou mot de passe incorrect");
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title={loading ? "Connexion..." : "Se connecter"}
        onPress={handleLogin}
        disabled={loading}
      />

      <View style={styles.urlChangeContainer}>
        <Text style={styles.urlChangeText}>Mauvaise URL ?</Text>
        <Button
          title="Changer d'URL"
          onPress={() => navigation.navigate("Welcome")}
          color="#007AFF"
        />
      </View>
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
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  urlChangeContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  urlChangeText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
});
