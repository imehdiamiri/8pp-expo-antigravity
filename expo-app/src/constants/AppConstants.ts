export const AppConstants = {
  Firebase: {
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'partyplay-app-8pp',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:994785726311:web:68ba8fa8b4cd85eea5a9c2',
    databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://partyplay-app-8pp-default-rtdb.firebaseio.com',
  },
  URLs: {
    privacyPolicy: 'https://www.8partyplay.com/privacy.html',
    termsOfService: 'https://www.8partyplay.com/terms.html',
    marketingSite: 'https://www.8partyplay.com',
  },
  Invite: {
    allowedHosts: ['8partyplay.com', 'www.8partyplay.com', 'app.8partyplay.com'],
    inviteScheme: 'invite',
  },
  RevenueCat: {
    apiKeyIOS: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS || '',
    apiKeyAndroid: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID || '',
  },
  OpenAI: {
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  },
  Economy: {
    dailyReward: 5,
    inviteReward: 10,
    aiCardCostFree: 5,
    aiCardCostPremium: 1,
    freeAIGenerationsPerDay: 5,
  },
  Game: {
    minPlayersForMultiplayer: 2,
    maxPlayersPerRoom: 12,
    roomCodeLength: 6,
    sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
  },
};
