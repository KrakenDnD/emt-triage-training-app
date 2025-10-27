const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const OPENAI_KEY = process.env.OPENAI_API_KEY;
console.log('🔑 OpenAI Key Loaded:', !!OPENAI_KEY);

exports.aiRespond = functions.https.onRequest(async (req, res) => {
  const { userId, scenarioId, prompt, conversationHistory } = req.body;

  if (!prompt || !userId || !scenarioId) {
    console.warn('⚠️ Missing required fields:', { userId, scenarioId, prompt });
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const messages = Array.isArray(conversationHistory) && conversationHistory.length > 0
    ? conversationHistory
    : [{ role: 'user', content: prompt }];

  console.log('📩 Payload received:', { userId, scenarioId, prompt });

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const generatedText = response.data?.choices?.[0]?.message?.content?.trim();
    const fallbackUsed = !generatedText;
    const finalResponse = generatedText || await getFallback(scenarioId);

    console.log('🧠 AI response:', finalResponse);

    await Promise.all([
      db.collection('aiResponses').add({
        userId,
        scenarioId,
        prompt,
        response: finalResponse,
        fallbackUsed,
        model: 'gpt-3.5-turbo',
        source: fallbackUsed ? 'fallback' : 'openai',
        status: fallbackUsed ? 'error' : 'success',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }),
      db.collection('clarificationRequests').add({
        userId,
        scenarioId,
        prompt,
        response: finalResponse,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      }),
    ]);

    return res.json({ success: !fallbackUsed, response: finalResponse });
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message, error.response?.data);

    let fallback = 'Fallback guidance unavailable.';
    try {
      fallback = await getFallback(scenarioId);
    } catch (fallbackError) {
      console.error('❌ Fallback fetch failed:', fallbackError.message);
    }

    try {
      await Promise.all([
        db.collection('aiResponses').add({
          userId,
          scenarioId,
          prompt,
          response: fallback,
          fallbackUsed: true,
          model: 'gpt-3.5-turbo',
          source: 'fallback',
          status: 'error',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }),
        db.collection('aiErrors').add({
          userId,
          scenarioId,
          prompt,
          error: error.message,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        }),
      ]);
    } catch (dbError) {
      console.error('❌ Firestore write failed:', dbError.message);
    }

    return res.json({ success: false, response: fallback });
  }
});

async function getFallback(scenarioId) {
  try {
    const doc = await db.collection('staticGuidance').doc(scenarioId).get();
    return doc.exists ? doc.data().fallbackText : 'Fallback guidance unavailable.';
  } catch (err) {
    console.error('Fallback fetch error:', err.message);
    return 'Fallback guidance unavailable.';
  }
}
