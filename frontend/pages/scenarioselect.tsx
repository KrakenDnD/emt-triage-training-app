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
import { CheckCircle, Clock, Users, AlertTriangle, Sparkles, ArrowLeft } from 'lucide-react-native';
import { getFunctions} from 'firebase/functions';
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
      return <Clock color="#ffffff" size={16} />;
    case 'medium':
      return <Users color="#ffffff" size={16} />;
    case 'hard':
      return <AlertTriangle color="#ffffff" size={16} />;
    case 'extreme':
      return <AlertTriangle color="#ffffff" size={16} />;
    default:
      return <Clock color="#ffffff" size={16} />;
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
      navigation.navigate('ScenarioWork', { userId, scenarioId });
    } else {
      Alert.alert('No completed scenario found');
    }
  };

  const handleScenarioPress = (scenario) => {
    const scenarioId = `demo_${scenario.id}`;

    if (!userId) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    navigation.navigate('ScenarioWork', {
      userId,
      scenarioId,
    });
  };

  const handleCreateAIScenario = () => {
    Alert.alert('AI scenario generation coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('StudentProfile')}
            >
              <ArrowLeft color="#ffffff" size={24} />
            </TouchableOpacity>
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
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <CheckCircle color="#ffffff" size={20} />
                    <Text style={styles.continueText}>Continue Previous</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.aiButton} onPress={handleCreateAIScenario}>
                    <Sparkles color="#ffffff" size={20} />
                    <Text style={styles.aiButtonText}>Create AI Scenario</Text>
                  </TouchableOpacity>
                </View>

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

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Available Scenarios</Text>
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  aiButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
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
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  completedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'flex-end',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
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

export default ScenarioSelection;