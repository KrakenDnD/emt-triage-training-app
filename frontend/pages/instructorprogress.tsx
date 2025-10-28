import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart3, Users, Trophy, TrendingUp, Award } from 'lucide-react-native';

export default function InstructorProgress({ navigation }) {
  const [selectedClass, setSelectedClass] = useState('Class #1');

  const classes = ['Class #1', 'Class #2', 'Class #3', 'Class #4'];

  const classData = {
    'Class #1': {
      students: [
        { 
          last: 'Smith', 
          first: 'John', 
          number: '#001', 
          school: 'Central High',
          tests: {
            'Midterm Exam': 85,
            'Quiz 1': 92,
            'Quiz 2': 78,
            'Final Project': 88,
            'Lab Practical': 90
          },
          average: 86.6
        },
        { 
          last: 'Johnson', 
          first: 'Emma', 
          number: '#002', 
          school: 'Central High',
          tests: {
            'Midterm Exam': 92,
            'Quiz 1': 88,
            'Quiz 2': 85,
            'Final Project': 94,
            'Lab Practical': 87
          },
          average: 89.2
        },
        { 
          last: 'Williams', 
          first: 'Michael', 
          number: '#003', 
          school: 'West Academy',
          tests: {
            'Midterm Exam': 78,
            'Quiz 1': 82,
            'Quiz 2': 75,
            'Final Project': 80,
            'Lab Practical': 85
          },
          average: 80.0
        },
        { 
          last: 'Brown', 
          first: 'Sarah', 
          number: '#004', 
          school: 'Central High',
          tests: {
            'Midterm Exam': 88,
            'Quiz 1': 90,
            'Quiz 2': 92,
            'Final Project': 89,
            'Lab Practical': 91
          },
          average: 90.0
        },
        { 
          last: 'Jones', 
          first: 'David', 
          number: '#005', 
          school: 'East Prep',
          tests: {
            'Midterm Exam': 72,
            'Quiz 1': 68,
            'Quiz 2': 75,
            'Final Project': 78,
            'Lab Practical': 80
          },
          average: 74.6
        },
      ]
    },
    'Class #2': {
      students: [
        { 
          last: 'Garcia', 
          first: 'Maria', 
          number: '#011', 
          school: 'North High',
          tests: {
            'Assessment 1': 94,
            'Assessment 2': 88,
            'Assessment 3': 92,
            'Practical Exam': 90,
            'Group Project': 95
          },
          average: 91.8
        },
        { 
          last: 'Martinez', 
          first: 'James', 
          number: '#012', 
          school: 'West Academy',
          tests: {
            'Assessment 1': 82,
            'Assessment 2': 85,
            'Assessment 3': 78,
            'Practical Exam': 88,
            'Group Project': 84
          },
          average: 83.4
        },
        { 
          last: 'Davis', 
          first: 'Lisa', 
          number: '#013', 
          school: 'Central High',
          tests: {
            'Assessment 1': 90,
            'Assessment 2': 92,
            'Assessment 3': 89,
            'Practical Exam': 94,
            'Group Project': 91
          },
          average: 91.2
        },
        { 
          last: 'Rodriguez', 
          first: 'Carlos', 
          number: '#014', 
          school: 'East Prep',
          tests: {
            'Assessment 1': 76,
            'Assessment 2': 80,
            'Assessment 3': 82,
            'Practical Exam': 78,
            'Group Project': 85
          },
          average: 80.2
        },
        { 
          last: 'Wilson', 
          first: 'Amy', 
          number: '#015', 
          school: 'North High',
          tests: {
            'Assessment 1': 88,
            'Assessment 2': 86,
            'Assessment 3': 90,
            'Practical Exam': 85,
            'Group Project': 89
          },
          average: 87.6
        },
        { 
          last: 'Anderson', 
          first: 'Tom', 
          number: '#016', 
          school: 'West Academy',
          tests: {
            'Assessment 1': 84,
            'Assessment 2': 88,
            'Assessment 3': 86,
            'Practical Exam': 90,
            'Group Project': 87
          },
          average: 87.0
        },
      ]
    },
    'Class #3': {
      students: [
        { 
          last: 'Taylor', 
          first: 'Sophie', 
          number: '#021', 
          school: 'South Academy',
          tests: {
            'Test A': 92,
            'Test B': 88,
            'Test C': 94,
            'Final Test': 90,
            'Competency': 96
          },
          average: 92.0
        },
        { 
          last: 'Thomas', 
          first: 'Ryan', 
          number: '#022', 
          school: 'Central High',
          tests: {
            'Test A': 78,
            'Test B': 82,
            'Test C': 75,
            'Final Test': 80,
            'Competency': 85
          },
          average: 80.0
        },
        { 
          last: 'Moore', 
          first: 'Jessica', 
          number: '#023', 
          school: 'East Prep',
          tests: {
            'Test A': 86,
            'Test B': 90,
            'Test C': 88,
            'Final Test': 92,
            'Competency': 89
          },
          average: 89.0
        },
        { 
          last: 'Jackson', 
          first: 'Kevin', 
          number: '#024', 
          school: 'South Academy',
          tests: {
            'Test A': 82,
            'Test B': 85,
            'Test C': 80,
            'Final Test': 88,
            'Competency': 86
          },
          average: 84.2
        },
        { 
          last: 'Martin', 
          first: 'Rachel', 
          number: '#025', 
          school: 'West Academy',
          tests: {
            'Test A': 94,
            'Test B': 96,
            'Test C': 92,
            'Final Test': 95,
            'Competency': 98
          },
          average: 95.0
        },
        { 
          last: 'Lee', 
          first: 'Daniel', 
          number: '#026', 
          school: 'North High',
          tests: {
            'Test A': 88,
            'Test B': 84,
            'Test C': 90,
            'Final Test': 86,
            'Competency': 92
          },
          average: 88.0
        },
        { 
          last: 'White', 
          first: 'Nicole', 
          number: '#027', 
          school: 'Central High',
          tests: {
            'Test A': 76,
            'Test B': 80,
            'Test C': 78,
            'Final Test': 82,
            'Competency': 85
          },
          average: 80.2
        },
      ]
    },
    'Class #4': {
      students: [
        { 
          last: 'Harris', 
          first: 'Brandon', 
          number: '#031', 
          school: 'East Prep',
          tests: {
            'Module 1': 88,
            'Module 2': 92,
            'Module 3': 85,
            'Capstone': 90,
            'Portfolio': 94
          },
          average: 89.8
        },
        { 
          last: 'Clark', 
          first: 'Emily', 
          number: '#032', 
          school: 'North High',
          tests: {
            'Module 1': 96,
            'Module 2': 94,
            'Module 3': 98,
            'Capstone': 95,
            'Portfolio': 97
          },
          average: 96.0
        },
        { 
          last: 'Lewis', 
          first: 'Chris', 
          number: '#033', 
          school: 'West Academy',
          tests: {
            'Module 1': 82,
            'Module 2': 85,
            'Module 3': 80,
            'Capstone': 88,
            'Portfolio': 86
          },
          average: 84.2
        },
        { 
          last: 'Walker', 
          first: 'Amanda', 
          number: '#034', 
          school: 'South Academy',
          tests: {
            'Module 1': 90,
            'Module 2': 88,
            'Module 3': 92,
            'Capstone': 89,
            'Portfolio': 91
          },
          average: 90.0
        },
      ]
    }
  };

  const currentData = classData[selectedClass];
  const students = currentData.students;

  // Get all test names for the current class
  const testNames = students.length > 0 ? Object.keys(students[0].tests) : [];

  // Calculate class statistics
  const classAverage = students.reduce((sum, student) => sum + student.average, 0) / students.length;
  const highestScore = Math.max(...students.map(s => s.average));
  const lowestScore = Math.min(...students.map(s => s.average));

  const getGradeColor = (score) => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 80) return '#3b82f6'; // Blue
    if (score >= 70) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getGradeLetter = (score) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Student Progress</Text>
            <Text style={styles.headerSubtitle}>Track test scores and performance</Text>
          </View>

          <View style={styles.content}>
            {/* Class Selector Card */}
            <View style={styles.profileCard}>
              <View style={styles.classSection}>
                <Text style={styles.classSectionTitle}>Select Class</Text>
                <View style={styles.classSelector}>
                  {classes.map((className) => (
                    <TouchableOpacity
                      key={className}
                      style={[
                        styles.classButton,
                        selectedClass === className && styles.classButtonSelected
                      ]}
                      onPress={() => setSelectedClass(className)}
                    >
                      <Text style={[
                        styles.classButtonText,
                        selectedClass === className && styles.classButtonTextSelected
                      ]}>
                        {className}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Class Overview Stats */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <BarChart3 color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Class Overview</Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Users color="#64748b" size={18} />
                  <Text style={styles.statValue}>{students.length}</Text>
                  <Text style={styles.statLabel}>Students</Text>
                </View>
                <View style={styles.statItem}>
                  <TrendingUp color="#64748b" size={18} />
                  <Text style={styles.statValue}>{classAverage.toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>Class Average</Text>
                </View>
                <View style={styles.statItem}>
                  <Trophy color="#64748b" size={18} />
                  <Text style={styles.statValue}>{highestScore.toFixed(1)}%</Text>
                  <Text style={styles.statLabel}>Highest Score</Text>
                </View>
                <View style={styles.statItem}>
                  <Award color="#64748b" size={18} />
                  <Text style={styles.statValue}>{testNames.length}</Text>
                  <Text style={styles.statLabel}>Assessments</Text>
                </View>
              </View>
            </View>

            {/* Students Progress Table */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Users color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Student Grades</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tableContainer}>
                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colStudent]}>Student</Text>
                    <Text style={[styles.tableHeaderText, styles.colSchool]}>School</Text>
                    {testNames.map((testName, index) => (
                      <Text key={index} style={[styles.tableHeaderText, styles.colTest]}>
                        {testName}
                      </Text>
                    ))}
                    <Text style={[styles.tableHeaderText, styles.colAverage]}>Average</Text>
                    <Text style={[styles.tableHeaderText, styles.colGrade]}>Grade</Text>
                  </View>
                  
                  {/* Table Rows */}
                  {students.map((student, index) => (
                    <View key={index} style={styles.tableRow}>
                      <View style={styles.colStudent}>
                        <Text style={styles.studentName}>{student.first} {student.last}</Text>
                        <Text style={styles.studentNumber}>{student.number}</Text>
                      </View>
                      <Text style={[styles.tableCell, styles.colSchool]}>{student.school}</Text>
                      {testNames.map((testName, testIndex) => (
                        <View key={testIndex} style={styles.colTest}>
                          <Text style={[
                            styles.testScore,
                            { color: getGradeColor(student.tests[testName]) }
                          ]}>
                            {student.tests[testName]}%
                          </Text>
                        </View>
                      ))}
                      <View style={styles.colAverage}>
                        <Text style={[
                          styles.averageScore,
                          { color: getGradeColor(student.average) }
                        ]}>
                          {student.average.toFixed(1)}%
                        </Text>
                      </View>
                      <View style={styles.colGrade}>
                        <View style={[
                          styles.gradeBadge,
                          { backgroundColor: getGradeColor(student.average) }
                        ]}>
                          <Text style={styles.gradeText}>
                            {getGradeLetter(student.average)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Performance Distribution */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <BarChart3 color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Grade Distribution</Text>
              </View>
              
              <View style={styles.distributionContainer}>
                {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                  const count = students.filter(s => getGradeLetter(s.average) === grade).length;
                  const percentage = (count / students.length) * 100;
                  
                  return (
                    <View key={grade} style={styles.distributionItem}>
                      <Text style={styles.distributionGrade}>{grade}</Text>
                      <View style={styles.distributionBarContainer}>
                        <View 
                          style={[
                            styles.distributionBar,
                            { 
                              width: `${percentage}%`,
                              backgroundColor: getGradeColor(grade === 'A' ? 95 : grade === 'B' ? 85 : grade === 'C' ? 75 : grade === 'D' ? 65 : 55)
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.distributionCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
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
    flex: 1,
    paddingHorizontal: 16,
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  tableContainer: {
    minWidth: 800,
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
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  colStudent: {
    width: 140,
  },
  colSchool: {
    width: 120,
  },
  colTest: {
    width: 80,
    alignItems: 'center',
  },
  colAverage: {
    width: 80,
    alignItems: 'center',
  },
  colGrade: {
    width: 60,
    alignItems: 'center',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  studentNumber: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  testScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  averageScore: {
    fontSize: 16,
    fontWeight: '700',
  },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  distributionContainer: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  distributionGrade: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    width: 20,
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  distributionBar: {
    height: '100%',
    borderRadius: 4,
    minWidth: 2,
  },
  distributionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    width: 30,
    textAlign: 'right',
  },
});