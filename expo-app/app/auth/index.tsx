import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Colors, Typography } from '../../src/theme/Colors';
import { AppBackgroundView } from '../../src/components/AppBackgroundView';
import { useAuthStore } from '../../src/store/useAuthStore';
import { AppConstants } from '../../src/constants/AppConstants';

export default function AuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const {
    isBusy,
    errorMessage,
    signIn,
    signUp,
    signInWithApple,
    signInWithGoogle,
    signInAnonymously
  } = useAuthStore();

  const showCloseButton = true; // can be passed as param if needed

  const handleSubmit = () => {
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();
    if (!trimmedUser || !trimmedPass || isBusy) return;

    Keyboard.dismiss();
    if (isLogin) {
      signIn(trimmedUser, trimmedPass).catch(() => {});
    } else {
      signUp(trimmedUser, trimmedPass).catch(() => {});
    }
  };

  const handleGuest = () => {
    signInAnonymously()
      .then(() => {
        router.replace('/');
      })
      .catch(() => {});
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <AppBackgroundView />

          {showCloseButton && (
            <View style={[styles.closeRow, { marginTop: insets.top + 12 }]}>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                }}
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.replace('/');
                }}
              >
                <Ionicons name="close" size={16} color="white" />
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '500', marginLeft: 4 }}>Close</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>
            {/* Header */}
            <View style={styles.headerBlock}>
              <View style={styles.iconContainer}>
                <Ionicons name="game-controller" size={38} color={Colors.blue} />
              </View>
              <Text style={styles.viralTitle}>8PartyPlay</Text>
              <Text style={styles.subtitle}>
                Sign in to claim 100 ★,{'\n'}friends, and AI cards.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formBlock}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={Colors.tertiary}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                value={username}
                onChangeText={setUsername}
                returnKeyType="next"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.tertiary}
                secureTextEntry
                textContentType={isLogin ? 'password' : 'newPassword'}
                value={password}
                onChangeText={setPassword}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
            </View>

            {/* Actions */}
            <View style={styles.actionsBlock}>
              <TouchableOpacity
                style={[styles.primaryBtn, (!username || !password || isBusy) && styles.primaryBtnDisabled]}
                disabled={!username || !password || isBusy}
                onPress={handleSubmit}
              >
                <Text style={styles.primaryBtnText}>{isLogin ? 'Login' : 'Create Account'}</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.appleBtn}
                  disabled={isBusy}
                  onPress={() => signInWithApple().catch(() => {})}
                >
                  <Ionicons name="logo-apple" size={18} color={Colors.white} />
                  <Text style={styles.socialBtnText}>Continue with Apple</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.googleBtn}
                disabled={isBusy}
                onPress={() => signInWithGoogle().catch(() => {})}
              >
                <Ionicons name="globe-outline" size={18} color={Colors.white} />
                <Text style={styles.socialBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              {errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
              )}
            </View>

            {/* Toggle */}
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleRow}>
              <Text style={styles.toggleTextLeft}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <Text style={styles.toggleTextRight}>
                {isLogin ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
            <TouchableOpacity onPress={handleGuest}>
              <Text style={styles.guestText}>Continue as Guest</Text>
            </TouchableOpacity>
            <Text style={styles.hintText}>You can log in anytime later from your profile.</Text>
            
            <View style={styles.legalRow}>
              <TouchableOpacity onPress={() => Linking.openURL(AppConstants.URLs.privacyPolicy)}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.legalDot}>•</Text>
              <TouchableOpacity onPress={() => Linking.openURL(AppConstants.URLs.termsOfService)}>
                <Text style={styles.legalLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Busy Overlay */}
          {isBusy && (
            <View style={styles.busyOverlay}>
              <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  closeRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.whiteOverlay8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    zIndex: 1,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.blueOverlay14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  viralTitle: {
    fontFamily: Typography.viralTitle.fontFamily,
    fontWeight: Typography.viralTitle.fontWeight,
    fontSize: 32,
    color: Colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  formBlock: {
    gap: 12,
    marginBottom: 28,
  },
  input: {
    backgroundColor: Colors.whiteOverlay6,
    borderColor: Colors.whiteOverlay8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.white,
    fontSize: 16,
  },
  actionsBlock: {
    gap: 10,
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: Colors.primaryAction,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  appleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.whiteOverlay9,
    borderColor: Colors.whiteOverlay6,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.065)',
    borderColor: Colors.whiteOverlay5,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  socialBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.red,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  toggleTextLeft: {
    color: Colors.secondary,
    fontSize: 15,
  },
  toggleTextRight: {
    color: Colors.blue,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  guestText: {
    color: Colors.secondary,
    fontSize: 15,
    fontWeight: '500',
  },
  hintText: {
    color: Colors.tertiary,
    fontSize: 11,
  },
  legalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legalLink: {
    color: Colors.secondary,
    fontSize: 11,
    fontWeight: '500',
  },
  legalDot: {
    color: Colors.tertiary,
    fontSize: 11,
  },
  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  progressContainer: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
