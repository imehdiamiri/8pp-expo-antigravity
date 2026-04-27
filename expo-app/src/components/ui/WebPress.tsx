import React, { useCallback, CSSProperties, ReactNode } from 'react';

/**
 * WebPress — A button component for .web.tsx files that uses native DOM
 * events instead of React Native's responder system.
 *
 * This exists because TouchableOpacity and Pressable from react-native
 * render as non-interactive divs in this project's RNW setup.
 */
interface WebPressProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: CSSProperties | CSSProperties[];
  children: ReactNode;
}

export function WebPress({ onPress, disabled, style, children }: WebPressProps) {
  const merged: CSSProperties = Array.isArray(style)
    ? Object.assign({}, ...style.filter(Boolean))
    : style || {};

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && onPress) onPress();
    },
    [onPress, disabled],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!disabled && onPress && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onPress();
      }
    },
    [onPress, disabled],
  );

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      style={{
        ...merged,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : merged.opacity ?? 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        outline: 'none',
      }}
    >
      {children}
    </div>
  );
}
