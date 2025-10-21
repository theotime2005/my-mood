import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";

import { getMoodStatistics } from "../adapters/api-adapter.js";
import { EMOTIONAL_STATES } from "../constants.js";
import { getBaseUrl, getToken } from "../utils/storage.js";

const EMOTIONAL_STATE_LABELS = {
  HAPPY: "😊 Heureux",
  SAD: "😢 Triste",
  ANGRY: "😠 En colère",
  RELAXED: "😌 Détendu",
  EXCITED: "🤩 Excité",
};

const EMOTIONAL_STATE_COLORS = {
  HAPPY: "#4CAF50",
  SAD: "#2196F3",
  ANGRY: "#F44336",
  RELAXED: "#9C27B0",
  EXCITED: "#FF9800",
};

export default function MoodStatisticsScreen({ navigation }) {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    async function fetchStatistics() {
      try {
        const baseUrl = await getBaseUrl();
        const token = await getToken();

        if (baseUrl && token) {
          const result = await getMoodStatistics({ baseUrl, token });
          if (result.success) {
            setStatistics(result.data);
          } else {
            Alert.alert("Erreur", result.message || "Impossible de récupérer les statistiques");
          }
        }
      } catch (_error) {
        Alert.alert("Erreur", "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    }

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
        <StatusBar style="auto" />
      </View>
    );
  }

  if (!statistics) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aucune statistique disponible</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  const emotionalStateKeys = Object.keys(EMOTIONAL_STATES);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistiques du jour</Text>
        <Text style={styles.subtitle}>État émotionnel des collaborateurs</Text>

        <View style={styles.statsContainer}>
          {emotionalStateKeys.map((key) => {
            const stat = statistics[key];
            const label = EMOTIONAL_STATE_LABELS[key];
            const color = EMOTIONAL_STATE_COLORS[key];
            const percentage = stat?.percentage || 0;
            const averageMotivation = stat?.averageMotivation;

            return (
              <View key={key} style={styles.statCard}>
                <View style={[styles.colorBar, { backgroundColor: color }]} />
                <View style={styles.statContent}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <View style={styles.statDetailsRow}>
                    <View style={styles.statDetail}>
                      <Text style={styles.statValue}>{percentage.toFixed(1)}%</Text>
                      <Text style={styles.statDetailLabel}>des humeurs</Text>
                    </View>
                    {averageMotivation !== null && (
                      <View style={styles.statDetail}>
                        <Text style={styles.statValue}>{averageMotivation.toFixed(1)}/10</Text>
                        <Text style={styles.statDetailLabel}>motivation moyenne</Text>
                      </View>
                    )}
                  </View>
                  {percentage > 0 && (
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${percentage}%`, backgroundColor: color },
                        ]}
                      />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.backButtonContainer}>
          <Button
            title="Retour à l'accueil"
            onPress={() => navigation.navigate("Home")}
            testID="back-to-home-button"
          />
        </View>

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  statsContainer: {
    gap: 16,
  },
  statCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
  },
  colorBar: {
    width: 8,
  },
  statContent: {
    flex: 1,
    padding: 16,
  },
  statLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  statDetailsRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 24,
    marginBottom: 12,
  },
  statDetail: {
    alignItems: "flex-start",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statDetailLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  backButtonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});
