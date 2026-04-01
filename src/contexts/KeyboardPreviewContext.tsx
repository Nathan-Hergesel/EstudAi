import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Dimensions, Keyboard, KeyboardEvent, Platform, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/tokens';

type PreviewPayload = {
  value: string;
  secure: boolean;
  multiline: boolean;
};

type KeyboardPreviewContextValue = {
  showPreview: (payload: PreviewPayload) => void;
  updatePreview: (value: string) => void;
  hidePreview: () => void;
};

const noop = () => {};

const KeyboardPreviewContext = createContext<KeyboardPreviewContextValue>({
  showPreview: noop,
  updatePreview: noop,
  hidePreview: noop
});

export const KeyboardPreviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardTopY, setKeyboardTopY] = useState<number | null>(null);
  const [preview, setPreview] = useState<PreviewPayload | null>(null);

  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowHeight(window.height);
    });

    return () => {
      dimensionsSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onShow = Keyboard.addListener('keyboardDidShow', (event: KeyboardEvent) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates?.height || 0);
      setKeyboardTopY(event.endCoordinates?.screenY ?? null);
    });

    const onHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
      setKeyboardTopY(null);
      setPreview(null);
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const showPreview = useCallback((payload: PreviewPayload) => {
    setPreview(payload);
  }, []);

  const updatePreview = useCallback((value: string) => {
    setPreview((current) => (current ? { ...current, value } : current));
  }, []);

  const hidePreview = useCallback(() => {
    setPreview(null);
  }, []);

  const previewValue = useMemo(() => {
    if (!preview?.value) return 'Digite para visualizar aqui';
    if (preview.secure) return '•'.repeat(Math.min(preview.value.length, 28));
    return preview.value;
  }, [preview]);

  let keyboardOffset = 0;
  if (keyboardTopY !== null) {
    keyboardOffset = Math.max(windowHeight - keyboardTopY, 0);
  }

  if (keyboardOffset === 0 && keyboardHeight > 0) {
    keyboardOffset = keyboardHeight;
  }

  const bottomOffset = keyboardOffset + spacing.sm;

  return (
    <KeyboardPreviewContext.Provider value={{ showPreview, updatePreview, hidePreview }}>
      {children}

      {Platform.OS === 'android' && keyboardVisible && preview ? (
        <View pointerEvents="none" style={styles.overlay}>
          <View style={[styles.card, { bottom: bottomOffset }]}>
            <Text style={styles.title}>Você está digitando</Text>
            <Text style={styles.value} numberOfLines={preview.multiline ? 2 : 1}>
              {previewValue}
            </Text>
          </View>
        </View>
      ) : null}
    </KeyboardPreviewContext.Provider>
  );
};

export const useKeyboardPreview = () => useContext(KeyboardPreviewContext);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000
  },
  card: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D9E3EF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    shadowColor: '#10274D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: '#6F7A89'
  },
  value: {
    marginTop: 2,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: '#10243E'
  }
});
