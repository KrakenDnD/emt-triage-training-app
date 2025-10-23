import { initializeApp, getApps } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: 'AIzaSyD-qOkPxqCCAXOBq_nuB6rKGcSrOw6mDcI',
  authDomain: 'emt-triage-training-app.firebaseapp.com',
  projectId: 'emt-triage-training-app',
  storageBucket: 'emt-triage-training-app.appspot.com',
  messagingSenderId: '134317067216',
  appId: '1:134317067216:web:f58b830089b0bbd0b687d5',
  measurementId: 'G-GNQLE9KYQY'
};

// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// ✅ Add this log right here
console.log('🔍 Firebase Config:', firebaseConfig);
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

if (__DEV__) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export { app, auth, firestore, storage, functions };
