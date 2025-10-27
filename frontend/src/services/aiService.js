const BASE_URL = 'https://us-central1-emt-triage-training-app.cloudfunctions.net';

class AIService {
  async processMessage(message, conversationHistory = [], userId = 'unknown', scenarioId = 'general') {
    try {
      

      const response = await fetch(`${BASE_URL}/aiRespond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, userId, scenarioId, messages: conversationHistory })
      });
      console.log('📤 Sending payload:', {
        prompt: message,
        userId,
        scenarioId,
        messages: conversationHistory
      });

      const text = await response.text();
      console.log('🧾 Raw response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        return {
          success: false,
          response: 'AI is unavailable. Please refer to protocol guidance.',
          metadata: { source: 'fallback' },
          error: 'Invalid JSON response from backend'
        };
      }

      console.log('✅ Parsed AI Response:', result);

      // Fallback if response is empty or missing
      if (!result.response || result.response.trim() === '') {
        console.warn('⚠️ Empty AI response — using fallback');
        return {
          success: false,
          response: 'AI is temporarily unavailable. Please refer to protocol guidance.',
          metadata: { source: 'fallback' },
          error: 'Empty response from AI'
        };
      }

      return {
        success: true,
        response: result.response,
        metadata: result.metadata || { source: 'openai' }
      };
    } catch (error) {
      console.error('❌ AI Service Error:', error);
      return {
        success: false,
        response: 'AI is unavailable. Please refer to protocol guidance.',
        metadata: { source: 'fallback' },
        error: error.message
      };
    }
  }

  async testServices() {
    // Optional: you can remove this if you're no longer using Hugging Face
    return {
      success: false,
      services: null,
      error: 'Test endpoint not supported with OpenAI backend'
    };
  }
}

export default new AIService();
