require('dotenv').config();
const { onCall, onRequest } = require('firebase-functions/v2/https');
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

const MEDICAL_SCENARIOS = {
  emergency: {
    triggers: ['chest pain', 'difficulty breathing', 'severe', 'emergency', 'unconscious'],
    systemPrompt: 'You are an emergency medical assistant. Advise immediate care calmly but urgently.',
    template: '🚨 Emergency: {response}\n\nCall 911 or go to the ER immediately.'
  },
  mental_health: {
    triggers: ['anxious', 'depressed', 'stress', 'panic', 'suicide'],
    systemPrompt: 'You are a compassionate mental health assistant.',
    template: '💚 Mental Health Support: {response}\n\nConsider speaking with a professional.'
  },
  chronic_care: {
    triggers: ['diabetes', 'hypertension', 'chronic', 'blood pressure', 'medication'],
    systemPrompt: 'You are a chronic care specialist.',
    template: '📅 Chronic Care: {response}\n\nRemember regular check-ups.'
  },
  general: {
    triggers: ['headache', 'tired', 'symptoms', 'health'],
    systemPrompt: 'You are a helpful medical assistant.',
    template: '📚 Health Info: {response}\n\nConsult a healthcare professional for personalized advice.'
  }
};

function detectScenario(message) {
  const lower = message.toLowerCase();
  for (const [scenario, config] of Object.entries(MEDICAL_SCENARIOS)) {
    if (config.triggers.some(trigger => lower.includes(trigger))) {
      return { scenario, config };
    }
  }
  return { scenario: 'general', config: MEDICAL_SCENARIOS.general };
}

async function analyzeMedicalText(text) {
  try {
    const response = await hf.featureExtraction({
      model: 'dmis-lab/biobert-base-cased-v1.1',
      inputs: text
    });
    return {
      success: true,
      embedding: response,
      keywords: text.split(' ').filter(w => w.length > 4)
    };
  } catch (error) {
    console.error('BioBERT error:', error);
    return { success: false, error: error.message };
  }
}

async function generateConversation(message, history = []) {
  try {
    const messages = [
      { role: 'system', content: 'You are a helpful medical assistant.' },
      ...history.slice(-3),
      { role: 'user', content: message }
    ];
    const response = await hf.chatCompletion({
      model: 'openai/gpt-oss-120b',
      messages,
      parameters: { max_new_tokens: 80, temperature: 0.7 }
    });
    const content = response?.choices?.[0]?.message?.content?.trim() || '';
    return { success: true, response: content, confidence: Math.min(0.9, content.length / 50) };
  } catch (error) {
    console.error('OSS 120B error:', error);
    return await generateDialoGPTFallback(message);
  }
}

async function generateDialoGPTFallback(message) {
  try {
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: `User: ${message}\nAssistant:`,
      parameters: { max_new_tokens: 80, temperature: 0.7 }
    });
    const text = response?.generated_text?.split('Assistant:')[1]?.trim() || 'Sorry, I couldn’t generate a response.';
    return { success: true, response: text, confidence: Math.min(0.7, text.length / 50) };
  } catch (error) {
    console.error('DialoGPT error:', error);
    return { success: false, error: error.message, response: '⚠️ AI assistant failed to respond.' };
  }
}

async function assessQuality(question, response) {
  try {
    const result = await hf.sentenceSimilarity({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: {
        source_sentence: question,
        sentences: [response]
      }
    });
    const score = result?.[0] || 0;
    return {
      success: true,
      qualityScore: score,
      assessment: score > 0.7 ? 'good' : score > 0.4 ? 'fair' : 'poor'
    };
  } catch (error) {
    console.error('Sentence similarity error:', error);
    return { success: false, error: error.message, qualityScore: 0.5 };
  }
}

async function processAIMessage(message, history = []) {
  try {
    const { scenario, config } = detectScenario(message);
    const medicalAnalysis = await analyzeMedicalText(message);
    const convo = await generateConversation(message, history);
    const quality = await assessQuality(message, convo.response);

    let finalResponse = convo.response;
    let source = 'oss-120b';

    if (!convo.success || convo.confidence < 0.6 || quality.qualityScore < 0.5) {
      finalResponse = 'I’m sorry, I couldn’t generate a confident response. Please consult a healthcare professional.';
      source = 'fallback';
    }

    finalResponse = config.template.replace('{response}', finalResponse);

    return {
      success: true,
      response: finalResponse,
      metadata: {
        scenario,
        responseSource: source,
        medicalAnalysis,
        quality,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('AI orchestration error:', error);
    return {
      success: false,
      error: error.message,
      response: '⚠️ An error occurred. Please try again or consult a healthcare professional.'
    };
  }
}

exports.processAIChat = onCall({ timeoutSeconds: 300, memory: '1GiB' }, async (request) => {
  const { message, conversationHistory = [] } = request.data;
  if (!message) throw new Error('Message is required');
  return await processAIMessage(message, conversationHistory);
});

exports.testAIServices = onCall({}, async () => {
  const results = {};
  try {
    await hf.chatCompletion({
      model: 'openai/gpt-oss-120b',
      messages: [{ role: 'user', content: 'Hello' }],
      parameters: { max_new_tokens: 5 }
    });
    results.oss120b = { success: true };
  } catch (error) {
    results.oss120b = { success: false, error: error.message };
  }

  try {
    await hf.featureExtraction({
      model: 'dmis-lab/biobert-base-cased-v1.1',
      inputs: 'Test'
    });
    results.biobert = { success: true };
  } catch (error) {
    results.biobert = { success: false, error: error.message };
  }

  try {
    await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: 'Hello'
    });
    results.dialogpt = { success: true };
  } catch (error) {
    results.dialogpt = { success: false, error: error.message };
  }

  try {
    await hf.sentenceSimilarity({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: {
        source_sentence: 'Hello',
        sentences: ['Hi']
      }
    });
    results.similarity = { success: true };
  } catch (error) {
    results.similarity = { success: false, error: error.message };
  }

  return {
    timestamp: new Date().toISOString(),
    services: results
  };
});

exports.healthCheck = onRequest({}, (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: ['oss-120b', 'biobert', 'dialogpt', 'similarity'],
    version: '3.0.0'
  });
});
