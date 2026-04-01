import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InputAccessoryView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/tokens';
import { useKeyboardPreview } from '@/contexts/KeyboardPreviewContext';

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  multiline?: boolean;
  showKeyboardPreview?: boolean;
  secureRevealDurationMs?: number;
};

export const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  showKeyboardPreview = false,
  secureRevealDurationMs = 0
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const { showPreview, updatePreview, hidePreview } = useKeyboardPreview();
  const accessoryId = useRef(`input-preview-${Math.random().toString(36).slice(2, 10)}`).current;
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const useDelayedSecureMask = !!secureTextEntry && secureRevealDurationMs > 0 && !multiline;

  const clearRevealTimer = () => {
    if (!revealTimeoutRef.current) return;
    clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = null;
  };

  const previewValue = useMemo(() => {
    if (!value) return 'Digite para visualizar aqui';
    if (secureTextEntry) return '•'.repeat(Math.min(value.length, 28));
    return value;
  }, [value, secureTextEntry]);

  const maskedDisplayValue = useMemo(() => {
    if (!useDelayedSecureMask || !value) return '';

    return value
      .split('')
      .map((char, index) => (index === revealedIndex ? char : '•'))
      .join('');
  }, [useDelayedSecureMask, value, revealedIndex]);

  const showIosPreview = showKeyboardPreview && Platform.OS === 'ios';

  useEffect(() => {
    if (!showKeyboardPreview || Platform.OS !== 'android' || !isFocused) return;
    updatePreview(value);
  }, [isFocused, value, showKeyboardPreview, updatePreview]);

  useEffect(() => {
    if (!useDelayedSecureMask) {
      setRevealedIndex(null);
      clearRevealTimer();
    }
  }, [useDelayedSecureMask]);

  useEffect(
    () => () => {
      clearRevealTimer();
    },
    []
  );

  const handleChangeText = (text: string) => {
    const previousValue = value || '';
    onChangeText(text);

    if (!useDelayedSecureMask) return;

    clearRevealTimer();

    if (text.length > previousValue.length) {
      setRevealedIndex(text.length - 1);
      revealTimeoutRef.current = setTimeout(() => {
        setRevealedIndex(null);
      }, secureRevealDurationMs);
      return;
    }

    setRevealedIndex(null);
  };

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputFrame}>
          <TextInput
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            secureTextEntry={useDelayedSecureMask ? false : secureTextEntry}
            keyboardType={keyboardType}
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              multiline ? styles.multiline : null,
              useDelayedSecureMask ? styles.hiddenSecureText : null
            ]}
            multiline={multiline}
            onFocus={() => {
              setIsFocused(true);
              if (showKeyboardPreview && Platform.OS === 'android') {
                showPreview({
                  value,
                  secure: !!secureTextEntry,
                  multiline: !!multiline
                });
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              setRevealedIndex(null);
              clearRevealTimer();
              if (showKeyboardPreview && Platform.OS === 'android') {
                hidePreview();
              }
            }}
            inputAccessoryViewID={showIosPreview ? accessoryId : undefined}
          />

          {useDelayedSecureMask && value.length > 0 ? (
            <View pointerEvents="none" style={styles.maskOverlay}>
              <Text style={styles.maskOverlayText}>{maskedDisplayValue}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {showIosPreview ? (
        <InputAccessoryView nativeID={accessoryId}>
          <View style={styles.iosAccessoryCard}>
            <Text style={styles.previewTitle}>Você está digitando</Text>
            <Text style={styles.previewValue} numberOfLines={multiline ? 2 : 1}>
              {previewValue}
            </Text>
          </View>
        </InputAccessoryView>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    color: '#4E5F77',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DDE5EF',
    paddingHorizontal: spacing.md,
    minHeight: 44,
    fontFamily: 'Inter_400Regular',
    color: colors.onSurface,
    fontSize: 14
  },
  inputFrame: {
    position: 'relative'
  },
  hiddenSecureText: {
    color: 'transparent'
  },
  maskOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: spacing.md
  },
  maskOverlayText: {
    fontFamily: 'Inter_400Regular',
    color: colors.onSurface,
    fontSize: 14
  },
  multiline: {
    minHeight: 96,
    paddingTop: spacing.sm,
    textAlignVertical: 'top'
  },
  iosAccessoryCard: {
    borderTopWidth: 1,
    borderTopColor: '#D9E3EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm
  },
  previewTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#6F7A89'
  },
  previewValue: {
    marginTop: 2,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#10243E'
  }
});
