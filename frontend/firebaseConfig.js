import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-qOkPxqCCAXOBq_nuB6rKGcSrOw6mDcI",
    authDomain: "emt-triage-training-app.firebaseapp.com",
    projectId: "emt-triage-training-app",
    storageBucket: "emt-triage-training-app.firebasestorage.app",
    messagingSenderId: "134317067216",
    appId: "1:134317067216:web:f58b830089b0bbd0b687d5",
    measurementId: "G-GNQLE9KYQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;