import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import app from '../../firebaseConfig';

class AIService {
  constructor() {
    this.functions = getFunctions(app);
    
    // Connect to local emulator during development
    if (__DEV__) {
      connectFunctionsEmulator(this.functions, 'localhost', 5001);
    }
  }

  async processMessage(message, conversationHistory = []) {
    try {
      const processAIChat = httpsCallable(this.functions, 'processAIChat');
      const result = await processAIChat({ message, conversationHistory });
      return result.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  async testServices() {
    try {
      const testAIServices = httpsCallable(this.functions, 'testAIServices');
      const result = await testAIServices({});
      return result.data;
    } catch (error) {
      console.error('AI Test Error:', error);
      throw error;
    }
  }
}

export default new AIService();