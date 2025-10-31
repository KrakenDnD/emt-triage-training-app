const fs = require('fs');
const https = require('https');

// ===== CHANGE THESE VALUES FOR EACH FILE =====
const FUNCTION_URL = 'https://api-huadzlolba-uc.a.run.app/seed-reference-library'; //this should be good after the first run
const JSON_FILE = './assets/medicalconditions.json';  
const CATEGORY = 'conditions';           
// =============================================

const data = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

const chunkSize = 500;
const chunks = [];

for (let i = 0; i < data.length; i += chunkSize) {
  chunks.push(data.slice(i, i + chunkSize));
}

console.log(`📁 File: ${JSON_FILE}`);
console.log(`📊 Total items: ${data.length}`);
console.log(`📦 Split into ${chunks.length} chunks`);
console.log(`🏷️  Category: ${CATEGORY}\n`);

async function sendChunk(chunk, index) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      data: chunk,
      category: CATEGORY
    });

    const url = new URL(FUNCTION_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`✅ Chunk ${index + 1}/${chunks.length} completed (${chunk.length} items)`);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Chunk ${index + 1} failed:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function seedAll() {
  console.log('🚀 Starting to seed data...\n');
  const startTime = Date.now();
  
  for (let i = 0; i < chunks.length; i++) {
    await sendChunk(chunks[i], i);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n🎉 All ${data.length} items seeded successfully in ${duration}s!`);
}

seedAll().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

/* Steps:

1. **Add the endpoint** to your `index.js` (done, don't worry about this)
2. **Deploy**: `firebase deploy --only functions`
3. **Put your JSON file** in the same folder as `seedData.js` (or update the file path, thats what I did)
4. **Update the script** with:
   - Your Firebase function URL
   - Your JSON filename
   - The category name (like 'medical-terms', 'procedures', etc.)
5. **Run**: `node seedData.js`*/

