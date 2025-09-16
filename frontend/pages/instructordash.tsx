import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Signup({navigation}) {
    const [status, setStatus] = useState('Please select status');
  return (
    <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
          <LinearGradient
            colors={['#1a365d', '#2c5282', '#3182ce']}
            style={styles.gradient}
          >
            <View style={styles.scrollContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Enter your credentials</Text>
              </View>
            <Text style={styles.title}>dashboard</Text>

              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🔐 dashboard</Text>
                <Text style={styles.cardText}>
                  dashboard functionality will be implemented here
                </Text>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
              </View>
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
  radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    lastRadioOption: {
      marginBottom: 0,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#1a365d',
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#4a5568',
    },
    radioText: {
      fontSize: 16,
      color: '#000000',
    },
    input: {
      height: 48,
      backgroundColor: '#e3e3e3',
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: '#0000',
    },
    inputError: {
      borderColor: '#c4140e',
    },
    entryField: {
      marginBottom: 70,
      width: '100%',
      flex: 1,
    },
    statusContainer: {
      marginBottom: 32,
    },
    statusLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#0000',
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#2c5282',
      marginBottom: 8,
    },
});