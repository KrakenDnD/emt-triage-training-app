import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a365d', '#2c5282', '#3182ce']}
        style={styles.gradient}
      > 
        <View style={styles.card}>
          <Text style={styles.loadingTitle}>Loading...</Text>
          <Text style={styles.loadingSubtitle}>Preparing AI Scenario...</Text>
          
          <Text style={styles.emoji}>⚕️</Text>
        </View>
        
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
    paddingTop: 160,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#d9dfe6',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 100,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});