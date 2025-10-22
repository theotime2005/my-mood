import Slider from "@react-native-community/slider";
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

export default function MoodEntryScreen({ navigation }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [selectedMotivation, setSelectedMotivation] = useState(5);
  const [loading, setLoading] = useState(false);

  function handleCancel() {
    navigation.goBack();
  }

  async function handleSave() {
    if (!selectedEmotion) {
      Alert.alert("Erreur", "Veuillez sélectionner une émotion");
      return;
    }

    if (selectedMotivation === null || selectedMotivation === undefined) {
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
            accessible={true}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedEmotion === value, selected: selectedEmotion === value }}
            accessibilityLabel={`Émotion ${EMOTION_LABELS[value]}`}
            accessibilityHint={selectedEmotion === value ? "Sélectionné" : "Appuyez pour sélectionner"}
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
        <View style={styles.motivationSliderContainer}>
          <Text style={styles.motivationValue} testID="motivation-value">
            {Math.round(selectedMotivation)}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={selectedMotivation}
            onValueChange={setSelectedMotivation}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#2196F3"
            testID="motivation-slider"
            accessible={true}
            accessibilityRole="adjustable"
            accessibilityLabel="Niveau de motivation"
            accessibilityValue={{
              min: 1,
              max: 10,
              now: Math.round(selectedMotivation),
              text: `Niveau de motivation ${Math.round(selectedMotivation)} sur 10`,
            }}
            accessibilityHint="Faites glisser pour ajuster le niveau de motivation de 1 à 10"
          />
          <View style={styles.motivationLabels}>
            <Text style={styles.motivationLabelText}>1</Text>
            <Text style={styles.motivationLabelText}>10</Text>
          </View>
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

      <View style={styles.buttonContainer}>
        <Button
          title="Annuler"
          onPress={handleCancel}
          disabled={loading}
          color="#888"
          testID="cancel-button"
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
  motivationSliderContainer: {
    paddingHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  motivationValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
    textAlign: "center",
    marginBottom: 10,
  },
  motivationLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  motivationLabelText: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});
