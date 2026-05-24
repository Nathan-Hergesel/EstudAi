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
  const baseStyles = [
    styles.base,
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.textOnly,
    style,
    disabled && styles.disabled
  ];

  const labelStyles = [
    styles.label,
    variant === 'primary' ? styles.primaryText : variant === 'secondary' ? styles.secondaryText : styles.textText
  ];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [...baseStyles, pressed && !disabled && styles.pressed]}
    >
      <Text style={labelStyles}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  primary: {
    backgroundColor: '#0A3D9F'
  },
  secondary: {
    backgroundColor: '#F3F7FC',
    borderWidth: 1,
    borderColor: '#D2DCE8'
  },
  textOnly: {
    minHeight: 40,
    backgroundColor: 'transparent'
  },
  label: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    letterSpacing: 0.2
  },
  primaryText: {
    color: colors.onPrimary
  },
  secondaryText: {
    color: '#1B335A'
  },
  textText: {
    color: '#0A3D9F'
  },
  pressed: {
    opacity: 0.85
  },
  disabled: {
    opacity: 0.45
  }
});
