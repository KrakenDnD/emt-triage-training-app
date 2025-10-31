import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GraduationCap, Users, BookOpen, Send } from 'lucide-react-native';

const NavigationButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <View style={styles.navButtonContent}>
      <Text style={styles.navButtonText}>{title}</Text>
      <Text style={styles.navButtonArrow}>→</Text>
    </View>
  </TouchableOpacity>
);

const ClassButton = ({ className, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.classButton,
      isSelected && styles.classButtonSelected
    ]}
    onPress={onPress}
  >
    <Text style={[
      styles.classButtonText,
      isSelected && styles.classButtonTextSelected
    ]}>
      {className}
    </Text>
  </TouchableOpacity>
);

const PrimaryButton = ({ title, icon: Icon, onPress }) => (
  <TouchableOpacity style={styles.saveButton} onPress={onPress}>
    {Icon && <Icon color="#ffffff" size={18} />}
    <Text style={styles.saveButtonText}>{title}</Text>
  </TouchableOpacity>
);

export default function InstructorProfile({ navigation }) {
  const [selectedClass, setSelectedClass] = useState('Class #1');
  const [homeworkText, setHomeworkText] = useState('');

  const classes = ['Class #1', 'Class #2', 'Class #3', 'Class #4'];

  const classData = {
    'Class #1': {
      students: [
        { last: 'Smith', first: 'John', time: '2.5', number: '#001', school: 'Central High' },
        { last: 'Johnson', first: 'Emma', time: '3', number: '#002', school: 'Central High' },
        { last: 'Williams', first: 'Michael', time: '1', number: '#003', school: 'West Academy' },
        { last: 'Brown', first: 'Sarah', time: '1.4', number: '#004', school: 'Central High' },
        { last: 'Jones', first: 'David', time: '10', number: '#005', school: 'East Prep' },
      ],
      analytics: [
        { name: 'Test1', score: 85, average: 75 },
        { name: 'Test2', score: 70, average: 65 },
        { name: 'Test3', score: 60, average: 68 },
        { name: 'Test4', score: 78, average: 70 },
        { name: 'Test5', score: 95, average: 82 },
      ]
    },
    'Class #2': {
      students: [
        { last: 'Garcia', first: 'Maria', time: '4', number: '#011', school: 'North High' },
        { last: 'Martinez', first: 'James', time: '4.7', number: '#012', school: 'West Academy' },
        { last: 'Davis', first: 'Lisa', time: '7.2', number: '#013', school: 'Central High' },
        { last: 'Rodriguez', first: 'Carlos', time: '2.1', number: '#014', school: 'East Prep' },
        { last: 'Wilson', first: 'Amy', time: '5.5', number: '#015', school: 'North High' },
        { last: 'Anderson', first: 'Tom', time: '3.8', number: '#016', school: 'West Academy' },
      ],
      analytics: [
        { name: 'Thing1', score: 92, average: 80 },
        { name: 'Thing2', score: 78, average: 72 },
        { name: 'Thing3', score: 88, average: 75 },
        { name: 'Thing4', score: 65, average: 68 },
        { name: 'Thing5', score: 82, average: 78 },
      ]
    },
    'Class #3': {
      students: [
        { last: 'Taylor', first: 'Sophie', time: '1.8', number: '#021', school: 'South Academy' },
        { last: 'Thomas', first: 'Ryan', time: '6.3', number: '#022', school: 'Central High' },
        { last: 'Moore', first: 'Jessica', time: '2.9', number: '#023', school: 'East Prep' },
        { last: 'Jackson', first: 'Kevin', time: '4.2', number: '#024', school: 'South Academy' },
        { last: 'Martin', first: 'Rachel', time: '8.1', number: '#025', school: 'West Academy' },
        { last: 'Lee', first: 'Daniel', time: '3.5', number: '#026', school: 'North High' },
        { last: 'White', first: 'Nicole', time: '5.7', number: '#027', school: 'Central High' },
      ],
      analytics: [
        { name: 'Thing1', score: 75, average: 70 },
        { name: 'Thing2', score: 82, average: 76 },
        { name: 'Thing3', score: 70, average: 72 },
        { name: 'Thing4', score: 90, average: 85 },
        { name: 'Thing5', score: 68, average: 65 },
      ]
    },
    'Class #4': {
      students: [
        { last: 'Harris', first: 'Brandon', time: '9.2', number: '#031', school: 'East Prep' },
        { last: 'Clark', first: 'Emily', time: '2.3', number: '#032', school: 'North High' },
        { last: 'Lewis', first: 'Chris', time: '4.8', number: '#033', school: 'West Academy' },
        { last: 'Walker', first: 'Amanda', time: '6.5', number: '#034', school: 'South Academy' },
      ],
      analytics: [
        { name: 'Thing1', score: 88, average: 82 },
        { name: 'Thing2', score: 95, average: 88 },
        { name: 'Thing3', score: 72, average: 70 },
        { name: 'Thing4', score: 85, average: 80 },
        { name: 'Thing5', score: 78, average: 75 },
      ]
    }
  };

  const currentData = classData[selectedClass];
  const students = currentData.students;
  const analyticsData = currentData.analytics;

  const maxScore = Math.max(...analyticsData.map(d => d.score));

  const handleSaveHomework = () => {
    if (homeworkText.length > 0) {
      alert(`Homework saved for ${selectedClass}: "${homeworkText}"`);
      setHomeworkText('');
    } else {
      alert('Please Enter Homework');
    }
  };
  
  const handleButtonPress = (route) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {/* Empty view for spacing, can add edit button later if needed */}
            </View>
          </View>

          <View style={styles.content}>
            {/* Profile Card */}
            <View style={styles.profileCard}>
              <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                  <Image source={require('../assets/metalmario.png')} style={styles.avatar} />
                </View>
                <View style={styles.nameSection}>
                  <Text style={styles.nameText}>Professor Patel</Text>
                  <View style={styles.roleContainer}>
                    <GraduationCap color="#64748b" size={16} />
                    <Text style={styles.roleText}>EMT Instructor</Text>
                  </View>
                </View>
              </View>

              {/* Class Selector */}
              <View style={styles.classSection}>
                <Text style={styles.classSectionTitle}>Select Class</Text>
                <View style={styles.classSelector}>
                  {classes.map((className) => (
                    <ClassButton
                      key={className}
                      className={className}
                      isSelected={selectedClass === className}
                      onPress={() => setSelectedClass(className)}
                    />
                  ))}
                </View>
              </View>
            </View>

            {/* Analytics Card */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Class Performance Analytics</Text>
              
              <View style={styles.chartContainer}>
                {analyticsData.map((item, index) => (
                  <View key={index} style={styles.chartItem}>
                    <View style={styles.barContainer}>
                      <View 
                        style={[
                          styles.bar, 
                          { height: `${(item.score / maxScore) * 100}%` }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.averageLine, 
                          { bottom: `${(item.average / maxScore) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.chartLabel}>{item.name}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#2563eb' }]} />
                  <Text style={styles.legendText}>Score</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendBox, { backgroundColor: '#f59e0b' }]} />
                  <Text style={styles.legendText}>Average</Text>
                </View>
              </View>
            </View>

            {/* Students Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.sectionTitle}>Students</Text>
                <View style={styles.studentCount}>
                  <Users color="#2563eb" size={16} />
                  <Text style={styles.studentCountText}>{students.length}</Text>
                </View>
              </View>
              
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.colLast]}>Last</Text>
                <Text style={[styles.tableHeaderText, styles.colFirst]}>First</Text>
                <Text style={[styles.tableHeaderText, styles.colTime]}>Time</Text>
                <Text style={[styles.tableHeaderText, styles.colNumber]}>#</Text>
                <Text style={[styles.tableHeaderText, styles.colSchool]}>School</Text>
              </View>
              
              {students.map((student, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.colLast]}>{student.last}</Text>
                  <Text style={[styles.tableCell, styles.colFirst]}>{student.first}</Text>
                  <Text style={[styles.tableCell, styles.colTime]}>{student.time}h</Text>
                  <Text style={[styles.tableCell, styles.colNumber]}>{student.number}</Text>
                  <Text style={[styles.tableCell, styles.colSchool]}>{student.school}</Text>
                </View>
              ))}
            </View>

            {/* Homework Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <BookOpen color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Homework for {selectedClass}</Text>
              </View>
              
              <TextInput
                style={styles.homeworkInput}
                placeholder="Enter homework assignment..."
                placeholderTextColor="#94a3b8"
                multiline
                value={homeworkText}
                onChangeText={setHomeworkText}
              />
              
              <PrimaryButton
                title="Save & Send to Class"
                icon={Send}
                onPress={handleSaveHomework}
              />
            </View>
          
            {/* Navigation Section */}
            <View style={styles.navigationSection}>
              <Text style={styles.navigationTitle}>Quick Actions</Text>
              
              <NavigationButton
                title="Edit Class Roster"
                onPress={() => handleButtonPress('ClassEdit')}
              />

              <NavigationButton
                title="See Student Progress"
                onPress={() => handleButtonPress('InstructorProgress')}
              />

              <NavigationButton
                title="Create Custom Scenarios"
                onPress={() => handleButtonPress('CustomizeAI')}
              />
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
  navigationSection: {
    marginTop: 8,
  },
  navigationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffffff',
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  navButtonArrow: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: '600',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  profileCard: {
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  nameSection: {
    flex: 1,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  classSection: {
    marginTop: 8,
  },
  classSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  classSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  classButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  classButtonText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  classButtonTextSelected: {
    color: '#ffffff',
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
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  studentCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  studentCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 180,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
    paddingBottom: 40,
    marginBottom: 16,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  barContainer: {
    flex: 1,
    width: '70%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 15,
  },
  averageLine: {
    position: 'absolute',
    width: '120%',
    height: 3,
    backgroundColor: '#f59e0b',
    left: '-10%',
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontWeight: '600',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 12,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableCell: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  colLast: {
    flex: 1.2,
  },
  colFirst: {
    flex: 1.2,
  },
  colTime: {
    flex: 1,
  },
  colNumber: {
    flex: 0.8,
  },
  colSchool: {
    flex: 1.5,
  },
  homeworkInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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