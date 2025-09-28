import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AIService from '../services/aiService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const AIChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const scrollViewRef = useRef(null);

  // Welcome message
  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your EMT AI assistant. I can help with medical triage and provide guidance. What symptoms or concerns would you like to discuss?',
      timestamp: new Date(),
      metadata: { scenario: 'system' }
    }]);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        Alert.alert('Session expired', 'Please log in again.');
        // navigation.navigate('Login'); // Uncomment if using navigation
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: inputMessage }]);

    const currentInput = inputMessage;
    setInputMessage('');
    setLoading(true);

    try {
      const result = await AIService.processMessage(currentInput, conversationHistory);

      if (result.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: result.response,
          timestamp: new Date(),
          metadata: result.metadata
        };

        setMessages(prev => [...prev, botMessage]);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: result.response }]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EMT AI Assistant</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map(message => (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer,
                message.type === 'user' ? styles.userMessage : styles.botMessage
              ]}
            >
              <Text style={styles.messageText}>{message.content}</Text>
              {message.metadata?.scenario && (
                <Text style={styles.scenarioText}>
                  Scenario: {message.metadata.scenario}
                </Text>
              )}
            </View>
          ))}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is analyzing...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Describe symptoms..."
            multiline
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  scenarioText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ced4da',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AIChatScreen;
