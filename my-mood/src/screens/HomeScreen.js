import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, View } from "react-native";

import { USER_TYPE } from "../constants.js";
import { useUser } from "../contexts/UserContext.js";
import { deleteToken, removeBaseUrl } from "../utils/storage.js";

export default function HomeScreen({ navigation }) {
  const { user, loading } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
        <StatusBar style="auto" />
      </View>
    );
  }

  const canEnterMood = user && (user.userType === USER_TYPE.ADMIN || user.userType === USER_TYPE.EMPLOYER || user.userType === USER_TYPE.MANAGER);
  const canViewStatistics = user && user.userType === USER_TYPE.MANAGER;

  function handleLogoutPress() {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: () => confirmLogout(),
        },
      ],
      { cancelable: true },
    );
  }

  async function confirmLogout(removeUrl = false) {
    await deleteToken();
    setShowUserMenu(false);
    if (removeUrl) {
      await removeBaseUrl();
    }
    navigation.navigate("Welcome");
  }

  return (
    <View style={styles.container}>
      {canEnterMood && canViewStatistics ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>Bienvenue {user.firstname} !</Text>
          <View style={styles.buttonSpacing}>
            <Button
              title="Saisir mon humeur"
              onPress={() => navigation.navigate("MoodEntry")}
              testID="mood-entry-button"
            />
          </View>
          <Button
            title="Voir les statistiques"
            onPress={() => navigation.navigate("MoodStatistics")}
            testID="mood-statistics-button"
          />
        </View>
      ) : canEnterMood ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>Bienvenue {user.firstname} !</Text>
          <Button
            title="Saisir mon humeur"
            onPress={() => navigation.navigate("MoodEntry")}
            testID="mood-entry-button"
          />
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Impossible de joindre le serveur. Déconnectez-vous et réessayez.</Text>
          <Button title="Se déconnecter" onPress={() => confirmLogout(true)} testID="logout-button" />
        </View>
      )}

      {user && (
        <View style={styles.userMenuButtonContainer}>
          <Button
            title="Menu utilisateur"
            onPress={() => setShowUserMenu(true)}
            testID="user-menu-button"
          />
        </View>
      )}

      <Modal
        visible={showUserMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menu utilisateur</Text>
            <View style={styles.modalButtonContainer}>
              <Button
                title="Déconnexion"
                onPress={handleLogoutPress}
                color="#d9534f"
                testID="logout-button"
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <Button
                title="Fermer"
                onPress={() => setShowUserMenu(false)}
                testID="close-menu-button"
              />
            </View>
          </View>
        </View>
      </Modal>

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
  buttonSpacing: {
    marginBottom: 15,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    color: "#333",
  },
  userMenuButtonContainer: {
    position: "absolute",
    bottom: 40,
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    marginBottom: 10,
  },
});
