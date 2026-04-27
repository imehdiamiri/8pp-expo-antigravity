import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBackgroundView } from '@/src/components/AppBackgroundView';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { CardCategoryInfo } from '@/src/models/CardModels';
import { CardsDeckRenderer } from '@/src/components/tools/CardsDeckRenderer';

export default function CardsDeckScreen() {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const category = CardCategoryInfo[categoryId as keyof typeof CardCategoryInfo];

  if (!category) {
    return (
      <View style={styles.container}>
        <AppBackgroundView />
        <Text style={{ color: 'white', marginTop: 100, textAlign: 'center' }}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBackgroundView />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={16} color="white" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <View style={[styles.iconWrapper, { backgroundColor: category.accentColor + '20' }]}>
            <IconSymbol name={category.icon as any} size={14} color={category.accentColor} />
          </View>
          <Text style={styles.titleText}>{category.title}</Text>
        </View>
        
        <View style={{ width: 38 }} />
      </View>

      <CardsDeckRenderer categoryId={categoryId as any} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Viral-Black',
    fontSize: 22,
    color: 'white',
  },
});
