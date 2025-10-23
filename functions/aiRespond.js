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

    if (!generatedText) throw new Error('Empty response from OpenAI');

    await db.collection('aiResponses').add({
      userId,
      scenarioId,
      prompt,
      response: generatedText,
      timestamp: new Date().toISOString(),
      source: 'openai',
      status: 'success',
    });

    return res.json({ success: true, response: generatedText });
  } catch (error) {
    console.error('❌ OpenAI Error:', error.message);

    const fallback = 'AI is temporarily unavailable. Please refer to protocol guidance.';

    await db.collection('aiResponses').add({
      userId,
      scenarioId,
      prompt,
      response: fallback,
      timestamp: new Date().toISOString(),
      source: 'fallback',
      status: 'error',
    });

    return res.json({ success: false, response: fallback });
  }
});
