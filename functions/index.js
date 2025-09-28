// Load environment variables
require('dotenv').config();

const functions = require('firebase-functions');
const { onCall, onRequest } = require('firebase-functions/v2/https');
const { HfInference } = require('@huggingface/inference');
const OpenAI = require('openai');
const NodeCache = require('node-cache');

// Initialize AI services
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY,});
// Cache for performance (10 minutes)
const cache = new NodeCache({ stdTTL: 300 });

// Define Hugging Face function
exports.queryHuggingFace = onRequest({ cors: true }, async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const result = await hf.textGeneration({
      model: 'gpt2', // or your preferred model
      inputs: prompt,
    });

    res.status(200).send(result);
  } catch (error) {
    console.error('Hugging Face error:', error);
    res.status(500).send({ error: 'Failed to query Hugging Face' });
  }
});

// Define OpenAI function (with optional caching)
exports.queryOpenAI = onRequest({ cors: true }, async (req, res) => {
  const prompt = req.body.prompt;
  const cached = cache.get(prompt);

  if (cached) {
    return res.status(200).send(cached);
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = chatCompletion.choices[0].message;
    cache.set(prompt, response);
    res.status(200).send(response);
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).send({ error: 'Failed to query OpenAI' });
  }
});

// Medical scenarios
const MEDICAL_SCENARIOS = {
  emergency: {
    triggers: ['chest pain', 'difficulty breathing', 'severe', 'emergency', 'unconscious'],
    systemPrompt: 'You are an emergency medical assistant. For emergency symptoms, immediately advise seeking emergency medical care. Be calm but urgent.',
    template: '🚨 URGENT: {response}\n\nIf this is a medical emergency, call 911 immediately.'
  },
  mental_health: {
    triggers: ['anxious', 'depressed', 'stress', 'panic', 'suicide'],
    systemPrompt: 'You are a compassionate mental health support assistant. Provide emotional validation and suggest professional help when appropriate.',
    template: 'Mental Health Support: {response}\n\n💚 Consider speaking with a mental health professional.'
  },
  chronic_care: {
    triggers: ['diabetes', 'hypertension', 'chronic', 'blood pressure', 'medication'],
    systemPrompt: 'You are a chronic care specialist. Focus on long-term management and medication adherence.',
    template: 'Chronic Care: {response}\n\n📅 Remember regular check-ups with your healthcare provider.'
  },
  general: {
    triggers: ['headache', 'tired', 'symptoms', 'health'],
    systemPrompt: 'You are a helpful medical assistant. Provide general health information and encourage consulting healthcare professionals.',
    template: 'Health Information: {response}\n\n📚 For personalized advice, consult with a healthcare professional.'
  }
};

// Utility Functions
function detectScenario(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const [scenario, config] of Object.entries(MEDICAL_SCENARIOS)) {
    for (const trigger of config.triggers) {
      if (lowerMessage.includes(trigger)) {
        return { scenario, config };
      }
    }
  }
  
  return { scenario: 'general', config: MEDICAL_SCENARIOS.general };
}

function extractMedicalTerms(text) {
  const lowerText = text.toLowerCase();
  
  const symptoms = ['pain', 'headache', 'fever', 'nausea', 'dizziness', 'fatigue', 'chest pain'];
  const conditions = ['diabetes', 'hypertension', 'asthma', 'depression', 'anxiety'];
  const medications = ['insulin', 'aspirin', 'antibiotics', 'ibuprofen'];
  
  return {
    symptoms: symptoms.filter(s => lowerText.includes(s)),
    conditions: conditions.filter(c => lowerText.includes(c)),
    medications: medications.filter(m => lowerText.includes(m))
  };
}

// AI Service Functions

// 1. Medical Analysis
async function analyzeMedicalText(text) {
  try {
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: `Medical context: ${text}\nKey medical terms:`,
      parameters: {
        max_new_tokens: 30,
        temperature: 0.3
      }
    });

    return {
      success: true,
      analysis: response.generated_text,
      medicalTerms: extractMedicalTerms(text)
    };
  } catch (error) {
    console.error('Medical analysis error:', error);
    return {
      success: false,
      error: error.message,
      medicalTerms: extractMedicalTerms(text)
    };
  }
}

// 2. Conversational AI
async function generateConversation(message, history = []) {
  try {
    const context = history.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n');
    const input = `${context}\nUser: ${message}\nAssistant:`;

    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: input,
      parameters: {
        max_new_tokens: 80,
        temperature: 0.7
      }
    });

    const cleanResponse = response.generated_text.replace(input, '').trim();
    
    return {
      success: true,
      response: cleanResponse,
      confidence: Math.min(0.9, cleanResponse.length / 50)
    };
  } catch (error) {
    console.error('Conversation error:', error);
    return {
      success: false,
      error: error.message,
      confidence: 0
    };
  }
}

// 3. Quality Assessment
function assessQuality(question, response) {
  try {
    const questionWords = question.toLowerCase().split(' ').filter(w => w.length > 3);
    const responseWords = response.toLowerCase().split(' ');
    
    const matches = questionWords.filter(word => 
      responseWords.some(rWord => rWord.includes(word))
    );
    
    const relevanceScore = matches.length / Math.max(questionWords.length, 1);
    const lengthScore = Math.min(1, response.length / 100);
    const qualityScore = (relevanceScore + lengthScore) / 2;
    
    return {
      success: true,
      qualityScore,
      relevance: relevanceScore,
      assessment: qualityScore > 0.7 ? 'good' : qualityScore > 0.4 ? 'fair' : 'poor'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      qualityScore: 0.5
    };
  }
}

// 4. OpenAI GPT-4
async function generateOpenAIResponse(messages, scenario = 'general') {
  try {
    const scenarioConfig = MEDICAL_SCENARIOS[scenario] || MEDICAL_SCENARIOS.general;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: scenarioConfig.systemPrompt },
        ...messages
      ],
      max_tokens: 250,
      temperature: 0.3
    });

    return {
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenAI error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Main AI Orchestrator
async function processAIMessage(message, conversationHistory = []) {
  try {
    console.log('Processing message:', message);
    
    // 1. Detect medical scenario
    const { scenario, config } = detectScenario(message);
    console.log('Detected scenario:', scenario);
    
    // 2. Analyze medical content
    const medicalAnalysis = await analyzeMedicalText(message);
    
    // 3. For emergency scenarios, go straight to OpenAI
    if (scenario === 'emergency') {
      const openaiResponse = await generateOpenAIResponse(
        [...conversationHistory, { role: 'user', content: message }],
        scenario
      );
      
      const finalResponse = openaiResponse.success ? 
        config.template.replace('{response}', openaiResponse.response) :
        '🚨 This appears to be an emergency. Please call 911 or go to the nearest emergency room immediately.';
      
      return {
        success: true,
        response: finalResponse,
        metadata: {
          scenario,
          responseSource: 'openai-emergency',
          medicalAnalysis: medicalAnalysis.success ? medicalAnalysis : null,
          timestamp: new Date().toISOString()
        }
      };
    }
    
    // 4. For non-emergency, try conversational AI first
    const conversationResponse = await generateConversation(message, conversationHistory);
    
    let finalResponse;
    let responseSource;
    
    if (conversationResponse.success && conversationResponse.confidence > 0.6) {
      // 5. Assess quality
      const quality = assessQuality(message, conversationResponse.response);
      
      if (quality.qualityScore > 0.5) {
        finalResponse = conversationResponse.response;
        responseSource = 'huggingface';
      } else {
        // Fallback to OpenAI
        const openaiResponse = await generateOpenAIResponse(
          [...conversationHistory, { role: 'user', content: message }],
          scenario
        );
        finalResponse = openaiResponse.success ? openaiResponse.response : conversationResponse.response;
        responseSource = 'openai-fallback';
      }
    } else {
      // Direct OpenAI fallback
      const openaiResponse = await generateOpenAIResponse(
        [...conversationHistory, { role: 'user', content: message }],
        scenario
      );
      finalResponse = openaiResponse.success ? openaiResponse.response : 
        'I apologize, but I cannot process your request right now. Please consult a healthcare professional.';
      responseSource = 'openai-direct';
    }
    
    // Apply scenario template
    finalResponse = config.template.replace('{response}', finalResponse);
    
    return {
      success: true,
      response: finalResponse,
      metadata: {
        scenario,
        responseSource,
        medicalAnalysis: medicalAnalysis.success ? medicalAnalysis : null,
        timestamp: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('AI processing error:', error);
    return {
      success: false,
      error: error.message,
      response: 'I encountered an error. Please try again or consult a healthcare professional.'
    };
  }
}

// Firebase Cloud Functions - All using v2 syntax

// Main AI chat function
exports.processAIChat = onCall({ 
  timeoutSeconds: 300, 
  memory: '1GiB' 
}, async (request) => {
  const { message, conversationHistory = [] } = request.data;

  if (!message) {
    throw new functions.https.HttpsError('invalid-argument', 'Message is required');
  }

  try {
    const result = await processAIMessage(message, conversationHistory);
    return result;
  } catch (error) {
    console.error('AI chat error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to process AI chat');
  }
});

// Test function - Updated to v2 syntax
exports.testAIServices = onCall({}, async (request) => {
  const results = {};
  
  // Test Hugging Face
  try {
    const hfTest = await hf.textGeneration({
      model: 'gpt2',
      inputs: 'Hello',
      parameters: { max_new_tokens: 5 }
    });
    results.huggingface = { success: true, status: 'Connected' };
  } catch (error) {
    results.huggingface = { success: false, error: error.message };
  }
  
  // Test OpenAI
  try {
    const openaiTest = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5
    });
    results.openai = { success: true, status: 'Connected' };
  } catch (error) {
    results.openai = { success: false, error: error.message };
  }
  
  return {
    timestamp: new Date().toISOString(),
    services: results
  };
});

// Health check - Updated to v2 syntax
exports.healthCheck = onRequest({}, (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: ['huggingface', 'openai', 'medical-analysis', 'conversation'],
    version: '1.0.0'
  });
});