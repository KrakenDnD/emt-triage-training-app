// import React from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      <LinearGradient
        colors={['#1a365d', '#2c5282', '#3182ce']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>EMT Triage Training</Text>
            <Text style={styles.subtitle}>AI-Powered Emergency Medical Training</Text>
          </View>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🚑 Welcome to Your Training</Text>
            <Text style={styles.cardText}>
              Master emergency triage with interactive scenarios and AI guidance
            </Text>
            
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Start Training</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Interactive Scenarios</Text>
              <Text style={styles.featureDescription}>Practice with realistic patient cases</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🤖</Text>
              <Text style={styles.featureText}>AI Teaching Assistant</Text>
              <Text style={styles.featureDescription}>Personalized coaching and feedback</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📊</Text>
              <Text style={styles.featureText}>Progress Tracking</Text>
              <Text style={styles.featureDescription}>Monitor your learning journey</Text>
            </View>
          </View>

          <View style={styles.teamInfo}>
            <Text style={styles.teamTitle}>Development Team</Text>
            <Text style={styles.teamText}>CodeBlue Collective</Text>
            <Text style={styles.teamMembers}>
              Meghan Lawrence • Sophia Worsham • Daniel Hall
            </Text>
          </View>

          <View style={styles.status}>
            <Text style={styles.statusText}>🚧 Development Status: Week 1 of 10</Text>
            <Text style={styles.statusSubtext}>Foundation & Setup Phase</Text>
            <Text style={styles.versionText}>Version 0.1.0</Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
    textAlign: 'center',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3182ce',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
  },
  feature: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  featureText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  teamInfo: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
  },
  teamTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  teamText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  teamMembers: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  status: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  statusSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 5,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 5,
  },
});
