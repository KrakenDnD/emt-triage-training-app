const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
require('dotenv').config();

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const OPENAI_KEY = process.env.OPENAI_API_KEY;

exports.aiRespond = functions.https.onRequest(async (req, res) => {
  const { userId, scenarioId, prompt } = req.body;

  if (!prompt || !userId || !scenarioId) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
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

    await db.collection('aiResponses').add({
      userId,
      scenarioId,
      prompt,
      response: finalResponse,
      fallbackUsed,
      model: 'gpt-3.5-turbo',
      source: fallbackUsed ? 'fallback' : 'openai',
      status: fallbackUsed ? 'error' : 'success',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({ success: !fallbackUsed, response: finalResponse });
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);

    const fallback = await getFallback(scenarioId);

    await db.collection('aiResponses').add({
      userId,
      scenarioId,
      prompt,
      response: fallback,
      fallbackUsed: true,
      model: 'gpt-3.5-turbo',
      source: 'fallback',
      status: 'error',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    await db.collection('aiErrors').add({
      userId,
      scenarioId,
      prompt,
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

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
