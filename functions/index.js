require('dotenv').config();
const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
const admin = require('firebase-admin');
const { aiRespond } = require('./aiRespond');
exports.aiRespond = aiRespond;

if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(cors());
app.use(express.json());

// 🔍 Scenario detection
const MEDICAL_SCENARIOS = {
  emergency: {
    triggers: ['chest pain', 'difficulty breathing', 'severe', 'emergency', 'unconscious'],
    systemPrompt: 'You are an emergency medical assistant.',
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
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      messages,
      parameters: { max_new_tokens: 80, temperature: 0.7 }
    });

    const content = response?.choices?.[0]?.message?.content?.trim() || '';
    return { success: true, response: content, confidence: Math.min(0.9, content.length / 50) };
  } catch (error) {
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
    return {
      success: false,
      error: error.message,
      response: '⚠️ An error occurred. Please try again or consult a healthcare professional.'
    };
  }
}

// 📣 Express endpoints
app.post('/process-ai-chat', async (req, res) => {
  const { message, conversationHistory = [] } = req.body;
  console.log('📩 Incoming message:', message);
  console.log('📜 History:', conversationHistory);

  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const result = await processAIMessage(message, conversationHistory);
    console.log('🧠 AI Result:', result);
    res.json(result);
  } catch (error) {
    console.error('🔥 AI Processing Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/test-ai-services', async (req, res) => {
  const results = {};
  try {
    await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
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

  res.json({
    timestamp: new Date().toISOString(),
    services: results
  });
});

app.get('/debug-env', (req, res) => {
  res.json({
    huggingfaceTokenPresent: !!process.env.HUGGINGFACE_TOKEN,
    tokenPreview: process.env.HUGGINGFACE_TOKEN?.slice(0, 6) || 'missing'
  });
});

// 🆕 Seeding endpoint for scenarioReviews
app.post('/seed-scenario-review', async (req, res) => {
  const userId = "abc123";
  const scenarioId = "burnVictim01";
  const docId = `${userId}_${scenarioId}`;

  try {
    await admin.firestore().collection("scenarioReviews").doc(docId).set({
      userId,
      scenarioId,
      score: "90",
      strengths: ["Vitals", "Bleeding Procedure", "Patient Tagging"],
      weaknesses: ["Patient Tagging", "Taking Pulse", "Bedside Manner"],
      review: "You did a really solid job on this scenario. Your vitals were accurate and consistent, and your bleeding control was handled exactly the way it should be—quick, calm, and effective. You clearly know your procedures and how to apply them under pressure. That said, I'd like to see you focus a bit more on your patient interaction next time. Take a little extra time with your patient questioning and pulse taking, and work on keeping your tone and presence reassuring throughout. You've got the technical side down—now it's about bringing that human touch to match it. Great work—keep tightening up your communication, and you'll be operating at a professional level in no time.",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("✅ scenarioReviews seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding review:", error);
    res.status(500).send("Failed to seed scenarioReviews.");
  }
});

app.get('/seed-scenario-review', async (req, res) => {
  const userId = "abc123";
  const scenarioId = "burnVictim01";
  const docId = `${userId}_${scenarioId}`;

  try {
    await admin.firestore().collection("scenarioReviews").doc(docId).set({
      userId,
      scenarioId,
      score: "90",
      strengths: ["Vitals", "Bleeding Procedure", "Patient Tagging"],
      weaknesses: ["Patient Tagging", "Taking Pulse", "Bedside Manner"],
      review: "You did a really solid job on this scenario. Your vitals were accurate and consistent, and your bleeding control was handled exactly the way it should be—quick, calm, and effective. You clearly know your procedures and how to apply them under pressure. That said, I'd like to see you focus a bit more on your patient interaction next time. Take a little extra time with your patient questioning and pulse taking, and work on keeping your tone and presence reassuring throughout. You've got the technical side down—now it's about bringing that human touch to match it. Great work—keep tightening up your communication, and you'll be operating at a professional level in no time.",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("✅ scenarioReviews seeded successfully via GET.");
  } catch (error) {
    console.error("❌ Error seeding review:", error);
    res.status(500).send("Failed to seed scenarioReviews.");
  }
});

app.get('/seed-demo-reviews', async (req, res) => {
  const demoReviews = [
  {
    id: 'demo_1',
    userId: 'abc123',
    scenarioId: 'demo_1',
    score: '85',
    strengths: ['Scene Safety', 'Patient Tagging', 'Vitals'],
    weaknesses: ['Pulse Check', 'Reassurance', 'Bleeding Control'],
    actionsTaken: [
      'called for backup',
      'assessed scene safety',
      'tagged patient',
      'checked vitals',
      'applied pressure to wound'
    ],
    review: "Gladys's beach incident was handled with solid scene awareness and tagging. Improve pulse check and tone.",
  },
  {
    id: 'demo_2',
    userId: 'abc123',
    scenarioId: 'demo_2',
    score: '78',
    strengths: ['Empathy', 'Scene Control', 'Vitals'],
    weaknesses: ['Reassurance', 'Pulse Check', 'Bedside Manner'],
    actionsTaken: [
      'calmed bystanders',
      'secured the scene',
      'checked vitals',
      'spoke calmly to patient'
    ],
    review: "Chris's episode required calm and control. You did well, but bedside tone and pulse check need work.",
  },
  {
    id: 'demo_3',
    userId: 'abc123',
    scenarioId: 'demo_3',
    score: '90',
    strengths: ['Bleeding Control', 'Vitals', 'Patient Tagging'],
    weaknesses: ['Scene Safety', 'Pulse Check', 'Reassurance'],
    actionsTaken: [
      'applied tourniquet',
      'checked vitals',
      'tagged patient',
      'moved patient to safe zone'
    ],
    review: "Waterpark chaos was managed well. Tagging and bleeding control were excellent. Improve scene safety and tone.",
  },
  {
    id: 'demo_4',
    userId: 'abc123',
    scenarioId: 'demo_4',
    score: '92',
    strengths: ['Mass Casualty Triage', 'Scene Safety', 'Vitals'],
    weaknesses: ['Reassurance', 'Pulse Check', 'Bedside Manner'],
    actionsTaken: [
      'triaged multiple patients',
      'secured unstable structure',
      'checked vitals',
      'coordinated with team'
    ],
    review: "Earthquake triage was strong. You showed leadership and control. Focus on patient tone and pulse accuracy.",
  },
  {
    id: 'demo_5',
    userId: 'abc123',
    scenarioId: 'demo_5',
    score: '88',
    strengths: ['Scene Safety', 'Bleeding Control', 'Vitals'],
    weaknesses: ['Patient Tagging', 'Pulse Check', 'Reassurance'],
    actionsTaken: [
      'secured scene',
      'applied pressure to bleeding wound',
      'checked vitals',
      'comforted patient briefly'
    ],
    review: "Mark’s accident was handled well. Scene safety and bleeding control were solid. Improve tagging and tone.",
  },
];

app.get('/seed-scenario-metadata', async (req, res) => {
  const scenarios = [
    {
      id: 'demo_1',
      title: 'Gladys – Beach Incident',
      description: '72-year-old woman collapsed on a crowded beach. She has a bleeding leg wound, shallow breathing, and a diabetic bracelet. Her daughter is present and panicked. Bystanders are crowding the scene.',
      keyQuestions: [
        'Did you call for backup before engaging?',
        'Did you check for medical ID or history?',
        'Did you reassure the patient and family?',
        'Did you control bleeding before checking vitals?',
        'Did you tag the patient appropriately?'
      ]
    },
    {
      id: 'demo_2',
      title: 'Chris – Panic in the Park',
      description: 'Middle-aged man hyperventilating and disoriented in a public park. No ID, aggressive crowd nearby. He’s pacing and unresponsive to verbal cues.',
      keyQuestions: [
        'Did you secure the scene?',
        'Did you calm bystanders?',
        'Did you assess mental status?',
        'Did you check vitals?',
        'Did you communicate clearly with the patient?'
      ]
    },
    {
      id: 'demo_3',
      title: 'Waterpark Chaos',
      description: 'Multiple injuries after a waterpark accident. One patient has a deep leg wound and is losing blood rapidly. The area is slippery and chaotic.',
      keyQuestions: [
        'Did you apply bleeding control immediately?',
        'Did you check vitals?',
        'Did you tag the patient?',
        'Did you move the patient to a safe zone?',
        'Did you maintain scene safety?'
      ]
    },
    {
      id: 'demo_4',
      title: 'Earthquake Triage',
      description: 'Following a 6.2 magnitude earthquake, multiple patients are scattered across a collapsed building site. One patient is trapped but conscious.',
      keyQuestions: [
        'Did you triage multiple patients?',
        'Did you secure unstable structures?',
        'Did you check vitals?',
        'Did you coordinate with your team?',
        'Did you maintain calm and control?'
      ]
    },
    {
      id: 'demo_5',
      title: 'Mark – Construction Accident',
      description: 'A construction worker fell from scaffolding. He has a bleeding head wound and is semi-conscious. Tools and debris are scattered around.',
      keyQuestions: [
        'Did you secure the scene?',
        'Did you apply pressure to the wound?',
        'Did you check vitals?',
        'Did you comfort the patient?',
        'Did you tag the patient correctly?'
      ]
    }
  ];

  try {
    const batch = admin.firestore().batch();
    scenarios.forEach((scenario) => {
      const docRef = admin.firestore().collection('scenarios').doc(scenario.id);
      batch.set(docRef, scenario);
    });

    await batch.commit();
    res.status(200).send('✅ Scenario metadata seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding scenario metadata:', error);
    res.status(500).send('Failed to seed scenario metadata.');
  }
});



  try {
    const batch = admin.firestore().batch();
    demoReviews.forEach((review) => {
      const docRef = admin.firestore().collection('scenarioReviews').doc(`${review.userId}_${review.scenarioId}`);

      batch.set(docRef, {
        userId: review.userId,
        scenarioId: review.scenarioId,
        score: review.score,
        strengths: review.strengths,
        weaknesses: review.weaknesses,
        actionsTaken: review.actionsTaken,
        review: review.review,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    res.status(200).send('✅ Demo reviews seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding demo reviews:', error);
    res.status(500).send('Failed to seed demo reviews.');
  }
});
app.post('/generate-scenario-review', async (req, res) => {
  const { userId, scenarioId, selectedOption, notes } = req.body;

  if (!userId || !scenarioId || !selectedOption) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Fetch scenario metadata from Firestore
const scenarioDoc = await admin.firestore().collection('scenarios').doc(scenarioId).get();
const scenarioData = scenarioDoc.exists ? scenarioDoc.data() : {};
const scenarioDescription = scenarioData.description || 'No description available';
const actionsTaken = notes?.length ? notes : ['No actions provided'];

// Build the prompt
const prompt = `
You are an emergency response evaluator. A trainee responded to scenario "${scenarioId}" with the following actions: "${actionsTaken.join(', ')}".
Here are the scenario details: "${scenarioDescription}".
Please evaluate their performance by answering:
- Did they escalate appropriately?
- Did they prioritize the correct medical steps?
- Did they communicate effectively?
- Did they miss any critical steps?

Return a score (0–100), 2 strengths, 2 weaknesses, and a short review paragraph.
`;


  try {
    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      messages: [
        { role: 'system', content: 'You are a professional scenario evaluator.' },
        { role: 'user', content: prompt }
      ],
      parameters: { max_new_tokens: 150, temperature: 0.7 }
    });

    const content = response?.choices?.[0]?.message?.content?.trim() || '';
    const parsed = parseReview(content); // helper below

    await admin.firestore()
      .collection('scenarioReviews')
      .doc(`${userId}_${scenarioId}`)
      .set({
        userId,
        scenarioId,
        ...parsed,
        actionsTaken: ['called for backup', 'assessed sceen'],
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ success: true, review: parsed });
  } catch (error) {
    console.error('❌ Error generating review:', error);
    res.status(500).json({ error: 'Review generation failed' });
  }
});

function parseReview(content) {
  try {
    const scoreMatch = content.match(/score\s*[:\-]?\s*(\d{1,3})/i);
    const strengthsMatch = content.match(/strengths\s*[:\-]?\s*(?:\[)?(.*?)(?:\]|\n|$)/i);
    const weaknessesMatch = content.match(/weaknesses\s*[:\-]?\s*(?:\[)?(.*?)(?:\]|\n|$)/i);
    const reviewMatch = content.match(/review\s*[:\-]?\s*(.*)/i);

    const score = scoreMatch?.[1]?.trim() || '80';

    const strengthsRaw = strengthsMatch?.[1] || '';
    const strengths = strengthsRaw
      .split(/[,;\n]/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 2);

    const weaknessesRaw = weaknessesMatch?.[1] || '';
    const weaknesses = weaknessesRaw
      .split(/[,;\n]/)
      .map(s => s.trim())
      .filter(Boolean)
      .slice(0, 2);

    const review = reviewMatch?.[1]?.trim() || content;

    return { score, strengths, weaknesses, review };
  } catch (error) {
    console.error('❌ Error parsing review:', error);
    return {
      score: '80',
      strengths: ['Calm demeanor'],
      weaknesses: ['Missed escalation'],
      review: content,
    };
  }
}

app.get('/seed-user-profiles', async (req, res) => {
  try {
    const usersSnapshot = await admin.firestore().collection('users').get();
    const batch = admin.firestore().batch();

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const userRef = admin.firestore().collection('users').doc(doc.id);
      
      if (userData.role === 'student') {
        batch.update(userRef, {
          firstName: '',
          lastName: '',
          displayId: '0000001',
          completedScenarios: [],
          avgScore: 0,
          allergies: '',
          avatar: '',
          phoneNum: '',
          dateOfBirth: '',
          emergencyContact: '',
          certifications: [],
          instructorId: '',
          instructorName: '',
          classNum: '',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        studentCounter++;
      } else if (userData.role === 'instructor') {
        batch.update(userRef, {
          assignedStudents: [],
          avatar: '',
          phoneNum: '',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    await batch.commit();
    res.status(200).send('User profiles seeded successfully.');
  } catch (error) {
    console.error('Error seeding profiles:', error);
    res.status(500).send('Failed to seed user profiles.');
  }
});




// Export the Express app as a Cloud Function
exports.api = onRequest({ region: 'us-central1', allowUnauthenticated: true }, app);