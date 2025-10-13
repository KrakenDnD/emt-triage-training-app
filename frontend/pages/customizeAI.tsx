import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Bot, RefreshCw } from 'lucide-react-native';

export default function CustomizeAI() {
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [scenarioFocus, setScenarioFocus] = useState(['Confidence Building']);
  const [patientCount, setPatientCount] = useState('Single Patient (Less Overwhelming)');
  const [timePressure, setTimePressure] = useState('Relaxed Timer');

  const currentRecommendation = "Advanced Trauma Scenarios";

  const toggleScenarioFocus = (focus) => {
    if (scenarioFocus.includes(focus)) {
      setScenarioFocus(scenarioFocus.filter(f => f !== focus));
    } else {
      setScenarioFocus([...scenarioFocus, focus]);
    }
  };

  const handleReset = () => {
    setDifficultyLevel('Beginner');
    setScenarioFocus(['Confidence Building']);
    setPatientCount('Single Patient (Less Overwhelming)');
    setTimePressure('Relaxed Timer');
  };

  const handleApply = () => {
    alert('AI preferences updated successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Customize AI</Text>
          </View>

          <View style={styles.content}>
            {/* Current Recommendation Card */}
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationLabel}>Current Recommendation:</Text>
              <Text style={styles.recommendationValue}>"{currentRecommendation}"</Text>
            </View>

            {/* Main Settings Card */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <Settings color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Adjust Your Preferences:</Text>
              </View>

              {/* Difficulty Level */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Difficulty Level:</Text>
                <View style={styles.optionsContainer}>
                  {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={styles.radioOption}
                      onPress={() => setDifficultyLevel(level)}
                    >
                      <View style={styles.radioButton}>
                        {difficultyLevel === level && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.optionText}>{level}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Scenario Focus */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Scenario Focus:</Text>
                <View style={styles.optionsContainer}>
                  {[
                    'Confidence Building',
                    'Speed Training',
                    'Complex Scenarios',
                    'Protocol Review'
                  ].map((focus) => (
                    <TouchableOpacity
                      key={focus}
                      style={styles.checkboxOption}
                      onPress={() => toggleScenarioFocus(focus)}
                    >
                      <View style={styles.checkbox}>
                        {scenarioFocus.includes(focus) && (
                          <View style={styles.checkboxChecked} />
                        )}
                      </View>
                      <Text style={styles.optionText}>{focus}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Patient Count Preference */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Patient Count Preference:</Text>
                <View style={styles.optionsContainer}>
                  {[
                    'Single Patient (Less Overwhelming)',
                    'Multiple Patients',
                    'Mass Casualty Events'
                  ].map((count) => (
                    <TouchableOpacity
                      key={count}
                      style={styles.radioOption}
                      onPress={() => setPatientCount(count)}
                    >
                      <View style={styles.radioButton}>
                        {patientCount === count && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.optionText}>{count}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Pressure */}
              <View style={styles.settingGroup}>
                <Text style={styles.settingLabel}>Time Pressure:</Text>
                <View style={styles.optionsContainer}>
                  {[
                    'No Timer',
                    'Relaxed Timer',
                    'Realistic Timer',
                    'High Pressure'
                  ].map((timer) => (
                    <TouchableOpacity
                      key={timer}
                      style={styles.radioOption}
                      onPress={() => setTimePressure(timer)}
                    >
                      <View style={styles.radioButton}>
                        {timePressure === timer && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.optionText}>{timer}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* AI Assistant Message */}
            <View style={styles.assistantCard}>
              <View style={styles.assistantIcon}>
                <Bot color="#2563eb" size={24} />
              </View>
              <Text style={styles.assistantText}>
                "I understand - building confidence first is a smart approach. I'll adjust my recommendations accordingly."
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.resetButton]}
                onPress={handleReset}
              >
                <RefreshCw color="#64748b" size={20} />
                <Text style={styles.resetButtonText}>Reset AI</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.applyButton]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply Changes</Text>
              </TouchableOpacity>
            </View>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  recommendationCard: {
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
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  recommendationValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  settingGroup: {
    marginBottom: 28,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#2563eb',
  },
  optionText: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '500',
  },
  assistantCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  assistantIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  resetButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  applyButton: {
    backgroundColor: '#2563eb',
  },
  resetButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 40,
  },
});