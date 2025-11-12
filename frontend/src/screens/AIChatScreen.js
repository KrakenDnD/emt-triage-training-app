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

const AIChatScreen = ({ route, navigation }) => {
  const { initialMessage, scenarioId = 'general' } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userId, setUserId] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m EMTelligence, your AI chat assisstant. I can help with medical triage and provide guidance. What symptoms or concerns would you like to discuss?',
      timestamp: new Date(),
      metadata: { scenario: 'system' }
    }]);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        Alert.alert('Session expired', 'Please log in again.');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initialMessage && userId) {
      const systemPrompt = {
        role: 'system',
        content: 'You are an EMT training assistant. Provide clear, scenario-based feedback and explain missed steps when asked.'
      };

      const preloadHistory = [systemPrompt, { role: 'user', content: initialMessage }];
      setConversationHistory(preloadHistory);

      const preloadMessage = {
        id: Date.now(),
        type: 'user',
        content: initialMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, preloadMessage]);
      setLoading(true);

      AIService.processMessage(initialMessage, preloadHistory, userId, scenarioId)
        .then(result => {
          console.log('✅ Parsed AI Response:', result);
          console.log('🧠 Sending to AI:', {
            message: initialMessage,
            conversationHistory: preloadHistory,
            userId,
            scenarioId
          });

          if (result.success && result.response?.trim()) {
            const botMessage = {
              id: Date.now() + 1,
              type: 'bot',
              content: result.response,
              timestamp: new Date(),
              metadata: result.metadata
            };
            setMessages(prev => [...prev, botMessage]);
            setConversationHistory(prev => [...prev, { role: 'assistant', content: result.response }]);
          } else {
            const fallback = {
              id: Date.now() + 1,
              type: 'bot',
              content: 'Sorry, I wasn’t able to generate a helpful clarification. Want to rephrase or try again?',
              timestamp: new Date(),
              metadata: { scenario: 'fallback' }
            };
            setMessages(prev => [...prev, fallback]);
          }
        })
        .catch((err) => {
          console.error('❌ AI request failed:', err);
          Alert.alert('Error', 'Failed to get AI response. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [initialMessage, userId]);

  const handleSendMessage = async (overrideMessage = null) => {
    const messageToSend = overrideMessage || inputMessage;
    if (!messageToSend.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content: messageToSend }]);

    if (!overrideMessage) setInputMessage('');
    setLoading(true);

    try {
      const result = await AIService.processMessage(messageToSend, conversationHistory, userId, scenarioId);

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
        <Text style={styles.headerTitle}>EMTelligence</Text>
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
              {message.metadata?.source && (
                <Text style={styles.sourceText}>
                  Source: {message.metadata.source === 'openai' ? 'AI-generated' : 'Fallback guidance'}
                </Text>
              )}
              {message.type === 'bot' && message.content !== 'Sorry, I wasn’t able to generate a helpful clarification. Want to rephrase or try again?' && (
                <TouchableOpacity onPress={() => handleSendMessage(initialMessage)}>
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>AI is analyzing...</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Review</Text>
        </TouchableOpacity>

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
            onPress={() => handleSendMessage()}
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
  sourceText: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  retryText: {
    color: '#2563eb',
    fontWeight: '600',
    marginTop: 8,
  },
  backText: {
    color: '#64748b',
    fontWeight: '600',
    margin: 16,
    textAlign: 'center',
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
  sourceText: {
  fontSize: 12,
  color: '#94a3b8',
  marginTop: 4,
  fontStyle: 'italic',
}

});

export default AIChatScreen;
