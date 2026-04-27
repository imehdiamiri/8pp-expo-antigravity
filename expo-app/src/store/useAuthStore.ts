import { create } from 'zustand';
import {
  User,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { auth, syncUserProfile, setUserOnline } from '../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

export type AuthProvider = 'username' | 'google' | 'apple' | 'guest';

export interface AuthAccount {
  id: string;
  username: string;
  email?: string;
  provider: AuthProvider;
}

interface AuthState {
  currentUser: User | null;
  authAccount: AuthAccount | null;
  isBusy: boolean;
  isInitialized: boolean;
  errorMessage: string | null;

  initialize: () => void;
  signUp: (username: string, password: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const normalizeUsername = (username: string) => {
  const trimmed = username.trim().toLowerCase();
  if (!trimmed) throw new Error('Invalid Username');
  return trimmed;
};

const getEmailForUsername = (username: string) => {
  return `${username}@partygames.app`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  authAccount: null,
  isBusy: false,
  isInitialized: false,
  errorMessage: null,

  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'Player';
        const provider: AuthProvider = user.isAnonymous
          ? 'guest'
          : user.providerData[0]?.providerId === 'google.com'
            ? 'google'
            : user.providerData[0]?.providerId === 'apple.com'
              ? 'apple'
              : 'username';

        set({
          currentUser: user,
          authAccount: {
            id: user.uid,
            username: displayName,
            email: user.email ?? undefined,
            provider,
          },
          isInitialized: true,
        });

        // Sync profile to Firebase RTDB + Firestore & set online
        syncUserProfile({
          uid: user.uid,
          username: displayName,
          email: user.email ?? undefined,
          provider,
        });
        setUserOnline(user.uid);
      } else {
        set({
          currentUser: null,
          authAccount: null,
          isInitialized: true,
        });
      }
    });

    // Return unsubscribe for cleanup if needed
    return unsubscribe;
  },

  signUp: async (username: string, password: string) => {
    set({ isBusy: true, errorMessage: null });
    try {
      const normalized = normalizeUsername(username);
      const email = getEmailForUsername(normalized);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      set({
        currentUser: user,
        authAccount: {
          id: user.uid,
          username: normalized,
          email: user.email ?? undefined,
          provider: 'username',
        },
        isBusy: false,
      });
    } catch (err: any) {
      const message = err.code === 'auth/email-already-in-use'
        ? 'This username is already taken.'
        : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters.'
          : err.message;
      set({ errorMessage: message, isBusy: false });
    }
  },

  signIn: async (username: string, password: string) => {
    set({ isBusy: true, errorMessage: null });
    try {
      const normalized = normalizeUsername(username);
      const email = getEmailForUsername(normalized);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      set({
        currentUser: user,
        authAccount: {
          id: user.uid,
          username: normalized,
          email: user.email ?? undefined,
          provider: 'username',
        },
        isBusy: false,
      });
    } catch (err: any) {
      const message = err.code === 'auth/invalid-credential'
        ? 'Wrong username or password.'
        : err.code === 'auth/user-not-found'
          ? 'No account found with this username.'
          : err.message;
      set({ errorMessage: message, isBusy: false });
    }
  },

  signInAnonymously: async () => {
    set({ isBusy: true, errorMessage: null });
    try {
      const userCredential = await firebaseSignInAnonymously(auth);
      const user = userCredential.user;

      set({
        currentUser: user,
        authAccount: {
          id: user.uid,
          username: 'Guest',
          provider: 'guest',
        },
        isBusy: false,
      });
    } catch (err: any) {
      set({ errorMessage: err.message, isBusy: false });
    }
  },

  signInWithGoogle: async () => {
    set({ isBusy: true, errorMessage: null });
    try {
      // For Expo Go / development, use a simplified mock approach
      // In production with EAS builds, you would use @react-native-google-signin/google-signin
      // or expo-auth-session with Google provider
      
      // TODO: Replace with real Google Sign-In when building with EAS
      // For now, use anonymous auth as a placeholder
      console.warn('Google Sign-In requires EAS build. Using anonymous auth for development.');
      const userCredential = await firebaseSignInAnonymously(auth);
      const user = userCredential.user;
      
      set({
        currentUser: user,
        authAccount: {
          id: user.uid,
          username: 'GoogleUser',
          provider: 'google',
        },
        isBusy: false,
      });
    } catch (err: any) {
      set({ errorMessage: err.message, isBusy: false });
      throw err;
    }
  },

  signInWithApple: async () => {
    set({ isBusy: true, errorMessage: null });
    try {
      const nonce = Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (credential.identityToken) {
        const oAuthProvider = new OAuthProvider('apple.com');
        const oAuthCredential = oAuthProvider.credential({
          idToken: credential.identityToken,
          rawNonce: nonce,
        });

        const userCredential = await signInWithCredential(auth, oAuthCredential);
        const user = userCredential.user;
        const fallbackUsername =
          credential.fullName?.givenName ??
          user.email?.split('@')[0] ??
          'ApplePlayer';

        set({
          currentUser: user,
          authAccount: {
            id: user.uid,
            username: fallbackUsername,
            email: user.email ?? undefined,
            provider: 'apple',
          },
          isBusy: false,
        });
      } else {
        throw new Error('No identityToken returned from Apple.');
      }
    } catch (err: any) {
      if (err.code !== 'ERR_REQUEST_CANCELED') {
        set({ errorMessage: err.message, isBusy: false });
        throw err;
      }
      set({ isBusy: false });
    }
  },

  signOut: async () => {
    set({ isBusy: true });
    try {
      await firebaseSignOut(auth);
      set({ authAccount: null, currentUser: null });
    } catch (err: any) {
      set({ errorMessage: err.message });
    } finally {
      set({ isBusy: false });
    }
  },
}));
