🚑 EMT Triage Training App – Team Setup Guide
Welcome to the dev team! Follow these steps to get the app running locally using M’s codebase.

🧰 Prerequisites
Make sure these are installed:

Node.js (v18 or higher) → Download

npm (comes with Node)

Expo CLI → npm install -g expo-cli

Firebase CLI → npm install -g firebase-tools

Git → Download

VS Code or your preferred editor

📦 Project Structure
Code
EMT-TRIAGE-TRAINING/
├── frontend/       ← Expo app (React Native)
├── functions/      ← Firebase Cloud Functions (AI endpoints)
🚀 Setup Steps
1. Clone the Repo
bash
git clone https://github.com/your-org/emt-triage-training.git
cd emt-triage-training
2. Install Dependencies
Frontend
bash
cd frontend
npm install
Backend (Cloud Functions)
bash
cd ../functions
npm install
3. Environment Files
You’ll receive two .env files from M:

frontend/.env → contains Firebase config

functions/.env → contains Hugging Face + OpenAI keys

✅ Place them in the correct folders before running anything.

4. Run the App
Frontend (Expo)
bash
cd frontend
npx expo start
Use Expo Go or a simulator to preview the app.

Backend (Firebase Functions)
bash
cd ../functions
firebase login
firebase deploy --only functions
5. Optional: Enable Auth Persistence
If you see a warning about Firebase Auth persistence, run:

bash
npm install @react-native-async-storage/async-storage
No code changes needed — M already wired it up.