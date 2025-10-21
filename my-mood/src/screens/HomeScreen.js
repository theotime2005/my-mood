import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, View } from "react-native";

import { USER_TYPE } from "../constants.js";
import { useUser } from "../contexts/UserContext.js";
import { deleteToken } from "../utils/storage.js";

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

  const canEnterMood = user && (user.userType === USER_TYPE.ADMIN || user.userType === USER_TYPE.EMPLOYER);
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
          onPress: async () => {
            await deleteToken();
            setShowUserMenu(false);
            navigation.navigate("Welcome");
          },
        },
      ],
      { cancelable: true },
    );
  }

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
      ) : canViewStatistics ? (
        <View style={styles.buttonContainer}>
          <Text style={styles.welcomeText}>Bienvenue {user.firstname} !</Text>
          <Button
            title="Voir les statistiques"
            onPress={() => navigation.navigate("MoodStatistics")}
            testID="mood-statistics-button"
          />
        </View>
      ) : (
        <Text style={styles.text}>Hello world</Text>
      )}

      <View style={styles.userMenuButtonContainer}>
        <Button
          title="Menu utilisateur"
          onPress={() => setShowUserMenu(true)}
          testID="user-menu-button"
        />
      </View>

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
