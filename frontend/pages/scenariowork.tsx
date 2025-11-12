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
import { ArrowLeft, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react-native';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';

const demoScenarios = {
  demo_1: {
    title: "Gladys's Day at the Beach",
    description: "Gladys accused the lifeguard of stealing her phone. A physical altercation followed. You're the responder.",
    question: "What's your first action on arrival?",
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
    question: 'What\'s your first move?',
    options: [
      { text: 'Control bleeding and check vitals', outcome: 'You stabilize the patient quickly.', score: 90 },
      { text: 'Move the crowd away', outcome: 'You improve safety but delay treatment.', score: 70 },
      { text: 'Tag the patient and wait for backup', outcome: 'You miss critical early care.', score: 60 },
      { text: 'Ask the family what happened', outcome: 'You gather info but delay intervention.', score: 65 },
    ],
  },
  demo_4: {
    title: 'Mass Casualty Event',
    description: 'An earthquake has left many wounded. You\'re leading triage.',
    question: 'What\'s your priority?',
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
    question: "What's your first action?",
    options: [
      { text: 'Secure the scene and check vitals', outcome: 'You act quickly and safely.', score: 88 },
      { text: 'Apply pressure to the head wound', outcome: 'You treat but miss scene safety.', score: 75 },
      { text: 'Tag the patient and call for help', outcome: 'You skip initial care.', score: 60 },
      { text: 'Ask bystanders what happened', outcome: 'You gather info but delay treatment.', score: 70 },
    ],
  },
};

export default function ScenarioWork({ navigation, route }) {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const { scenarioId } = route.params;
  const scenario = demoScenarios[scenarioId];

  const [selectedOption, setSelectedOption] = useState(null);
  const [notes, setNotes] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeout, setTimeoutFlag] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scenarioMeta, setScenarioMeta] = useState(null);
  const [startTime] = useState(new Date());

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
      
      // Calculate time spent in minutes
      const endTime = new Date();
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
      
      // Update totalTime in Firebase
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          totalTime: increment(durationMinutes)
        });
        console.log(`✅ Added ${durationMinutes} minutes to totalTime`);
      } catch (error) {
        console.error('Error updating totalTime:', error);
      }
      
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
          durationMinutes,
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

  const handleAutoSubmit = async () => {
    setSubmitted(true);
    
    // Calculate time spent in minutes
    const endTime = new Date();
    const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
    
    // Update totalTime in Firebase
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalTime: increment(durationMinutes)
      });
      console.log(`✅ Added ${durationMinutes} minutes to totalTime (auto-submit)`);
    } catch (error) {
      console.error('Error updating totalTime:', error);
    }
    
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

  const getTimerColor = () => {
    if (timeLeft > 30) return '#10b981';
    if (timeLeft > 10) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        {/* Fixed Timer Card - Always Visible */}
        <View style={styles.timerCard}>
          <Clock color={getTimerColor()} size={24} />
          <View style={styles.timerContent}>
            <Text style={styles.timerLabel}>Time Remaining</Text>
            <Text style={[styles.timerValue, { color: getTimerColor() }]}>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Text>
          </View>
          {timeout && (
            <View style={styles.timeoutBadge}>
              <AlertCircle color="#ffffff" size={14} />
              <Text style={styles.timeoutText}>Time's Up</Text>
            </View>
          )}
        </View>

        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft color="#ffffff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{scenarioMeta?.title || scenario.title}</Text>
            <Text style={styles.headerSubtitle}>Emergency Response Scenario</Text>
          </View>

          <View style={styles.content}>
            {/* Description Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Scenario Description</Text>
              <Text style={styles.description}>
                {scenarioMeta?.description || scenario.description}
              </Text>
            </View>

            {/* Question Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Your Decision</Text>
              <Text style={styles.question}>{scenario.question}</Text>

              <View style={styles.optionsContainer}>
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
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionRadio,
                        selectedOption?.text === option.text && styles.optionRadioSelected
                      ]}>
                        {selectedOption?.text === option.text && (
                          <View style={styles.optionRadioInner} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          selectedOption?.text === option.text && styles.optionTextSelected,
                        ]}
                      >
                        {option.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes Card */}
            <View style={styles.card}>
              <View style={styles.notesHeader}>
                <FileText color="#0f172a" size={20} />
                <Text style={styles.cardTitle}>Notes & Reasoning</Text>
              </View>
              <Text style={styles.notesSubtitle}>Optional: Document your thought process</Text>
              <TextInput
                style={styles.notesInput}
                multiline
                placeholder="Type your clinical reasoning here..."
                placeholderTextColor="#94a3b8"
                value={notes}
                onChangeText={setNotes}
                editable={!submitted}
              />
            </View>

            {/* Key Questions Card */}
            {scenarioMeta?.keyQuestions?.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Key Questions to Consider</Text>
                <View style={styles.keyQuestionsList}>
                  {scenarioMeta.keyQuestions.map((q, i) => (
                    <View key={i} style={styles.keyQuestionItem}>
                      <CheckCircle color="#2563eb" size={16} />
                      <Text style={styles.keyQuestionText}>{q}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Submit Button */}
            {!submitted ? (
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !selectedOption && styles.submitButtonDisabled
                ]}
                onPress={timeout ? handleAutoSubmit : handleSubmit}
                disabled={!selectedOption && !timeout}
              >
                <CheckCircle color="#ffffff" size={20} />
                <Text style={styles.submitButtonText}>
                  {timeout ? 'Submit Anyway' : 'Submit Response'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Analyzing your response...</Text>
              </View>
            )}
          </View>

          <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  timerCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  timerContent: {
    flex: 1,
    marginLeft: 16,
  },
  timerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  timerValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  timeoutBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  optionSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#2563eb',
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#1e40af',
    fontWeight: '600',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0f172a',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  keyQuestionsList: {
    gap: 12,
  },
  keyQuestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  keyQuestionText: {
    flex: 1,
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginTop: 32,
    marginBottom: 40,
  },
});