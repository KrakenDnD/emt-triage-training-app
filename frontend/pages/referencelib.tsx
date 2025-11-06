import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Heart, Users, Clipboard, Pill, BookMarked, ChevronRight } from 'lucide-react-native';

const ReferenceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  iconColor, 
  iconBackgroundColor, 
  onPress 
}) => (
  <TouchableOpacity 
    style={styles.card}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Icon color={iconColor} size={24} />
      </View>
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <ChevronRight color="#cbd5e1" size={24} />
    </View>
    <Text style={styles.cardDescription}>{description}</Text>
  </TouchableOpacity>
);

const ReferenceLibrary = ({ navigation }) => {
  const handleSectionPress = (route) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleMedicalConditionsPress = () => {
    navigation.navigate('Loading');
    setTimeout(() => {
      navigation.replace('Conditions');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reference Library</Text>
            <Text style={styles.headerSubtitle}>Essential resources at your fingertips</Text>
          </View>

          <View style={styles.content}>
            <ReferenceCard
              title="Medical Conditions Guide"
              description="Quickly reference the START and JumpSTART triage systems to prioritize patients effectively during mass casualty incidents. Built for speed and accuracy in chaotic environments."
              icon={BookOpen}
              iconColor="#2563eb"
              iconBackgroundColor="#2563eb15"
              onPress={handleMedicalConditionsPress}
            />

            <ReferenceCard
              title="Mental Health & Wellness"
              description="Training and working in emergency medical services can be emotionally challenging. If you or someone you know needs support, click here."
              icon={Heart}
              iconColor="#ec4899"
              iconBackgroundColor="#ec489915"
              onPress={() => handleSectionPress('Home')}
            />

            <ReferenceCard
              title="Triage Protocols"
              description="Quickly reference the START and JumpSTART triage systems to prioritize patients effectively during mass casualty incidents. Built for speed and accuracy in chaotic environments."
              icon={Users}
              iconColor="#8b5cf6"
              iconBackgroundColor="#8b5cf615"
              onPress={() => handleSectionPress('Home')}
            />

            <ReferenceCard
              title="Medical Procedures Reference"
              description="Step-by-step guides to common prehospital procedures—ideal for review, practice, quick checks in the field or during simulations."
              icon={Clipboard}
              iconColor="#10b981"
              iconBackgroundColor="#10b98115"
              onPress={() => handleSectionPress('Home')}
            />

            <ReferenceCard
              title="Emergency Medications Guide"
              description="An at-a-glance reference for commonly used EMS medications, including indications, dosages, contraindications, and side effects—made for fast, informed decisions."
              icon={Pill}
              iconColor="#f59e0b"
              iconBackgroundColor="#f59e0b15"
              onPress={() => handleSectionPress('Home')}
            />

            <ReferenceCard
              title="Glossary of Terms"
              description="Look up key EMS terms, acronyms, and concepts to build your vocabulary and deepen your understanding of emergency medical care."
              icon={BookMarked}
              iconColor="#06b6d4"
              iconBackgroundColor="#06b6d415"
              onPress={() => handleSectionPress('Glossary')}
            />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDescription: {
    fontSize: 15,
    color: '#64748b',
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

export default ReferenceLibrary;