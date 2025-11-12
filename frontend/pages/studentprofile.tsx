import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Modal, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Phone, AlertCircle, GraduationCap, Hash, Mail, Edit3, Check, X, PartyPopper, NotebookPen, Calendar, Plus, Trash2, Clock, ChevronDown } from 'lucide-react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

interface EmergencyContact {
  name: string;
  phone: string;
}

interface ProfileDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  email?: string;
  phoneNum?: string;
  dateOfBirth?: string;
  emergencyContacts?: EmergencyContact[];
  instructorId?: string;
  instructorName?: string;
  displayId?: string;
  role?: string;
  avgScore: number;
  profilePhoto?: string;
  allergies?: string;
  bloodtype?: string;
  totalTime?: number;
}

interface UpdateProfileDto {
  phoneNum?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyContacts?: EmergencyContact[];
  profilePhoto?: string;
  allergies?: string;
  bloodtype?: string;
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
    
    //fetch instructor name if instructorId exists
    let instructorName = '';
    if (data.instructorId) {
      try {
        const instructorDoc = await getDoc(doc(this.db, 'users', data.instructorId));
        if (instructorDoc.exists()) {
          const instructorData = instructorDoc.data();
          instructorName = instructorData.fullName || 
                          `${instructorData.firstName || ''} ${instructorData.lastName || ''}`.trim();
        }
      } catch (error) {
        console.error('Failed to fetch instructor data:', error);
      }
    }

    let emergencyContacts: EmergencyContact[] = [];
    if (data.emergencyContacts && Array.isArray(data.emergencyContacts)) {
      emergencyContacts = data.emergencyContacts;
    } else if (data.emergencyContact) {
      //legacy format: parse "Name - (phone)" string
      const parts = data.emergencyContact.split(' - ');
      if (parts.length === 2) {
        emergencyContacts = [{ name: parts[0].trim(), phone: parts[1].trim() }];
      }
    }

    return {
      id: userDoc.id,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      fullName: data.fullName,
      email: data.email,
      phoneNum: data.phoneNum || '',
      dateOfBirth: data.dateOfBirth || '',
      emergencyContact: data.emergencyContact || '',
      emergencyContacts: emergencyContacts,
      instructorId: data.instructorId || '',
      instructorName: instructorName,
      displayId: data.displayId || '',
      role: data.role || '',
      avgScore: data.avgScore || 0,
      profilePhoto: data.profilePhoto || '',
      avatarUrl: data.profilePhoto || '',
      allergies: data.allergies || '',
      bloodtype: data.bloodtype || '',
      totalTime: data.totalTime || 0,
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

const formatTimeDisplay = (totalMinutes: number): string => {
  if (!totalMinutes || totalMinutes === 0) return '0 min';
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
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

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function StudentProfile({ navigation }) {
  const [profile, setProfile] = useState<ProfileDto>({});
  const [formData, setFormData] = useState({
    phoneNum: '',
    dateOfBirth: '',
    emergencyContacts: [] as EmergencyContact[],
    allergies: '',
    bloodtype: '',
  });
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBloodTypePicker, setShowBloodTypePicker] = useState<boolean>(false);

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
        emergencyContacts: data.emergencyContacts && data.emergencyContacts.length > 0 
          ? data.emergencyContacts 
          : [{ name: '', phone: '' }],
        allergies: data.allergies || '',
        bloodtype: data.bloodtype || '',
      });
      
      if (data.dateOfBirth) {
        const parsedDate = parseDateString(data.dateOfBirth);
        if (parsedDate) {
          setSelectedDate(parsedDate);
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  //parse date string (MM/DD/YYYY) to date object
  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0]) - 1; //month is 0-indexed
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return null;
  };

  //format Date object to MM/DD/YYYY string
  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateChange = (event, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        dateOfBirth: formatDate(date)
      });
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const closeDatePicker = () => {
    setShowDatePicker(false);
  };

  const selectBloodType = (bloodType: string) => {
    setFormData({
      ...formData,
      bloodtype: bloodType
    });
    setShowBloodTypePicker(false);
  };

  const openBloodTypePicker = () => {
    setShowBloodTypePicker(true);
  };

  const closeBloodTypePicker = () => {
    setShowBloodTypePicker(false);
  };

  const addEmergencyContact = () => {
    if (formData.emergencyContacts.length < 3) {
      setFormData({
        ...formData,
        emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '' }]
      });
    }
  };

  const removeEmergencyContact = (index: number) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      emergencyContacts: newContacts.length > 0 ? newContacts : [{ name: '', phone: '' }]
    });
  };

  const updateEmergencyContact = (index: number, field: 'name' | 'phone', value: string) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][field] = value;
    setFormData({
      ...formData,
      emergencyContacts: newContacts
    });
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const validContacts = formData.emergencyContacts.filter(
        contact => contact.name.trim() !== '' || contact.phone.trim() !== ''
      );

      const updateData: UpdateProfileDto = {
        phoneNum: formData.phoneNum.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        emergencyContacts: validContacts,
        allergies: formData.allergies.trim(),
        bloodtype: formData.bloodtype.trim(),
      };

      const updatedProfile = await profileService.updateMyProfile(updateData);
      
      setProfile(updatedProfile);
      setFormData({
        phoneNum: updatedProfile.phoneNum || '',
        dateOfBirth: updatedProfile.dateOfBirth || '',
        emergencyContacts: updatedProfile.emergencyContacts && updatedProfile.emergencyContacts.length > 0
          ? updatedProfile.emergencyContacts
          : [{ name: '', phone: '' }],
        allergies: updatedProfile.allergies || '',
        bloodtype: updatedProfile.bloodtype || '',
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
      emergencyContacts: profile.emergencyContacts && profile.emergencyContacts.length > 0
        ? profile.emergencyContacts
        : [{ name: '', phone: '' }],
      allergies: profile.allergies || '',
      bloodtype: profile.bloodtype || '',
    });
    
    //reset date picker to original date
    if (profile.dateOfBirth) {
      const parsedDate = parseDateString(profile.dateOfBirth);
      if (parsedDate) {
        setSelectedDate(parsedDate);
      }
    }
    
    setIsEditingProfile(false);
    setShowDatePicker(false);
    setShowBloodTypePicker(false);
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

  const formatEmergencyContactsDisplay = () => {
    if (!profile.emergencyContacts || profile.emergencyContacts.length === 0) {
      return 'Not provided';
    }
    return profile.emergencyContacts
      .map(contact => `${contact.name} - ${contact.phone}`)
      .join('\n');
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

          {/* Total Time Card */}
          <View style={styles.hoursCard}>
            <Text style={styles.hoursLabel}>Total Training Time</Text>
            <View style={styles.hoursContent}>
              <Clock color="#2563eb" size={28} />
              <Text style={styles.hoursValue}>{formatTimeDisplay(profile.totalTime || 0)}</Text>
            </View>
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
                <>
                  <TouchableOpacity
                    onPress={openDatePicker}
                    style={styles.datePickerButton}
                    disabled={isSaving}
                  >
                    <Calendar color="#2563eb" size={20} />
                    <Text style={styles.datePickerButtonText}>
                      {formData.dateOfBirth || 'Select Date'}
                    </Text>
                  </TouchableOpacity>

                  {/* iOS Modal Picker */}
                  {Platform.OS === 'ios' && showDatePicker && (
                    <Modal
                      transparent={true}
                      animationType="slide"
                      visible={showDatePicker}
                      onRequestClose={closeDatePicker}
                    >
                      <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                          <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={closeDatePicker}>
                              <Text style={styles.modalDoneButton}>Done</Text>
                            </TouchableOpacity>
                          </View>
                          <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            textColor="#000000"
                          />
                        </View>
                      </View>
                    </Modal>
                  )}

                  {/* Android Inline Picker */}
                  {Platform.OS === 'android' && showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                    />
                  )}
                </>
              ) : (
                <Text style={styles.fieldValue}>{formData.dateOfBirth || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.emergencyContactHeader}>
                <Text style={styles.fieldLabel}>Emergency Contacts</Text>
                {isEditingProfile && formData.emergencyContacts.length < 3 && (
                  <TouchableOpacity 
                    onPress={addEmergencyContact}
                    style={styles.addContactButton}
                    disabled={isSaving}
                  >
                    <Plus color="#2563eb" size={20} />
                    <Text style={styles.addContactText}>Add Contact</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {isEditingProfile ? (
                <View style={styles.emergencyContactsContainer}>
                  {formData.emergencyContacts.map((contact, index) => (
                    <View key={index} style={styles.emergencyContactRow}>
                      <View style={styles.emergencyContactInputs}>
                        <TextInput
                          value={contact.name}
                          onChangeText={(text) => updateEmergencyContact(index, 'name', text)}
                          placeholder="Name"
                          placeholderTextColor="#94a3b8"
                          style={[styles.input, styles.emergencyContactInput]}
                          editable={!isSaving}
                        />
                        <TextInput
                          value={contact.phone}
                          onChangeText={(text) => updateEmergencyContact(index, 'phone', text)}
                          placeholder="(555) 123-4567"
                          placeholderTextColor="#94a3b8"
                          style={[styles.input, styles.emergencyContactInput]}
                          keyboardType="phone-pad"
                          editable={!isSaving}
                        />
                      </View>
                      {formData.emergencyContacts.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeEmergencyContact(index)}
                          style={styles.removeContactButton}
                          disabled={isSaving}
                        >
                          <Trash2 color="#ef4444" size={20} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.fieldValue}>{formatEmergencyContactsDisplay()}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Blood Type</Text>
              {isEditingProfile ? (
                <>
                  <TouchableOpacity
                    onPress={openBloodTypePicker}
                    style={styles.bloodTypeButton}
                    disabled={isSaving}
                  >
                    <Text style={[
                      styles.bloodTypeButtonText,
                      !formData.bloodtype && styles.bloodTypePlaceholder
                    ]}>
                      {formData.bloodtype || 'Select Blood Type'}
                    </Text>
                    <ChevronDown color="#2563eb" size={20} />
                  </TouchableOpacity>

                  {/* Blood Type Picker Modal */}
                  <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showBloodTypePicker}
                    onRequestClose={closeBloodTypePicker}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.bloodTypeModalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.bloodTypeModalTitle}>Select Blood Type</Text>
                          <TouchableOpacity onPress={closeBloodTypePicker}>
                            <Text style={styles.modalDoneButton}>Done</Text>
                          </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.bloodTypeList}>
                          {BLOOD_TYPES.map((bloodType) => (
                            <TouchableOpacity
                              key={bloodType}
                              style={[
                                styles.bloodTypeOption,
                                formData.bloodtype === bloodType && styles.bloodTypeOptionSelected
                              ]}
                              onPress={() => selectBloodType(bloodType)}
                            >
                              <Text style={[
                                styles.bloodTypeOptionText,
                                formData.bloodtype === bloodType && styles.bloodTypeOptionTextSelected
                              ]}>
                                {bloodType}
                              </Text>
                              {formData.bloodtype === bloodType && (
                                <Check color="#2563eb" size={20} />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
                </>
              ) : (
                <Text style={styles.fieldValue}>{formData.bloodtype || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Allergies</Text>
              {isEditingProfile ? (
                <TextInput
                  value={formData.allergies}
                  onChangeText={(text) => setFormData({...formData, allergies: text})}
                  placeholder="None, or list any allergies..."
                  placeholderTextColor="#94a3b8"
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  editable={!isSaving}
                />
              ) : (
                <Text style={styles.fieldValue}>{formData.allergies || 'Not provided'}</Text>
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
              onPress={() => handleButtonPress('AIChatScreen')}
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
  hoursCard: {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 3,
  alignItems: 'center', 
  },
  hoursContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, 
  },
  hoursLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
  },
  hoursValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
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
  datePickerButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalDoneButton: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2563eb',
  },
  bloodTypeButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bloodTypeButtonText: {
    fontSize: 16,
    color: '#0f172a',
    flex: 1,
  },
  bloodTypePlaceholder: {
    color: '#94a3b8',
  },
  bloodTypeModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  bloodTypeModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    textAlign: 'center',
  },
  bloodTypeList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bloodTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  bloodTypeOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  bloodTypeOptionText: {
    fontSize: 18,
    color: '#0f172a',
    fontWeight: '500',
  },
  bloodTypeOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '700',
  },
  emergencyContactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  addContactText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  emergencyContactsContainer: {
    gap: 12,
  },
  emergencyContactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  emergencyContactInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  emergencyContactInput: {
    flex: 1,
  },
  removeContactButton: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
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