const BASE_URL = 'https://us-central1-emt-triage-training-app.cloudfunctions.net/api';



class AIService {
  async processMessage(message, conversationHistory = []) {
    try {
      const response = await fetch(`${BASE_URL}/process-ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationHistory })
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
          response: null,
          metadata: null,
          error: 'Invalid JSON response from backend'
        };
      }

      console.log('✅ Parsed AI Response:', result);

      return {
        success: true,
        response: result.response,
        metadata: result.metadata
      };
    } catch (error) {
      console.error('❌ AI Service Error:', error);
      return {
        success: false,
        response: null,
        metadata: null,
        error: error.message
      };
    }
  }

  async testServices() {
    try {
      const response = await fetch(`${BASE_URL}/test-ai-services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const text = await response.text();
      console.log('🧪 Raw test response:', text);

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('❌ Test JSON Parse Error:', parseError);
        return {
          success: false,
          services: null,
          error: 'Invalid JSON response from test endpoint'
        };
      }

      console.log('🧪 Parsed Test Results:', result);

      return {
        success: true,
        services: result.services,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.error('❌ AI Test Error:', error);
      return {
        success: false,
        services: null,
        error: error.message
      };
    }
  }
}

export default new AIService();
