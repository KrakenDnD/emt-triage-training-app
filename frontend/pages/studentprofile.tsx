import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
//import type { ProfileDto, UpdateProfileDto } from "@/types/api"

interface ProfileDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  email?: string;
}

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

// ============================================================================
// API SERVICE (Move to separate file: services/profileService.ts)
// ============================================================================

class ProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com') {
    this.baseUrl = baseUrl;
  }

  async getMyProfile(): Promise<ProfileDto> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/profile/me`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${await getAuthToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch profile');
    // return await response.json();
    
    // Dummy data for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          firstName: 'Hatsune',
          lastName: 'Miku',
          avatarUrl: undefined,
        });
      }, 500);
    });
  }

  async updateMyProfile(data: UpdateProfileDto): Promise<ProfileDto> {
    // TODO: Replace with actual API call
    // const response = await fetch(`${this.baseUrl}/profile/me`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${await getAuthToken()}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });
    // if (!response.ok) throw new Error('Failed to update profile');
    // return await response.json();
    
    // Dummy response for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          ...data,
        });
      }, 500);
    });
  }

  async uploadAvatar(imageUri: string): Promise<string> {
    // TODO: Replace with actual upload logic
    // const formData = new FormData();
    // formData.append('avatar', {
    //   uri: imageUri,
    //   type: 'image/jpeg',
    //   name: 'avatar.jpg',
    // } as any);
    // 
    // const response = await fetch(`${this.baseUrl}/profile/avatar`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${await getAuthToken()}`,
    //   },
    //   body: formData,
    // });
    // if (!response.ok) throw new Error('Failed to upload avatar');
    // const data = await response.json();
    // return data.avatarUrl;
    
    // Return local URI for now
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(imageUri);
      }, 500);
    });
  }
}
  
const profileService = new ProfileService();

export default function StudentProfile({ navigation }) {
  const [profile, setProfile] = useState<ProfileDto>({
    firstName: 'Hatsune',
    lastName: 'Miku',
  });
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

    const handleButtonPress = (route) => {
  try {
    navigation.navigate(route);
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

  // Default avatar
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
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile. Using default values.');
      // Keep dummy data on error
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      setIsSaving(true);
      const avatarUrl = await profileService.uploadAvatar(imageUri);
      
      // Update profile with new avatar URL
      const updatedProfile = await profileService.updateMyProfile({ avatarUrl });
      setProfile(updatedProfile);
      
      Alert.alert('Success', 'Avatar updated successfully!');
    } catch (err) {
      console.error('Failed to upload avatar:', err);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
      setLocalAvatarUri(null); 
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Validation Error', 'First name and last name are required.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateProfileDto = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      const updatedProfile = await profileService.updateMyProfile(updateData);
      
      setProfile(updatedProfile);
      setFirstName(updatedProfile.firstName || '');
      setLastName(updatedProfile.lastName || '');
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
    setFirstName(profile.firstName || '');
    setLastName(profile.lastName || '');
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
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.card}>
          {/* Three Dots Menu */}
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              onPress={() => setDropdownVisible(!dropdownVisible)}
              style={styles.menuButton}
            >
              <Text style={styles.menuDots}>⋮</Text>
            </TouchableOpacity>
            
            {dropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setIsEditingProfile(true);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Profile Content */}
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <Image source={getAvatarSource()} style={styles.avatar} />
              {isSaving && (
                <View style={styles.avatarOverlay}>
                  <ActivityIndicator size="small" color="#ffffff" />
                </View>
              )}
            </View>

            {/* Identifying Info */}
            <View style={styles.nameSection}>
              {isEditingProfile ? (
                <View style={styles.nameContainer}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor="#666"
                    style={styles.nameInput}
                    returnKeyType="next"
                    editable={!isSaving}
                  />
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor="#666"
                    style={styles.nameInput}
                    returnKeyType="done"
                    editable={!isSaving}
                  />
                </View>
              ) : (
                <Text style={styles.nameText}>
                  {firstName || 'First'} {lastName || 'Last'}
                </Text>
              )}
            </View>
          </View>

          {/* Profile Editing Buttons */}
          {isEditingProfile && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={cancelEdit}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={saveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Navigation Buttons */}
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => handleButtonPress('ScenarioSelect')}
          >
            <Text style={styles.mainButtonText}>Scenario Selection</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => handleButtonPress('AIChat')} 
          >
            <Text style={styles.mainButtonText}>Ask EMTelligence A Question</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => handleButtonPress('ReferenceLib')}
          >
            <Text style={styles.mainButtonText}>Reference Library</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mainButton}
        //    onPress={() => handleButtonPress('Analytics')}
          >
            <Text style={styles.mainButtonText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.mainButton}
        //    onPress={() => handleButtonPress('History')}
          >
            <Text style={styles.mainButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
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
    paddingHorizontal: 20,
    paddingTop: 160,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  errorBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#d9dfe6',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  menuContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
  },
  menuDots: {
    fontSize: 24,
    color: '#1a365d',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 150,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 0,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1a365d',
    fontWeight: '500',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1a365d',
  },
  avatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    flex: 1,
  },
  nameContainer: {
    width: '100%',
    gap: 12,
  },
  nameInput: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.16)',
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1a365d',
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#1a365d',
  },
  saveButton: {
    backgroundColor: '#1a365d',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a365d',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#1a365d',
    fontSize: 16,
    fontWeight: '600',
  },
  mainButton: {
    backgroundColor: '#1a365dcf',
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});