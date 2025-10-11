import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const fetchScenarios = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // simulates network delay
  
  // const response = await fetch(`https://your-api.com/users/${userId}/scenarios`);
  // return response.json();
  
  //mock data
  return [
    {
      id: '1',
      title: "Gladys's Day at the Beach",
      description: "Gladys's lost her phone at the beach! She accused the lifeguard of stealing it, who put her in a headlock for the accusation. An onlooker called 911 as the street fighter brawl occured.",
      difficulty: 'Easy',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: "Chris's Depressive Episode",
      description: "Chris had a particularly bad day at work after being told by his boss that he was a 'incompetent piece of trash'. He didn't feel safe alone after such an event, so he called 911.",
      difficulty: 'Easy',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: "Waterpark Fiasco",
      description: "The Mendez family thought their day at the waterpark would be uneventful. Unfortunely, little timmy fell out of a hole in a waterslide, landing on his brother, johnny.",
      difficulty: 'Medium',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: "Mass Casualty Event",
      description: "An Earthquake has occured and there are currently hundreds wounded and hundreds confirmed dead.",
      difficulty: 'Hard',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: "Mark's Bad Day",
      description: "Mark's hat flew over a fence with a 'keep out' sign. He decided to go get it, not realizing that a rollercoaster was rocketing towards him. Tiffany's leg made contact with Mark's head. The leg won.",
      difficulty: 'Extreme',
      isCompleted: true,
      createdAt: new Date().toISOString(),
    },
  ];
};

const getDifficultyColor = (difficulty) => {
  const colors = {
    easy: '#149067ff',
    medium: '#f59f0bff',
    hard: '#ee0d0dff',
    extreme: '#990606ff',
  };
  return colors[difficulty.toLowerCase()] || 'rgba(0, 0, 0, 0.6)';
};

const getDifficultyPastelColor = (difficulty) => {
  const colors = {
    easy: '#C8E6D5',
    medium: '#FFE4B5',
    hard: '#FFCCCB',
    extreme: '#E8B4B8',
  };
  return colors[difficulty.toLowerCase()] || '#E0E0E0';
};

const getDifficultyDarkColor = (difficulty) => {
  const colors = {
    easy: '#2D5F4A',
    medium: '#8B6914',
    hard: '#8B2C2C',
    extreme: '#5C1A1A',
  };
  return colors[difficulty.toLowerCase()] || '#4A4A4A';
};

const ScenarioCard = ({ scenario, onPress }) => (
  <TouchableOpacity
    style={[
      styles.section, 
      { backgroundColor: getDifficultyPastelColor(scenario.difficulty) }
    ]}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.tagContainer}>
      {scenario.isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✓ Completed</Text>
        </View>
      )}
      <View style={[styles.difficultyTag, { backgroundColor: getDifficultyColor(scenario.difficulty) }]}>
        <Text style={styles.difficultyText}>{scenario.difficulty}</Text>
      </View>
    </View>
    
    <View style={styles.sectionContent}>
      <View style={styles.textContainer}>
        <Text style={[styles.sectionTitle, { color: getDifficultyDarkColor(scenario.difficulty) }]}>
          {scenario.title}
        </Text>
        <Text style={[styles.sectionDescription, { color: getDifficultyDarkColor(scenario.difficulty) }]}>
          {scenario.description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ScenarioSelection = ({ navigation, route }) => {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = route?.params?.userId || 'current-user-id';

  useEffect(() => {
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

  const handleScenarioPress = (scenario) => {
    try {
      navigation.navigate('Review')//, { //REPLACE WHEN BACKEND IS FINISHED
    //    scenarioId: scenario.id,
    //    scenario: scenario
    //  });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <LinearGradient
          colors={['#2B4C7E', '#4A6FA5']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Select Your</Text>
          <Text style={styles.headerTitle}>Scenario...</Text>
        </LinearGradient>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2B4C7E" />
              <Text style={styles.loadingText}>Loading scenarios...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadScenarios}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                onPress={() => handleScenarioPress(scenario)}
              />
            ))
          )}
        </View>

        <LinearGradient
          colors={['#2B7BB9', '#3A8FCC']}
          style={styles.footer}
        >
          <Text style={styles.footerText}>Developed by CodeBlue Collective</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    position: 'relative',
    overflow: 'visible',
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B4C7E',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#1F3A5F',
    lineHeight: 20,
  },
  tagContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
  },
  difficultyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 5,
  },
  difficultyText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#149067ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    elevation: 5,
  },
  completedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#2B4C7E',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ee0d0dff',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2B4C7E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ScenarioSelection;