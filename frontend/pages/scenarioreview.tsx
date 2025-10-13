import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, MessageSquare, RotateCcw, ArrowRight } from 'lucide-react-native';

interface Review {
  score: string;
  stren1: string;
  stren2: string;
  stren3: string;
  weak1: string;
  weak2: string;
  weak3: string;
  review: string;
}

export default function ScenarioReview({ navigation }) {
  const Review: Review = {
    score: '90',
    stren1: 'Vitals',
    stren2: 'Bleeding Procedure',
    stren3: 'Patient Tagging',
    weak1: 'Patient Tagging',
    weak2: 'Taking Pulse',
    weak3: 'Bedside Manner',
    review: "You did a really solid job on this scenario. Your vitals were accurate and consistent, and your bleeding control was handled exactly the way it should be—quick, calm, and effective. You clearly know your procedures and how to apply them under pressure. That said, I'd like to see you focus a bit more on your patient interaction next time. Take a little extra time with your patient questioning and pulse taking, and work on keeping your tone and presence reassuring throughout. You've got the technical side down—now it's about bringing that human touch to match it. Great work—keep tightening up your communication, and you'll be operating at a professional level in no time.",
  };

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
    try {
      navigation.navigate('ScenarioSelect');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleRetry = () => {
    try {
      navigation.navigate('Home');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleExplain = () => {
    try {
      navigation.navigate('AIChatScreen'); //error
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Scenario Debrief</Text>
            <Text style={styles.headerSubtitle}>Performance Review & Feedback</Text>
          </View>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Overall Performance</Text>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreValue, { color: getScoreColor(Review.score) }]}>
                {Review.score}
              </Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <Text style={[styles.scoreBadge, { color: getScoreColor(Review.score) }]}>
              {getScoreLabel(Review.score)}
            </Text>
          </View>

          {/* Strengths Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingUp color="#10b981" size={24} />
              <Text style={styles.cardTitle}>Strengths</Text>
            </View>
            <View style={styles.itemList}>
              {[Review.stren1, Review.stren2, Review.stren3].map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#10b981' }]} />
                  <Text style={styles.listItemText}>{strength}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Areas for Improvement Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TrendingDown color="#f59e0b" size={24} />
              <Text style={styles.cardTitle}>Areas for Improvement</Text>
            </View>
            <View style={styles.itemList}>
              {[Review.weak1, Review.weak2, Review.weak3].map((weakness, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.listItemText}>{weakness}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* AI Review Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MessageSquare color="#2563eb" size={24} />
              <Text style={styles.cardTitle}>Detailed Feedback</Text>
            </View>
            <Text style={styles.reviewText}>{Review.review}</Text>
            
            <TouchableOpacity style={styles.explainButton} onPress={handleExplain}>
              <MessageSquare color="#2563eb" size={18} />
              <Text style={styles.explainButtonText}>Ask AI for clarification</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.retryButton]} 
              onPress={handleRetry}
            >
              <RotateCcw color="#64748b" size={20} />
              <Text style={styles.retryButtonText}>Retry Scenario</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.continueButton]} 
              onPress={handleContinue}
            >
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