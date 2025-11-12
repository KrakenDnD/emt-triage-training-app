import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Plus, Edit3, Trash2, Save, X, UserPlus, ArrowLeft } from 'lucide-react-native';

export default function ClassEdit({ navigation }) {
  const [selectedClass, setSelectedClass] = useState('Class #1');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    first: '',
    last: '',
    number: '',
    school: ''
  });

  const getScoreColor = (score: string) => {
    const numScore = parseInt(score);
    if (numScore >= 85) return '#10b981';
    if (numScore >= 70) return '#f59e0b';
    return '#ef4444';
  };


  const classes = ['Class #1', 'Class #2', 'Class #3', 'Class #4'];

  const [classData, setClassData] = useState({
    'Class #1': {
      students: [
        { id: 1, last: 'Smith', first: 'John', number: '#001', school: 'Central High' },
        { id: 2, last: 'Johnson', first: 'Emma', number: '#002', school: 'Central High' },
        { id: 3, last: 'Williams', first: 'Michael', number: '#003', school: 'West Academy' },
        { id: 4, last: 'Brown', first: 'Sarah', number: '#004', school: 'Central High' },
        { id: 5, last: 'Jones', first: 'David', number: '#005', school: 'East Prep' },
      ]
    },
    'Class #2': {
      students: [
        { id: 6, last: 'Garcia', first: 'Maria', number: '#011', school: 'North High' },
        { id: 7, last: 'Martinez', first: 'James', number: '#012', school: 'West Academy' },
        { id: 8, last: 'Davis', first: 'Lisa', number: '#013', school: 'Central High' },
        { id: 9, last: 'Rodriguez', first: 'Carlos', number: '#014', school: 'East Prep' },
        { id: 10, last: 'Wilson', first: 'Amy', number: '#015', school: 'North High' },
        { id: 11, last: 'Anderson', first: 'Tom', number: '#016', school: 'West Academy' },
      ]
    },
    'Class #3': {
      students: [
        { id: 12, last: 'Taylor', first: 'Sophie', number: '#021', school: 'South Academy' },
        { id: 13, last: 'Thomas', first: 'Ryan', number: '#022', school: 'Central High' },
        { id: 14, last: 'Moore', first: 'Jessica', number: '#023', school: 'East Prep' },
        { id: 15, last: 'Jackson', first: 'Kevin', number: '#024', school: 'South Academy' },
        { id: 16, last: 'Martin', first: 'Rachel', number: '#025', school: 'West Academy' },
        { id: 17, last: 'Lee', first: 'Daniel', number: '#026', school: 'North High' },
        { id: 18, last: 'White', first: 'Nicole', number: '#027', school: 'Central High' },
      ]
    },
    'Class #4': {
      students: [
        { id: 19, last: 'Harris', first: 'Brandon', number: '#031', school: 'East Prep' },
        { id: 20, last: 'Clark', first: 'Emily', number: '#032', school: 'North High' },
        { id: 21, last: 'Lewis', first: 'Chris', number: '#033', school: 'West Academy' },
        { id: 22, last: 'Walker', first: 'Amanda', number: '#034', school: 'South Academy' },
      ]
    }
  });

  const currentStudents = classData[selectedClass].students;

  const generateStudentNumber = useCallback(() => {
    const classNumber = selectedClass.slice(-1); // Get class number
    const existingNumbers = currentStudents.map(s => parseInt(s.number.slice(1)));
    const maxNumber = Math.max(...existingNumbers, 0);
    const newNumber = maxNumber + 1;
    return `#${classNumber}${newNumber.toString().padStart(2, '0')}`;
  }, [selectedClass, currentStudents]);

  const handleAddClass = useCallback(() => {
    Alert.alert('Success', 'Class added successfully');
  }, []);

  const resetForm = useCallback(() => {
    setNewStudent({ first: '', last: '', number: '', school: '' });
    setEditingStudent(null);
    setShowAddModal(false);
  }, []);

  const handleAddStudent = useCallback(() => {
    if (!newStudent.first || !newStudent.last || !newStudent.school) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const studentToAdd = {
      id: Date.now(),
      ...newStudent,
      number: newStudent.number || generateStudentNumber()
    };

    setClassData(prev => ({
      ...prev,
      [selectedClass]: {
        ...prev[selectedClass],
        students: [...prev[selectedClass].students, studentToAdd]
      }
    }));

    setNewStudent({ first: '', last: '', number: '', school: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Student added successfully');
  }, [newStudent, selectedClass, generateStudentNumber]);

  const handleUpdateStudent = useCallback(() => {
  if (!newStudent.first || !newStudent.last || !newStudent.school) {
    Alert.alert('Error', 'Please fill in all required fields');
    return;
  }

  setClassData(prev => ({
    ...prev,
    [selectedClass]: {
      ...prev[selectedClass],
      students: prev[selectedClass].students.map(student =>
        student.id === editingStudent.id
          ? { ...student, ...newStudent }
          : student
      )
    }
  }));

  setEditingStudent(null);
  setNewStudent({ first: '', last: '', number: '', school: '' });
  Alert.alert('Success', 'Student updated successfully');
}, [newStudent, selectedClass, editingStudent]);

  const handleEditStudent = useCallback((student) => {
    setEditingStudent(student);
    setNewStudent({
      first: student.first,
      last: student.last,
      number: student.number,
      school: student.school
    });
  }, []);

  const handleDeleteStudent = useCallback((studentId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this student from the roster?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setClassData(prev => ({
              ...prev,
              [selectedClass]: {
                ...prev[selectedClass],
                students: prev[selectedClass].students.filter(s => s.id !== studentId)
              }
            }));
            Alert.alert('Success', 'Student removed from roster');
          }
        }
      ]
    );
  }, [selectedClass]);



  const StudentModal = useCallback(() => (
    <Modal
      visible={showAddModal || editingStudent !== null}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <UserPlus color="#2563eb" size={20} />
              <Text style={styles.modalTitle}>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </Text>
            </View>
            <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
              <X color="#64748b" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} keyboardShouldPersistTaps="handled">
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter first name"
                placeholderTextColor="#94a3b8"
                value={newStudent.first}
                onChangeText={(text) => setNewStudent(prev => ({ ...prev, first: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last Name *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter last name"
                placeholderTextColor="#94a3b8"
                value={newStudent.last}
                onChangeText={(text) => setNewStudent(prev => ({ ...prev, last: text }))}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Student Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder={editingStudent ? "Keep current number" : "Auto-generated if empty"}
                placeholderTextColor="#94a3b8"
                value={newStudent.number}
                onChangeText={(text) => setNewStudent(prev => ({ ...prev, number: text }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>School *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter school name"
                placeholderTextColor="#94a3b8"
                value={newStudent.school}
                onChangeText={(text) => setNewStudent(prev => ({ ...prev, school: text }))}
                autoCapitalize="words"
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={editingStudent ? handleUpdateStudent : handleAddStudent}
            >
              <Save color="#ffffff" size={16} />
              <Text style={styles.saveButtonText}>
                {editingStudent ? 'Update Student' : 'Add Student'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  ), [showAddModal, editingStudent, newStudent, resetForm, handleUpdateStudent, handleAddStudent]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft color="#ffffff" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Class Roster</Text>
            <Text style={styles.headerSubtitle}>Manage students in your classes</Text>
          </View>

          <View style={styles.content}>
            {/* Class Selector Card */}
            <View style={styles.profileCard}>
              <View style={styles.cardHeader}>
                <Users color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>Select Class</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classSelector}>
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
                    <Text style={[
                      styles.classButtonSubtext,
                      selectedClass === className && styles.classButtonSubtextSelected
                    ]}>
                      {classData[className].students.length} students
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <TouchableOpacity style={styles.addClassButton} onPress={handleAddClass}>
                  <Plus color="#2563eb" size={20} />
                  <Text style={styles.addClassButtonText}>Add Class</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Student Roster Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Users color="#2563eb" size={20} />
                <Text style={styles.sectionTitle}>{selectedClass} Roster</Text>
                <View style={styles.studentCount}>
                  <Text style={styles.studentCountText}>
                    {currentStudents.length} student{currentStudents.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
                <Plus color="#ffffff" size={20} />
                <Text style={styles.addButtonText}>Add New Student</Text>
              </TouchableOpacity>

              {currentStudents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Users color="#94a3b8" size={48} />
                  <Text style={styles.emptyStateTitle}>No Students Added</Text>
                  <Text style={styles.emptyStateText}>
                    Start building your class roster by adding students using the button above.
                  </Text>
                </View>
              ) : (
                <View style={styles.studentTable}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colName]}>Name</Text>
                    <Text style={[styles.tableHeaderText, styles.colNumber]}>Number</Text>
                    <Text style={[styles.tableHeaderText, styles.colSchool]}>School</Text>
                    <Text style={[styles.tableHeaderText, styles.colActions]}>Actions</Text>
                  </View>
                  
                  {currentStudents.map((student) => (
                    <View key={student.id} style={styles.tableRow}>
                      <View style={styles.colName}>
                        <Text style={styles.studentName}>
                          {student.first} {student.last}
                        </Text>
                      </View>
                      <View style={styles.colNumber}>
                        <Text style={styles.tableCell}>{student.number}</Text>
                      </View>
                      <View style={styles.colSchool}>
                        <Text style={styles.tableCell}>{student.school}</Text>
                      </View>
                      <View style={styles.colActions}>
                        <TouchableOpacity 
                          style={styles.editButton}
                          onPress={() => handleEditStudent(student)}
                        >
                          <Edit3 color="#2563eb" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteButton}
                          onPress={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 color="#dc2626" size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>


          </View>
        </ScrollView>
      </LinearGradient>

      {StudentModal()}
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
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
  classSelector: {
    marginTop: 8,
  },
  classButton: {
    marginRight: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    minWidth: 120,
    alignItems: 'center',
  },
  classButtonSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  classButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  classButtonTextSelected: {
    color: '#2563eb',
  },
  classButtonSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  classButtonSubtextSelected: {
    color: '#2563eb',
  },
  addClassButton: {
    marginRight: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'dashed',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addClassButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 4,
  },
  studentTable: {
    marginTop: 20,
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
    flex: 1,
  },
  studentCount: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  studentCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
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
  colName: {
    flex: 2,
  },
  colNumber: {
    flex: 1,
  },
  colSchool: {
    flex: 1.5,
  },
  colActions: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  modalForm: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
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
});