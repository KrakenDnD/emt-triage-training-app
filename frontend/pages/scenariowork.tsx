import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

const demoScenarios = {
  demo_1: {
    title: "Gladys's Day at the Beach",
    description:
      "Gladys accused the lifeguard of stealing her phone. A physical altercation followed. You're the responder.",
    question: "What’s your first action on arrival?",
    options: [
      { text: 'Separate the individuals and assess for injuries', outcome: 'You de-escalated the situation and ensured safety.', score: 90 },
      { text: 'Ask Gladys to calm down', outcome: 'Gladys escalates further, feeling unheard.', score: 65 },
      { text: 'Detain the lifeguard immediately', outcome: 'You acted prematurely without assessing the scene.', score: 50 },
      { text: 'Call for backup before engaging', outcome: 'You delayed intervention, risking further harm.', score: 70 },
    ],
  },
  // demo_2 through demo_5 unchanged...
};

export default function ScenarioWork({ navigation, route }) {
  const { userId, scenarioId } = route.params;
  const scenario = demoScenarios[scenarioId];

  const [selectedOption, setSelectedOption] = useState(null);
  const [notes, setNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeout, setTimeoutFlag] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scenarioMeta, setScenarioMeta] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeoutFlag(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchScenarioMeta = async () => {
      try {
        const docRef = doc(db, 'scenarios', scenarioId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setScenarioMeta(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching scenario metadata:', error);
      }
    };
    fetchScenarioMeta();
  }, [scenarioId]);

  const handleSubmit = async () => {
    if (!selectedOption) {
      Alert.alert('Please select an option before submitting.');
      return;
    }

    try {
      setSubmitted(true);
      await fetch('https://us-central1-emt-triage-training-app.cloudfunctions.net/api/generate-scenario-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          scenarioId,
          selectedOption: selectedOption.text,
          notes,
          scenarioDescription: scenarioMeta?.description || scenario.description,
          keyQuestions: scenarioMeta?.keyQuestions || [],
        }),
      });

      navigation.navigate('ScenarioReview', { userId, scenarioId });
    } catch (error) {
      console.error('Error submitting scenario:', error);
      Alert.alert('Failed to submit scenario');
      setSubmitted(false);
    }
  };

  const handleAutoSubmit = () => {
    setSubmitted(true);
    navigation.navigate('ScenarioReview', { userId, scenarioId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{scenarioMeta?.title || scenario.title}</Text>
          <Text style={styles.description}>{scenarioMeta?.description || scenario.description}</Text>

          <Text style={styles.timer}>Time left: {timeLeft}s</Text>

          <Text style={styles.question}>{scenario.question}</Text>
          {scenario.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption?.text === option.text && styles.optionSelected,
              ]}
              onPress={() => setSelectedOption(option)}
              disabled={submitted}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption?.text === option.text && styles.optionTextSelected,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.notesLabel}>Add notes or reasoning (optional):</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            placeholder="Type your thoughts here..."
            placeholderTextColor="#94a3b8"
            value={notes}
            onChangeText={setNotes}
            editable={!submitted}
          />

          {scenarioMeta?.keyQuestions?.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.notesLabel}>Key Questions to Consider:</Text>
              {scenarioMeta.keyQuestions.map((q, i) => (
                <Text key={i} style={styles.listItemText}>• {q}</Text>
              ))}
            </View>
          )}

          {!submitted && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={timeout ? handleAutoSubmit : handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {timeout ? 'Submit Anyway' : 'Submit Scenario'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#cbd5e1',
    marginBottom: 24,
    lineHeight: 24,
  },
  timer: {
    fontSize: 16,
    color: '#fbbf24',
    marginBottom: 12,
    fontWeight: '600',
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#2563eb',
  },
  optionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  optionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  notesLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    padding: 12,
    borderRadius: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  listItemText: {
    fontSize: 15,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  submitButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
