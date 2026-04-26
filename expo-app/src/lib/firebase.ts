import { initializeApp, getApps } from 'firebase/app';
// @ts-ignore – getReactNativePersistence is exported from the /react-native sub-path
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBbV12f3iA95YKGC28lInL7ufXfEA6Pa-s',
  authDomain: 'partyplay-app-8pp.firebaseapp.com',
  projectId: 'partyplay-app-8pp',
  storageBucket: 'partyplay-app-8pp.firebasestorage.app',
  messagingSenderId: '994785726311',
  appId: '1:994785726311:web:68ba8fa8b4cd85eea5a9c2',
  databaseURL: 'https://partyplay-app-8pp-default-rtdb.firebaseio.com',
};

// Initialize Firebase (avoid re-initializing if already done)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore (for user profiles, game history, ideas, etc.)
const db = getFirestore(app);

// Initialize Realtime Database (for live game sessions / lobbies)
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };
