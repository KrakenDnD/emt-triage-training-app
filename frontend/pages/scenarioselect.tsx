import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';


const fetchScenarios = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      title: "Gladys's Day at the Beach",
      description:
        "Gladys lost her phone at the beach! She accused the lifeguard of stealing it, who put her in a headlock for the accusation. An onlooker called 911 as the street fighter brawl occurred.",
      difficulty: 'Easy',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: "Chris's Depressive Episode",
      description:
        "Chris had a bad day at work after being told by his boss that he was 'an incompetent piece of trash'. He didn't feel safe alone after such an event, so he called 911.",
      difficulty: 'Easy',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Waterpark Fiasco',
      description:
        'The Mendez family thought their day at the waterpark would be uneventful. Unfortunately, little Timmy fell out of a hole in a waterslide, landing on his brother Johnny.',
      difficulty: 'Medium',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Mass Casualty Event',
      description:
        'An earthquake has occurred and there are currently hundreds wounded and hundreds confirmed dead.',
      difficulty: 'Hard',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: "Mark's Bad Day",
      description:
        "Mark's hat flew over a fence with a 'keep out' sign. He decided to go get it, not realizing that a rollercoaster was rocketing towards him. Tiffany's leg made contact with Mark's head. The leg won.",
      difficulty: 'Extreme',
      isCompleted: true,
      createdAt: new Date().toISOString(),
    },
  ];
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#10b981',
    medium: '#f59e0b',
    hard: '#ef4444',
    extreme: '#991b1b',
  };
  return colors[difficulty.toLowerCase()] || '#64748b';
};

const getDifficultyIcon = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return <Clock color="#10b981" size={16} />;
    case 'medium':
      return <Users color="#f59e0b" size={16} />;
    case 'hard':
    case 'extreme':
      return <AlertTriangle color="#ef4444" size={16} />;
    default:
      return <Clock color="#64748b" size={16} />;
  }
};

const ScenarioCard = ({ scenario, onPress }) => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{scenario.title}</Text>
      <View style={styles.badges}>
        {scenario.isCompleted && (
          <View style={styles.completedBadge}>
            <CheckCircle color="#ffffff" size={14} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(scenario.difficulty) },
          ]}
        >
          {getDifficultyIcon(scenario.difficulty)}
          <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
        </View>
      </View>
    </View>
    <Text style={styles.cardDescription}>{scenario.description}</Text>
    <View style={styles.cardFooter}>
      <Text style={styles.startText}>Start Scenario →</Text>
    </View>
  </TouchableOpacity>
);

const ScenarioSelection = ({ navigation, route }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = route?.params?.userId || 'current-user-id';

  useEffect(() => {
    console.log('ScenarioSelect received userId:', userId);
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchScenarios(userId);
      setScenarios(data);
    } catch (err) {
      setError('Failed to load scenarios');
      console.error('Error loading scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    const lastCompleted = scenarios.find((s) => s.isCompleted);
    if (lastCompleted) {
      const scenarioId = `demo_${lastCompleted.id}`;
      navigation.navigate('ScenarioReview', { userId, scenarioId });
    } else {
      Alert.alert('No completed scenario found');
    }
  };

  const handleScenarioPress = async (scenario) => {
  const scenarioId = `demo_${scenario.id}`;
  const prompt = scenario.description;
  const userId = getAuth().currentUser?.uid;

  if (!userId) {
    Alert.alert('Error', 'User not authenticated');
    return;
  }

  try {
    setLoading(true);
    const functions = getFunctions();
    const aiRespond = httpsCallable(functions, 'aiRespond');

    const result = await aiRespond({
      userId,
      scenarioId,
      prompt,
      conversationHistory: [], // optional
    });

    const { response } = result.data as { response: string };

    navigation.navigate('ScenarioReview', {
      userId,
      scenarioId,
      aiResponse: response,
    });
  } catch (error) {
    console.error('❌ AI error:', error);
    Alert.alert('AI Error', 'Failed to generate review. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const handleCreateAIScenario = () => {
    Alert.alert('AI scenario generation coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Your Scenario</Text>
            <Text style={styles.headerSubtitle}>Choose a training scenario to begin</Text>
          </View>

          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading scenarios...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorCard}>
                <AlertTriangle color="#ef4444" size={48} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadScenarios}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                  <Text style={styles.continueText}>Continue Previous Scenario</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.aiButton} onPress={handleCreateAIScenario}>
                  <Text style={styles.aiButtonText}>🧠 Create AI Scenario</Text>
                </TouchableOpacity>

                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{scenarios.length}</Text>
                    <Text style={styles.statLabel}>Total Scenarios</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>
                      {scenarios.filter((s) => s.isCompleted).length}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                </View>

                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onPress={() => handleScenarioPress(scenario)}
                  />
                ))}
              </>
            )}
          </View>

          <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorCard: {
    alignItems: 'center',
    marginTop: 40,
  },
  errorText: {
    color: '#fff',
    marginVertical: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#1a365d',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  continueText: {
    color: '#1a365d',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  aiButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  completedText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 12,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  startText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 40,
  },
});
export default ScenarioSelection;