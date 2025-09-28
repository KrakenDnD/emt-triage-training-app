markdown
# 🛠 EMT Triage Training App – Dev Commands Reference

This document lists all the key `npm` and `npx` commands used to install dependencies, run the app, deploy functions, and manage the project.

---

## 📦 Dependency Installation

### 🔹 Install Firebase SDK (frontend)
```bash
npm install firebase
🔹 Install AsyncStorage for Auth Persistence
bash
npm install @react-native-async-storage/async-storage
🔹 Install Safe Area Context (replaces deprecated SafeAreaView)
bash
npm install react-native-safe-area-context
🔹 Install Cloud Functions Dependencies (backend)
bash
cd functions
npm install
🚀 Expo Commands
🔹 Start the Expo App (with cache clear)
bash
npx expo start --clear
Use this after editing .env or making major config changes.

🔥 Firebase CLI Commands
🔹 Login to Firebase
bash
firebase login
🔹 Initialize Firebase Functions (only needed once)
bash
firebase init functions
🔹 Deploy Cloud Functions
bash
firebase deploy --only functions
⚠️ Requires Blaze plan if using external APIs like Hugging Face or OpenAI.

🧪 Emulator (Optional for Local Dev)
🔹 Start Firebase Emulator Suite
bash
firebase emulators:start
Use this if you’re not deploying to the cloud and want to test locally.

🧼 General Project Setup
🔹 Install Expo CLI (global)
bash
npm install -g expo-cli
🔹 Install Firebase CLI (global)
bash
npm install -g firebase-tools
Code

Let me know if you want to add Git commands, `.env` setup instructions, or a checklist for onboarding new teammates. You’re organizing this like a pro.
