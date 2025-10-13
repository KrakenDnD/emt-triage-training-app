import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, TextInput, ActivityIndicator } from 'react-native';

export default function MedicalConditions({ navigation, route }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [conditionData, setConditionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        //check if data was passed from navigation
        if (route?.params?.preloadedData) {
          setConditionData(route.params.preloadedData);
          setIsLoading(false);
        } else {
          //load data for the first time
          const data = require('../assets/medicalconditions.json');
          setConditionData(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading medical data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [route?.params?.preloadedData]);

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  if (isLoading || !conditionData) {
    return (
      <View style={styles.container}>
        <View style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Loading medical database...</Text>
          </View>
        </View>
      </View>
    );
  }

  const filteredData = conditionData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.primary_name?.toLowerCase().includes(query) ||
      item.consumer_name?.toLowerCase().includes(query) ||
      item.synonyms?.some(syn => syn.toLowerCase().includes(query))
    );
  });

  const organizedData = {};
  filteredData.forEach(item => {
    const firstLetter = item.primary_name[0].toUpperCase();
    if (!organizedData[firstLetter]) {
      organizedData[firstLetter] = [];
    }
    organizedData[firstLetter].push(item);
  });

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <TouchableOpacity style={styles.backButton} onPress={() => handleBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Medical Conditions & Procedures</Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search conditions..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
          <View style={styles.tableContainer}>
            {Object.keys(organizedData).sort().map(letter => (
              <View key={letter}>
                <View style={styles.letterHeader}>
                  <Text style={styles.letterText}>{letter}</Text>
                </View>

                {organizedData[letter].map((item, index) => {
                  const itemKey = `${letter}-${index}`;
                  const isExpanded = expandedItems[itemKey];

                  return (
                    <TouchableOpacity
                      key={itemKey}
                      onPress={() => toggleExpand(itemKey)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          <View style={styles.headerLeft}>
                            <Text style={styles.primaryName}>{item.primary_name}</Text>
                            {item.consumer_name && (
                              <Text style={styles.consumerName}>({item.consumer_name})</Text>
                            )}
                            {item.is_procedure && (
                              <View style={styles.procedureBadge}>
                                <Text style={styles.procedureBadgeText}>PROCEDURE</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
                        </View>

                        {isExpanded && (
                          <View style={styles.expandedContent}>
                            {/* ICD Codes */}
                            <View style={styles.section}>
                              <Text style={styles.sectionLabel}>Diagnostic Codes:</Text>
                              {item.term_icd9_code && (
                                <Text style={styles.codeText}>ICD-9: {item.term_icd9_code}</Text>
                              )}
                              {item.icd10cm_codes && item.icd10cm_codes.length > 0 && (
                                <Text style={styles.codeText}>
                                  ICD-10: {item.icd10cm_codes.join(', ')}
                                </Text>
                              )}
                            </View>

                            {/* Synonyms */}
                            {item.synonyms && item.synonyms.length > 0 && (
                              <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Also known as:</Text>
                                {item.synonyms.map((syn, i) => (
                                  <Text key={i} style={styles.synonymText}>• {syn}</Text>
                                ))}
                              </View>
                            )}

                            {/* Info Links */}
                            {item.info_link_data && item.info_link_data.length > 0 && (
                              <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Learn More:</Text>
                                {item.info_link_data.map((link, i) => (
                                  <TouchableOpacity
                                    key={i}
                                    onPress={() => openLink(link.url)}
                                    style={styles.linkButton}
                                  >
                                    <Text style={styles.linkText}>
                                      📖 {link.title || 'View Resource'}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={styles.spacer} />
        </ScrollView>

        <Text style={styles.footer}>Developed by CodeBlue Collective</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#2c5282',
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
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollView: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  letterHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  letterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  itemCard: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  primaryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  consumerName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  procedureBadge: {
    backgroundColor: 'rgba(100, 200, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  procedureBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  expandIcon: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 12,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  synonymText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  linkText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  spacer: {
    height: 80,
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