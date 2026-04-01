import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const Button = ({ title, onPress, variant = 'primary', style, disabled }: ButtonProps) => {
  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.base, styles.primary, style, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
      >
        <Text style={[styles.label, styles.primaryText]}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.textOnly,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      <Text style={[styles.label, variant === 'secondary' ? styles.secondaryText : styles.textText]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md
  },
  primary: {
    backgroundColor: '#0A3D9F'
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: 0.2
  },
  primaryText: {
    color: colors.onPrimary
  },
  secondary: {
    backgroundColor: '#F3F7FC',
    borderWidth: 1,
    borderColor: '#D2DCE8'
  },
  secondaryText: {
    color: '#1B335A'
  },
  textOnly: {
    backgroundColor: 'transparent',
    minHeight: 40
  },
  textText: {
    color: '#0A3D9F'
  },
  pressed: {
    opacity: 0.9
  },
  disabled: {
    opacity: 0.5
  }
});
