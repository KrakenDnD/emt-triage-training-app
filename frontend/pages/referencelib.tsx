import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const ReferenceLibrary = ({ navigation }) => {
  const sections = [
    {
      title: 'Medical Conditions Guide',
      description: 'Quickly reference the START and JumpSTART triage systems to prioritize patients effectively during mass casualty incidents. Built for speed and accuracy in chaotic environments.',
      bgColor: '#B8C5D6',
      route: 'Conditions',
    },
    {
      title: 'Mental Health & Wellness',
      description: 'Training and working in emergency medical services can be emotionally challenging. If you or someone you know needs support, click here.',
      bgColor: '#C8CDD4',
      route: 'Home',
    },
    {
      title: 'Triage Protocols',
      description: 'Quickly reference the START and JumpSTART triage systems to prioritize patients effectively during mass casualty incidents. Built for speed and accuracy in chaotic environments.',
      bgColor: '#B8C5D6',
      route: 'Home',
    },
    {
      title: 'Medical Procedures Reference',
      description: 'Step-by-step guides to common prehospital procedures—ideal for review, practice, quick checks in the field or during simulations.',
      bgColor: '#C8CDD4',
      route: 'Home',
    },
    {
      title: 'Emergency Medications Guide',
      description: 'An at-a-glance reference for commonly used EMS medications, including indications, dosages, contraindications, and side effects—made for fast, informed decisions.',
      bgColor: '#B8C5D6',
      route: 'Home',
    },
    {
      title: 'Glossary of Terms',
      description: 'Look up key EMS terms, acronyms, and concepts to build your vocabulary and deepen your understanding of emergency medical care.',
      bgColor: '#C8CDD4',
      route: 'Glossary',
    },
  ];

  const handleSectionPress = (route) => {
  try {
    navigation.navigate(route);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        {/* Header */}
        <LinearGradient
          colors={['#2B4C7E', '#4A6FA5']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Reference</Text>
          <Text style={styles.headerTitle}>Library</Text>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.content}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.section, { backgroundColor: section.bgColor }]}
              activeOpacity={0.7}
              onPress={() => handleSectionPress(section.route)}
            >
              <View style={styles.sectionContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
                <View style={styles.arrow} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
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
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: '#59c930ff',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
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

export default ReferenceLibrary