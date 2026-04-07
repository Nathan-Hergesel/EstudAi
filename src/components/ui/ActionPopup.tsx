import React from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing } from '@/constants/tokens';

type ActionTone = 'default' | 'danger';

export type ActionPopupItem = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  onPress: () => void;
  tone?: ActionTone;
  disabled?: boolean;
};

type Props = {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  items: ActionPopupItem[];
  cancelLabel?: string;
};

export const ActionPopup = ({
  visible,
  title,
  subtitle,
  onClose,
  items,
  cancelLabel = 'Cancelar'
}: Props) => (
  <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.card}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

        <View style={styles.list}>
          {items.map((item) => {
            const isDanger = item.tone === 'danger';

            return (
              <Pressable
                key={item.key}
                style={[
                  styles.item,
                  isDanger ? styles.itemDanger : null,
                  item.disabled ? styles.itemDisabled : null
                ]}
                onPress={() => {
                  if (item.disabled) return;
                  item.onPress();
                  onClose();
                }}
              >
                <View style={[styles.iconWrap, isDanger ? styles.iconWrapDanger : null]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={16}
                    color={isDanger ? '#B13A3A' : '#244A84'}
                  />
                </View>

                <Text style={[styles.label, isDanger ? styles.labelDanger : null]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>{cancelLabel}</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(16, 31, 57, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DCE4F0',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    gap: spacing.sm
  },
  title: {
    color: '#162944',
    fontFamily: 'Manrope_700Bold',
    fontSize: 18
  },
  subtitle: {
    color: '#6D7F98',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  list: {
    gap: spacing.xs
  },
  item: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DEE7F3',
    backgroundColor: '#F7FAFF',
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  itemDanger: {
    borderColor: '#F2D8D8',
    backgroundColor: '#FFF6F6'
  },
  itemDisabled: {
    opacity: 0.55
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D3E0F3',
    backgroundColor: '#EEF4FF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapDanger: {
    borderColor: '#F1C9C9',
    backgroundColor: '#FDEAEA'
  },
  label: {
    color: '#1B3558',
    fontFamily: 'Inter_700Bold',
    fontSize: 13
  },
  labelDanger: {
    color: '#A23636'
  },
  cancelButton: {
    marginTop: spacing.xs,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DCE5F2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FAFF'
  },
  cancelText: {
    color: '#345988',
    fontFamily: 'Inter_700Bold',
    fontSize: 12
  }
});