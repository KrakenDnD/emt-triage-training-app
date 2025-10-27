import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const demoScenarios = {
  demo_1: {
    title: "Gladys's Day at the Beach",
    description: "Gladys accused the lifeguard of stealing her phone. A physical altercation followed. You're the responder.",
    question: "What’s your first action on arrival?",
    options: [
      { text: 'Separate the individuals and assess for injuries', outcome: 'You de-escalated the situation and ensured safety.', score: 90 },
      { text: 'Ask Gladys to calm down', outcome: 'Gladys escalates further, feeling unheard.', score: 65 },
      { text: 'Detain the lifeguard immediately', outcome: 'You acted prematurely without assessing the scene.', score: 50 },
      { text: 'Call for backup before engaging', outcome: 'You delayed intervention, risking further harm.', score: 70 },
    ],
  },
  demo_2: {
    title: "Chris's Depressive Episode",
    description: "Chris had a bad day at work and called 911 feeling unsafe. You're the responder.",
    question: "How do you approach Chris?",
    options: [
      { text: 'Speak calmly and assess his mental state', outcome: 'You build trust and gather key info.', score: 85 },
      { text: 'Ask him to explain what happened', outcome: 'He feels overwhelmed and shuts down.', score: 60 },
      { text: 'Call for psychiatric backup immediately', outcome: 'You escalate too quickly without rapport.', score: 70 },
      { text: 'Tell him to breathe and relax', outcome: 'Helpful but lacks full assessment.', score: 75 },
    ],
  },
  demo_3: {
    title: 'Waterpark Fiasco',
    description: 'Timmy fell from a waterslide onto Johnny. You arrive at a chaotic scene.',
    question: 'What’s your first move?',
    options: [
      { text: 'Control bleeding and check vitals', outcome: 'You stabilize the patient quickly.', score: 90 },
      { text: 'Move the crowd away', outcome: 'You improve safety but delay treatment.', score: 70 },
      { text: 'Tag the patient and wait for backup', outcome: 'You miss critical early care.', score: 60 },
      { text: 'Ask the family what happened', outcome: 'You gather info but delay intervention.', score: 65 },
    ],
  },
  demo_4: {
    title: 'Mass Casualty Event',
    description: 'An earthquake has left many wounded. You’re leading triage.',
    question: 'What’s your priority?',
    options: [
      { text: 'Triage and tag patients by severity', outcome: 'You organize care effectively.', score: 92 },
      { text: 'Secure unstable structures', outcome: 'You reduce risk but delay triage.', score: 80 },
      { text: 'Call for mass casualty backup', outcome: 'Important but not immediate care.', score: 75 },
      { text: 'Comfort the most injured patient', outcome: 'Compassionate but inefficient triage.', score: 65 },
    ],
  },
  demo_5: {
    title: "Mark's Bad Day",
    description: "Mark was hit by a rollercoaster. You arrive to assess the scene.",
    question: "What’s your first action?",
    options: [
      { text: 'Secure the scene and check vitals', outcome: 'You act quickly and safely.', score: 88 },
      { text: 'Apply pressure to the head wound', outcome: 'You treat but miss scene safety.', score: 75 },
      { text: 'Tag the patient and call for help', outcome: 'You skip initial care.', score: 60 },
      { text: 'Ask bystanders what happened', outcome: 'You gather info but delay treatment.', score: 70 },
    ],
  },
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
      const response = await fetch('https://us-central1-emt-triage-training-app.cloudfunctions.net/api/generate-scenario-review', {
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

      const result = await response.json();
      console.log('✅ Review result:', result);

      if (result.success && result.review) {
        navigation.navigate('ScenarioReview', {
          userId,
          scenarioId,
          review: result.review,
        });
      } else {
        console.warn('⚠️ Review generation failed — using fallback');
        const fallbackReview = {
          score: selectedOption.score.toString(),
          strengths: ['Calm demeanor'],
          weaknesses: ['Missed escalation'],
          review: 'Fallback review: AI was unable to generate a detailed response.',
          actionsTaken: [selectedOption.text, ...notes.split(',')],
        };
        console.log('➡️ Navigating with fallback review:', fallbackReview);
        navigation.navigate('ScenarioReview', {
          userId,
          scenarioId,
          review: fallbackReview,
        });
      }
    } catch (error) {
      console.error('Error submitting scenario:', error);
      Alert.alert('Failed to submit scenario');
      setSubmitted(false);
    }
  };

  const handleAutoSubmit = () => {
    setSubmitted(true);
    navigation.navigate('ScenarioReview', {
      userId,
      scenarioId,
      review: {
        score: selectedOption?.score?.toString() || '65',
        strengths: ['Calm demeanor'],
        weaknesses: ['Missed escalation'],
        review: 'Auto-submitted fallback review due to timeout.',
        actionsTaken: [selectedOption?.text || 'No action selected', ...notes.split(',')],
      },
    });
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

          {!submitted ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={timeout ? handleAutoSubmit : handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {timeout ? 'Submit Anyway' : 'Submit Scenario'}
              </Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 24 }} />
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
