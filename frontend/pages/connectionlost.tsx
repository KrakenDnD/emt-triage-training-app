import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function ConnectionLost() {
  const handleContinueOffline = () => {
    console.log('Continue offline pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1e3a5f', '#2c5282', '#3182ce']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Connection Lost!</Text>
            <Text style={styles.subtitle}>Sorry about that!</Text>
            <Text style={styles.subtitle}>Don't worry, you can:</Text>
            
            <View style={styles.iconRow}>
              <Text style={styles.emoji}>⚕️</Text>
              <View style={styles.optionsContainer}>
                <Text style={styles.option}>Continue offline</Text>
                <Text style={styles.option}>Try reconnecting</Text>
                <Text style={styles.option}>Save progress & exit</Text>
              </View>
              <Text style={styles.emoji}>⚕️</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleContinueOffline}
            >
              <Text style={styles.buttonText}>Continue Offline</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
        </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#d9dfe6',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    width: '90%',
    maxWidth: 380,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e3a5f',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#5a6c7d',
    marginBottom: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  emoji: {
    fontSize: 60,
    color: '#00A8E8',
  },
  optionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#1e3a5f',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  option: {
    fontSize: 13,
    color: '#1e3a5f',
    marginBottom: 4,
    fontWeight: '900',
  },
  button: {
    backgroundColor: '#2d5f3f',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});