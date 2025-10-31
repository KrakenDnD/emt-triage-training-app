import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Clock, Users, AlertTriangle, Calendar, Award, TrendingUp } from 'lucide-react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const fetchCompletedScenarios = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '5',
      title: "Mark's Bad Day",
      description: "Mark's hat flew over a fence with a 'keep out' sign. He decided to go get it, not realizing that a rollercoaster was rocketing towards him. Tiffany's leg made contact with Mark's head. The leg won.",
      difficulty: 'Extreme',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      score: 95,
      timeSpent: '45 mins',
    },
    {
      id: '3',
      title: "Waterpark Fiasco",
      description: "The Mendez family thought their day at the waterpark would be uneventful. Unfortunely, little timmy fell out of a hole in a waterslide, landing on his brother, johnny.",
      difficulty: 'Medium',
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      score: 88,
      timeSpent: '32 mins',
    },
    {
      id: '2',
      title: "Chris's Depressive Episode",
      description: "Chris had a particularly bad day at work after being told by his boss that he was a 'incompetent piece of trash'. He didn't feel safe alone after such an event, so he called 911.",
      difficulty: 'Easy',
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      score: 92,
      timeSpent: '28 mins',
    },
    {
      id: '1',
      title: "Gladys's Day at the Beach",
      description: "Gladys's lost her phone at the beach! She accused the lifeguard of stealing it, who put her in a headlock for the accusation. An onlooker called 911 as the street fighter brawl occured.",
      difficulty: 'Easy',
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      score: 85,
      timeSpent: '25 mins',
    },
  ];
};

const fetchUserProfile = async (userId) => {
  const db = getFirestore();
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const data = userDoc.data();
    
    return {
      avgScore: data.avgScore || 0,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
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
  switch(difficulty.toLowerCase()) {
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

const getScoreColor = (score) => {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#f59e0b';
  return '#ef4444';
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
};

const HistoryCard = ({ scenario, onPress }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.cardHeader}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>{scenario.title}</Text>
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(scenario.score) }]}>
          <Award color="#ffffff" size={14} />
          <Text style={styles.scoreText}>{scenario.score}%</Text>
        </View>
      </View>
      
      <View style={styles.badges}>
        <View style={styles.completedBadge}>
          <CheckCircle color="#ffffff" size={14} />
          <Text style={styles.completedText}>Completed</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(scenario.difficulty) }]}>
          {getDifficultyIcon(scenario.difficulty)}
          <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
        </View>
      </View>
    </View>
    
    <Text style={styles.cardDescription}>{scenario.description}</Text>
    
    <View style={styles.cardFooter}>
      <View style={styles.metaInfo}>
        <View style={styles.metaItem}>
          <Calendar color="#64748b" size={14} />
          <Text style={styles.metaText}>{formatTimeAgo(scenario.completedAt)}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock color="#64748b" size={14} />
          <Text style={styles.metaText}>{scenario.timeSpent}</Text>
        </View>
      </View>
      <Text style={styles.reviewText}>View Details →</Text>
    </View>
  </TouchableOpacity>
);

const ScenarioHistory = ({ navigation, route }) => {
  const [scenarios, setScenarios] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid || route?.params?.userId || 'current-user-id';

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileData, scenariosData] = await Promise.all([
        fetchUserProfile(userId),
        fetchCompletedScenarios(userId)
      ]);
      
      setProfile(profileData);
      setScenarios(scenariosData);
    } catch (err) {
      setError('Failed to load history');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioPress = (scenario) => {
    try {
      navigation.navigate('Review');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const calculateAverageScore = () => {
    if (scenarios.length === 0) return 0;
    const total = scenarios.reduce((sum, s) => sum + s.score, 0);
    return Math.round(total / scenarios.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Training History</Text>
            <Text style={styles.headerSubtitle}>Review your completed scenarios</Text>
          </View>

          <View style={styles.content}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading history...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorCard}>
                <AlertTriangle color="#ef4444" size={48} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadHistory}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : scenarios.length === 0 ? (
              <View style={styles.emptyCard}>
                <TrendingUp color="#64748b" size={48} />
                <Text style={styles.emptyTitle}>No Completed Scenarios</Text>
                <Text style={styles.emptyText}>
                  Complete your first scenario to see it here!
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{scenarios.length}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{profile?.avgScore || 0}%</Text>
                    <Text style={styles.statLabel}>Avg Score</Text>
                  </View>
                </View>

                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Completions</Text>
                </View>

                {scenarios.map((scenario) => (
                  <HistoryCard
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 12,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
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
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
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

export default ScenarioHistory;