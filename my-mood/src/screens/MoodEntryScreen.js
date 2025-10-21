import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { saveMood } from "../adapters/api-adapter.js";
import { EMOTIONAL_STATES } from "../constants.js";
import { getBaseUrl, getToken } from "../utils/storage.js";

const EMOTION_LABELS = {
  [EMOTIONAL_STATES.HAPPY]: "😊 Heureux",
  [EMOTIONAL_STATES.SAD]: "😢 Triste",
  [EMOTIONAL_STATES.ANGRY]: "😠 En colère",
  [EMOTIONAL_STATES.RELAXED]: "😌 Détendu",
  [EMOTIONAL_STATES.EXCITED]: "😃 Excité",
};

const MOTIVATION_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function MoodEntryScreen({ navigation }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedMotivation, setSelectedMotivation] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!selectedEmotion) {
      Alert.alert("Erreur", "Veuillez sélectionner une émotion");
      return;
    }

    if (!selectedMotivation) {
      Alert.alert("Erreur", "Veuillez sélectionner un niveau de motivation");
      return;
    }

    setLoading(true);
    const baseUrl = await getBaseUrl();
    const token = await getToken();

    const result = await saveMood({
      baseUrl,
      token,
      emotionalState: selectedEmotion,
      motivation: selectedMotivation,
    });

    setLoading(false);

    if (result.success) {
      Alert.alert("Succès", "Votre humeur a été enregistrée", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ]);
    } else {
      Alert.alert("Erreur", result.message || "Une erreur est survenue");
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Comment vous sentez-vous aujourd&apos;hui ?</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sélectionnez votre émotion :</Text>
        {Object.entries(EMOTIONAL_STATES).map(([key, value]) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.emotionButton,
              selectedEmotion === value && styles.emotionButtonSelected,
            ]}
            onPress={() => setSelectedEmotion(value)}
            testID={`emotion-${value}`}
          >
            <Text
              style={[
                styles.emotionText,
                selectedEmotion === value && styles.emotionTextSelected,
              ]}
            >
              {EMOTION_LABELS[value]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Niveau de motivation (1-10) :</Text>
        <View style={styles.motivationGrid}>
          {MOTIVATION_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.motivationButton,
                selectedMotivation === level && styles.motivationButtonSelected,
              ]}
              onPress={() => setSelectedMotivation(level)}
              testID={`motivation-${level}`}
            >
              <Text
                style={[
                  styles.motivationText,
                  selectedMotivation === level && styles.motivationTextSelected,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Enregistrement..." : "Enregistrer"}
          onPress={handleSave}
          disabled={loading}
          testID="save-button"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#555",
  },
  emotionButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  emotionButtonSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  emotionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  emotionTextSelected: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  motivationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  motivationButton: {
    width: "18%",
    aspectRatio: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  motivationButtonSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  motivationText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  motivationTextSelected: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
