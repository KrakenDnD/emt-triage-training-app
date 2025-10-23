import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, AlertCircle, GraduationCap, Hash, Mail, Edit3, Check, X } from 'lucide-react-native';

interface ProfileDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  email?: string;
  phoneNumber?: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  instructor?: string;
  classNumber?: string;
}

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  allergies?: string;
  medicalConditions?: string;
  emergencyContact?: string;
}

class ProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }

  async getMyProfile(): Promise<ProfileDto> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          firstName: 'Hatsune',
          lastName: 'Miku',
          email: 'hatsune.miku@example.edu',
          phoneNumber: '(555) 123-4567',
          allergies: 'Penicillin, Latex',
          medicalConditions: 'None',
          emergencyContact: 'Jane Doe - (555) 987-6543',
          instructor: 'Professor Patel',
          classNumber: '3',
          avatarUrl: undefined,
        });
      }, 500);
    });
  }

  async updateMyProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          instructor: 'Professor Patel',
          classNumber: '3',
          email: 'hatsune.miku@example.edu',
          ...data,
        });
      }, 500);
    });
  }

  async uploadAvatar(imageUri: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(imageUri);
      }, 500);
    });
  }
}
  
const profileService = new ProfileService();

export default function StudentProfile({ navigation }) {
  const [profile, setProfile] = useState<ProfileDto>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    allergies: '',
    medicalConditions: '',
    emergencyContact: '',
  });
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonPress = (route) => {
    try {
      navigation.navigate(route);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const defaultAvatar = require('../assets/metalmario.png');
  
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await profileService.getMyProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || '',
        allergies: data.allergies || '',
        medicalConditions: data.medicalConditions || '',
        emergencyContact: data.emergencyContact || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Using default values.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateProfileDto = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        allergies: formData.allergies.trim(),
        medicalConditions: formData.medicalConditions.trim(),
        emergencyContact: formData.emergencyContact.trim(),
      };

      const updatedProfile = await profileService.updateMyProfile(updateData);
      
      setProfile(updatedProfile);
      setFormData({
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        phoneNumber: updatedProfile.phoneNumber || '',
        allergies: updatedProfile.allergies || '',
        medicalConditions: updatedProfile.medicalConditions || '',
        emergencyContact: updatedProfile.emergencyContact || '',
      });
      setIsEditingProfile(false);
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phoneNumber: profile.phoneNumber || '',
      allergies: profile.allergies || '',
      medicalConditions: profile.medicalConditions || '',
      emergencyContact: profile.emergencyContact || '',
    });
    setIsEditingProfile(false);
  };

  const getAvatarSource = () => {
    if (localAvatarUri) {
      return { uri: localAvatarUri };
    }
    if (profile.avatarUrl) {
      return { uri: profile.avatarUrl };
    }
    return defaultAvatar;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {!isEditingProfile && (
                <TouchableOpacity 
                  onPress={() => setIsEditingProfile(true)}
                  style={styles.editIconButton}
                >
                  <Edit3 color="#ffffff" size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>

        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle color="#dc2626" size={20} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image source={getAvatarSource()} style={styles.avatar} />
                {isSaving && (
                  <View style={styles.avatarOverlay}>
                    <ActivityIndicator size="small" color="#ffffff" />
                  </View>
                )}
              </View>
              <View style={styles.nameSection}>
                <Text style={styles.nameText}>
                  {formData.firstName || 'First'} {formData.lastName || 'Last'}
                </Text>
                <View style={styles.roleContainer}>
                  <GraduationCap color="#64748b" size={16} />
                  <Text style={styles.roleText}>EMT Student</Text>
                </View>
              </View>
            </View>

            {/* Read-only Information */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <GraduationCap color="#2563eb" size={18} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Instructor</Text>
                  <Text style={styles.infoValue}>{profile.instructor || 'Not assigned'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Hash color="#2563eb" size={18} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Class Number</Text>
                  <Text style={styles.infoValue}>{profile.classNumber || 'Not assigned'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Mail color="#2563eb" size={18} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profile.email || 'Not provided'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Editable Information Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>First Name *</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.firstName}
                  onChangeText={(text) => setFormData({...formData, firstName: text})}
                  placeholder="Enter first name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.firstName || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Last Name *</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.lastName}
                  onChangeText={(text) => setFormData({...formData, lastName: text})}
                  placeholder="Enter last name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.lastName || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
                  placeholder="(555) 123-4567"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.phoneNumber || 'Not provided'}</Text>
              )}
            </View>
          </View>

          {/* Medical Information Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Known Allergies</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.allergies}
                  onChangeText={(text) => setFormData({...formData, allergies: text})}
                  placeholder="e.g., Penicillin, Latex"
                  placeholderTextColor="#94a3b8"
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={2}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.allergies || 'None reported'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Medical Conditions</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.medicalConditions}
                  onChangeText={(text) => setFormData({...formData, medicalConditions: text})}
                  placeholder="e.g., Asthma, Diabetes"
                  placeholderTextColor="#94a3b8"
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={2}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.medicalConditions || 'None reported'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Emergency Contact</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.emergencyContact}
                  onChangeText={(text) => setFormData({...formData, emergencyContact: text})}
                  placeholder="Name - (555) 123-4567"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.emergencyContact || 'Not provided'}</Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          {isEditingProfile && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelEdit}
                disabled={isSaving}
              >
                <X color="#64748b" size={20} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={saveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Check color="#ffffff" size={20} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Navigation Section */}
          <View style={styles.navigationSection}>
            <Text style={styles.navigationTitle}>Quick Actions</Text>
            
            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleButtonPress('ScenarioSelect')}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>Scenario Selection</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleButtonPress('CustomizeAI')}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>Customize EMTelligence</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleButtonPress('AIChat')} 
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>Ask EMTelligence A Question</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleButtonPress('ReferenceLib')}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>Reference Library</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              //onPress={() => handleButtonPress('Analytics')}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>Analytics</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navButton}
              onPress={() => handleButtonPress('History')}
            >
              <View style={styles.navButtonContent}>
                <Text style={styles.navButtonText}>History</Text>
                <Text style={styles.navButtonArrow}>→</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  editIconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    gap: 12,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
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
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#2563eb',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fieldValue: {
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    marginTop: 32,
    marginBottom: 40,
  },
});