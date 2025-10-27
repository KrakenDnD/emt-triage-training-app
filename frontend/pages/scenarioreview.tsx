import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, MessageSquare, RotateCcw, ArrowRight } from 'lucide-react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface Review {
  score: string;
  strengths: string[];
  weaknesses: string[];
  review: string;
  actionsTaken?: string[];
}

export default function ScenarioReview({ navigation, route }) {
  const { userId = 'abc123', scenarioId = 'burnVictim01', review = null } = route.params || {};
  const [reviewData, setReviewData] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ScenarioReview received:', userId, scenarioId);

    const fetchReview = async () => {
      try {
        if (review) {
          console.log('✅ Using review from navigation');
          setReviewData(review);
        } else {
          const docRef = doc(db, 'scenarioReviews', scenarioId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setReviewData({
              score: data.score,
              strengths: data.strengths,
              weaknesses: data.weaknesses,
              review: data.review,
              actionsTaken: data.actionsTaken || [],
            });
          } else {
            console.warn('No review found in Firestore.');
          }
        }
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [userId, scenarioId]);

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 85) return '#10b981';
    if (numScore >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 85) return 'Excellent';
    if (numScore >= 70) return 'Good';
    return 'Needs Improvement';
  };

  const handleContinue = () => {
    navigation.navigate('ScenarioSelect', { userId });
  };

  const handleRetry = () => {
    navigation.navigate('ScenarioWork', { userId, scenarioId });
  };

  const handleExplain = () => {
    const actions = reviewData?.actionsTaken?.length
      ? reviewData.actionsTaken.join(', ')
      : 'none listed';

    const prompt = `In scenario ${scenarioId}, I received this feedback: "${reviewData?.review}". Here are the actions I took: ${actions}. What specific escalation step did I miss, and what should I have done differently as a responder?`;

    console.log('🧠 Prompt to AI:', prompt);

    navigation.navigate('AIChatScreen', { initialMessage: prompt, scenarioId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
          <View style={styles.scrollContent}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.headerSubtitle}>Loading review...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!reviewData) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
          <View style={styles.scrollContent}>
            <Text style={styles.headerTitle}>No Review Found</Text>
            <Text style={styles.headerSubtitle}>We couldn’t find feedback for this scenario.</Text>

            <TouchableOpacity style={[styles.actionButton, styles.retryButton]} onPress={handleRetry}>
              <RotateCcw color="#64748b" size={20} />
              <Text style={styles.retryButtonText}>Retry Scenario</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Scenario Debrief</Text>
            <Text style={styles.headerSubtitle}>Performance Review & Feedback</Text>
          </View>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Overall Performance</Text>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: getScoreColor(reviewData.score) }]}>
                {reviewData.score}
              </Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <Text style={[styles.scoreBadge, { color: getScoreColor(reviewData.score) }]}>
              {getScoreLabel(reviewData.score)}
            </Text>
          </View>

          {/* Strengths */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp color="#10b981" size={24} />
              <Text style={styles.cardTitle}>Strengths</Text>
            </View>
            <View style={styles.itemList}>
              {reviewData.strengths.map((s, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.listItemText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Weaknesses */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingDown color="#f59e0b" size={24} />
              <Text style={styles.cardTitle}>Areas for Improvement</Text>
            </View>
            <View style={styles.itemList}>
              {reviewData.weaknesses.map((w, i) => (
                <View key={i} style={styles.listItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.listItemText}>{w}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Actions Taken */}
          {reviewData.actionsTaken?.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <TrendingUp color="#3b82f6" size={24} />
                <Text style={styles.cardTitle}>Actions Taken</Text>
              </View>
              <View style={styles.itemList}>
                {reviewData.actionsTaken.map((action, i) => (
                  <View key={i} style={styles.listItem}>
                    <View style={[styles.bulletPoint, { backgroundColor: '#3b82f6' }]} />
                    <Text style={styles.listItemText}>{action}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* AI Review */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MessageSquare color="#2563eb" size={24} />
              <Text style={styles.cardTitle}>Detailed Feedback</Text>
            </View>
            <Text style={styles.reviewText}>{reviewData.review}</Text>

            <TouchableOpacity style={styles.explainButton} onPress={handleExplain}>
              <MessageSquare color="#2563eb" size={18} />
              <Text style={styles.explainButtonText}>Ask AI for clarification</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.retryButton]} onPress={handleRetry}>
              <RotateCcw color="#64748b" size={20} />
              <Text style={styles.retryButtonText}>Retry Scenario</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.continueButton]} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continue</Text>
              <ArrowRight color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
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
  scrollContent: {
    padding: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
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
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  scoreCircle: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 64,
  },
  scoreOutOf: {
    fontSize: 18,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 4,
  },
  scoreBadge: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  itemList: {
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
  },
  reviewText: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 24,
    marginBottom: 20,
  },
  explainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  explainButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  retryButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  retryButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#2563eb',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 40,
  },
});