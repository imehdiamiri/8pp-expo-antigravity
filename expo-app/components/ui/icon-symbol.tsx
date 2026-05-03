// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'gamecontroller.fill': 'sports-esports',
  'wrench.and.screwdriver.fill': 'build',
  'person.2.fill': 'people',
  'wand.and.stars': 'auto-fix-high',
  'person.crop.circle': 'person',
  'number.square.fill': 'pin',
  'backward.fill': 'fast-rewind',
  'stopwatch.fill': 'timer',
  'theatermasks.fill': 'theater-comedy',
  'eye.fill': 'visibility',
  'square.grid.3x3.fill': 'grid-view',
  'map.fill': 'map',
  '123': 'pin', // Closest match
  'paintpalette.fill': 'palette',
  'text.bubble.fill': 'chat-bubble',
  'arrow.triangle.2.circlepath': 'sync',
  'pencil.and.scribble': 'edit',
  'smartphone': 'smartphone',
  'apps': 'apps',
  'bookmark': 'bookmark-border',
  'bookmark.fill': 'bookmark',
  'bubble.left.and.bubble.right.fill': 'forum',
  'bolt.fill': 'flash-on',
  'exclamationmark.triangle.fill': 'warning',
  'heart.fill': 'favorite',
  'rectangle.on.rectangle.angled.fill': 'style',
  'bell.badge.fill': 'notifications-active',
  'person.crop.circle.badge.plus': 'person-add',
  'person.2.slash.fill': 'person-off',
  'person.3.sequence.fill': 'groups',
  'sparkles': 'auto-awesome',
  'face.smiling.fill': 'emoji-emotions',
  'brain.head.profile': 'psychology',
  'figure.run': 'directions-run',
  'suit.club.fill': 'eco',
  'questionmark.circle.fill': 'help',
  'flame.fill': 'local-fire-department',
  'text.alignleft': 'format-align-left',
  'sparkles.rectangle.stack.fill': 'auto-awesome-mosaic',
  'minus': 'remove',
  'plus': 'add',
  'sparkle': 'auto-awesome',
  'chevron.down': 'expand-more',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
