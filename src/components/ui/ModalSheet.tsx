import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { layout, radius, spacing } from '@/constants/tokens';

type Props = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const ModalSheet = ({ visible, title, onClose, children }: Props) => {
  const { width } = useWindowDimensions();
  const isWide = width >= layout.sheetBreakpoint;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.keyboardAvoid, isWide && styles.keyboardAvoidWide]}
      >
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={[styles.sheet, isWide && styles.sheetWide]}>
          {!isWide && <View style={styles.handle} />}

          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={18} color="#37527C" />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16, 31, 57, 0.32)'
  },
  keyboardAvoidWide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg
  },
  sheet: {
    backgroundColor: '#F5F7FA',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '88%',
    borderTopWidth: 1,
    borderColor: '#E1E7EF',
    paddingBottom: spacing.lg
  },
  sheetWide: {
    width: '100%',
    maxWidth: layout.modalMaxWidth,
    borderRadius: radius.xl,
    borderTopWidth: 1,
    maxHeight: '80%'
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: '#C6CEDA',
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xxs
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 22,
    color: '#162944',
    flexShrink: 1,
    marginRight: spacing.sm
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8EEF8'
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md
  }
});
