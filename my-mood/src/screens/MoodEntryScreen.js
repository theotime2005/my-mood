import { useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { submitMood } from "../adapters/api-adapter.js";
import { EMOTIONAL_STATES } from "../constants/moods.js";
import { getBaseUrl, getToken } from "../utils/storage.js";

export default function MoodEntryScreen({ navigation }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [motivation, setMotivation] = useState(5);
  const [loading, setLoading] = useState(false);

  const emotionalStateOptions = [
    { value: EMOTIONAL_STATES.HAPPY, label: "Joyeux" },
    { value: EMOTIONAL_STATES.SAD, label: "Triste" },
    { value: EMOTIONAL_STATES.ANGRY, label: "En colère" },
    { value: EMOTIONAL_STATES.RELAXED, label: "Détendu" },
    { value: EMOTIONAL_STATES.EXCITED, label: "Excité" },
  ];

  const motivationLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  async function handleSave() {
    if (!selectedEmotion) {
      Alert.alert("Erreur", "Veuillez sélectionner une émotion");
      return;
    }

    setLoading(true);
    const baseUrl = await getBaseUrl();
    const token = await getToken();

    const result = await submitMood({
      baseUrl,
      token,
      emotionalState: selectedEmotion,
      motivation,
    });

    if (result.success) {
      Alert.alert("Succès", "Votre humeur a été enregistrée", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home"),
        },
      ]);
    } else {
      Alert.alert("Erreur", result.message || "Impossible d'enregistrer votre humeur");
    }

    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Comment vous sentez-vous ?</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sélectionnez votre émotion :</Text>
          {emotionalStateOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.radioButton,
                selectedEmotion === option.value && styles.radioButtonSelected,
              ]}
              onPress={() => setSelectedEmotion(option.value)}
            >
              <View style={styles.radioCircle}>
                {selectedEmotion === option.value && <View style={styles.radioCircleSelected} />}
              </View>
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Niveau de motivation (1-10) :</Text>
          <View style={styles.motivationContainer}>
            {motivationLevels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.motivationButton,
                  motivation === level && styles.motivationButtonSelected,
                ]}
                onPress={() => setMotivation(level)}
              >
                <Text
                  style={[
                    styles.motivationButtonText,
                    motivation === level && styles.motivationButtonTextSelected,
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
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2196F3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radioCircleSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#2196F3",
  },
  radioLabel: {
    fontSize: 16,
  },
  motivationContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  motivationButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  motivationButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#2196F3",
  },
  motivationButtonText: {
    fontSize: 16,
    color: "#333",
  },
  motivationButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
});
