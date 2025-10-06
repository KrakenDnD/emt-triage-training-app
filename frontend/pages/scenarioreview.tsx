import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface Review {
  id: string;
  score: string;
  stren1: string;
  stren2: string;
  stren3: string;
  weak1: string;
  weak2: string;
  weak3: string;
  review: string;
}

export default function scenarioReview({ navigation }) {
  const Review: Review = {
    id: '1',
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

  const handleContinue = () => {
    try {
      navigation.navigate('Home'); //replace w scenario selection screen
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleRetry = () => {
    try {
      navigation.navigate('Home'); //replace w scenario screen
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleExplain = () => {
    try {
      navigation.navigate('Home'); //replace w ai screen
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a365d', '#2c5282', '#3182ce']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            {/* Header Section */}
            <Text style={styles.title}>Debrief</Text>
            <View style={styles.divider} />

            {/* Score Section */}
            <Text style={[styles.scoreText, { color: getScoreColor(Review.score) }]}>
              Overall Score: {Review.score}
            </Text>

            {/* Strengths/Weaknesses Table */}
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Strengths</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Weaknesses</Text>
                </View>
              </View>

              <View style={styles.tableDataRow}>
                <Text style={styles.tableCellLeft}>{Review.stren1}</Text>
                <Text style={styles.tableCellRight}>{Review.weak1}</Text>
              </View>
              <View style={styles.tableDataRow}>
                <Text style={styles.tableCellLeft}>{Review.stren2}</Text>
                <Text style={styles.tableCellRight}>{Review.weak2}</Text>
              </View>
              <View style={[styles.tableDataRow, styles.lastRow]}>
                <Text style={styles.tableCellLeft}>{Review.stren3}</Text>
                <Text style={styles.tableCellRight}>{Review.weak3}</Text>
              </View>
            </View>

            {/* AI Review Section */}
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>AI Review</Text>
            <Text style={styles.reviewText}>{Review.review}</Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleExplain}>
                <Text style={styles.buttonText}>AI, explain it further</Text>
              </TouchableOpacity>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.button} onPress={handleRetry}>
                  <Text style={styles.buttonText}>Retry</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleContinue}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 38,
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: 0,
    letterSpacing: -0.5,
  },
  divider: {
    width: '100%',
    height: 3,
    backgroundColor: '#1a365d',
    marginVertical: 20,
    borderRadius: 2,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  table: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#3182ce',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 14,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  tableDataRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableCellLeft: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#334155',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  tableCellRight: {
    flex: 1,
    padding: 14,
    fontSize: 15,
    color: '#334155',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    textAlign: 'left',
    width: '100%',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3182ce',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
    opacity: 0.9,
  },
});