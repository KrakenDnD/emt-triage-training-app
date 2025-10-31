import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, AlertCircle, GraduationCap, Hash, Mail, Edit3, Check, X, PartyPopper, NotebookPen } from 'lucide-react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface ProfileDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  email?: string;
  phoneNum?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  instructorId?: string;
  instructorName?: string;
  displayId?: string;
  role?: string;
  avgScore: number;
  profilePhoto?: string;
}

interface UpdateProfileDto {
  phoneNum?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  profilePhoto?: string;
}

class ProfileService {
  private db = getFirestore();
  private auth = getAuth();

  async getMyProfile(): Promise<ProfileDto> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const userDoc = await getDoc(doc(this.db, 'users', currentUser.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    const data = userDoc.data();

    return {
      id: userDoc.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      fullName: data.fullName,
      email: data.email,
      phoneNum: data.phoneNum || '',
      dateOfBirth: data.dateOfBirth || '',
      emergencyContact: data.emergencyContact || '',
      instructorId: data.instructorId || '',
      instructorName: data.instructorName || '',
      displayId: data.displayId || '',
      role: data.role || '',
      avgScore: data.avgScore || 0,
      profilePhoto: data.profilePhoto || '',
      avatarUrl: data.profilePhoto || '',
    };
  }

  async updateMyProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const userRef = doc(this.db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });

    return this.getMyProfile();
  }
}

const getScoreColor = (score: number) => {
  if (score >= 85) return '#10b981';
  if (score >= 70) return '#f59e0b';
  return '#ef4444';
};

const getScoreIcon = (score: number) => {
  if (score >= 85) return PartyPopper;
  if (score >= 70) return NotebookPen;
  return AlertCircle;
};

const NavigationButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.navButton} onPress={onPress}>
    <View style={styles.navButtonContent}>
      <Text style={styles.navButtonText}>{title}</Text>
      <Text style={styles.navButtonArrow}>→</Text>
    </View>
  </TouchableOpacity>
);

const ActionButton = ({ 
  title, 
  onPress, 
  icon: Icon, 
  variant = 'primary', 
  disabled = false,
  isLoading = false 
}) => {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        isPrimary ? styles.saveButton : styles.cancelButton,
        disabled && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={isPrimary ? '#fff' : '#64748b'} />
      ) : (
        <>
          {Icon && <Icon color={isPrimary ? '#ffffff' : '#64748b'} size={20} />}
          <Text style={isPrimary ? styles.saveButtonText : styles.cancelButtonText}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const IconButton = ({ icon: Icon, onPress, style }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[styles.editIconButton, style]}
  >
    <Icon color="#2563eb" size={20} />
  </TouchableOpacity>
);
  
const profileService = new ProfileService();

export default function StudentProfile({ navigation }) {
  const [profile, setProfile] = useState<ProfileDto>({});
  const [formData, setFormData] = useState({
    phoneNum: '',
    dateOfBirth: '',
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
        phoneNum: data.phoneNum || '',
        dateOfBirth: data.dateOfBirth || '',
        emergencyContact: data.emergencyContact || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateProfileDto = {
        phoneNum: formData.phoneNum.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        emergencyContact: formData.emergencyContact.trim(),
      };

      const updatedProfile = await profileService.updateMyProfile(updateData);
      
      setProfile(updatedProfile);
      setFormData({
        phoneNum: updatedProfile.phoneNum || '',
        dateOfBirth: updatedProfile.dateOfBirth || '',
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
      phoneNum: profile.phoneNum || '',
      dateOfBirth: profile.dateOfBirth || '',
      emergencyContact: profile.emergencyContact || '',
    });
    setIsEditingProfile(false);
  };

  const getAvatarSource = () => {
    if (localAvatarUri) {
      return { uri: localAvatarUri };
    }
    if (profile.profilePhoto) {
      return { uri: profile.profilePhoto };
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

  const scoreColor = getScoreColor(profile.avgScore || 0);
  const ScoreIcon = getScoreIcon(profile.avgScore || 0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a365d', '#2c5282', '#3182ce']} style={styles.gradient}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
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
                  {profile.firstName || 'First'} {profile.lastName || 'Last'}
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
                  <Text style={styles.infoValue}>{profile.instructorName || 'Not assigned'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <Hash color="#2563eb" size={18} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Student ID</Text>
                  <Text style={styles.infoValue}>{profile.displayId || 'Not assigned'}</Text>
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

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Overall Score</Text>
            <View style={styles.scoreContainer}>
              <View style={styles.scoreIconLeft}>
                <ScoreIcon color={scoreColor} size={32} />
              </View>
              <Text style={[styles.scoreValue, { color: scoreColor }]}>
                {profile.avgScore || 0}
              </Text>
              <View style={styles.scoreIconRight}>
                <ScoreIcon color={scoreColor} size={32} />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.viewMoreButton}
              onPress={() => handleButtonPress('History')}
            >
              <Text style={styles.viewMoreText}>View More</Text>
              <Text style={styles.viewMoreArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Editable Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              {!isEditingProfile && (
                <IconButton 
                  icon={Edit3}
                  onPress={() => setIsEditingProfile(true)}
                />
              )}
            </View>
            
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.phoneNum}
                  onChangeText={(text) => setFormData({...formData, phoneNum: text})}
                  placeholder="(555) 123-4567"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.phoneNum || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Date of Birth</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.dateOfBirth}
                  onChangeText={(text) => setFormData({...formData, dateOfBirth: text})}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.dateOfBirth || 'Not provided'}</Text>
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
              <ActionButton
                title="Cancel"
                icon={X}
                variant="secondary"
                onPress={cancelEdit}
                disabled={isSaving}
              />
              <ActionButton
                title="Save Changes"
                icon={Check}
                variant="primary"
                onPress={saveProfile}
                disabled={isSaving}
                isLoading={isSaving}
              />
            </View>
          )}

          {/* Navigation Section */}
          <View style={styles.navigationSection}>
            <Text style={styles.navigationTitle}>Quick Actions</Text>
            
            <NavigationButton
              title="Scenario Selection"
              onPress={() => handleButtonPress('ScenarioSelect')}
            />

            <NavigationButton
              title="Customize EMTelligence"
              onPress={() => handleButtonPress('CustomizeAI')}
            />

            <NavigationButton
              title="Ask EMTelligence A Question"
              onPress={() => handleButtonPress('AIChat')}
            />

            <NavigationButton
              title="Reference Library"
              onPress={() => handleButtonPress('ReferenceLib')}
            />

            <NavigationButton
              title="Analytics"
              onPress={() => handleButtonPress('Home')} //CHANGE
            />

            <NavigationButton
              title="History"
              onPress={() => handleButtonPress('History')}
            />
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
    backgroundColor: '#f1f5f9',
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
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreIconLeft: {
    transform: [{ scaleX: -1 }],
  },
  scoreIconRight: {
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '700',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  viewMoreArrow: {
    fontSize: 20,
    color: '#2563eb',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
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
    color: '#ffffff',
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