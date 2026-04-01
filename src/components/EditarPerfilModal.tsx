import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { colors, spacing } from '@/constants/tokens';
import { Profile } from '@/types/database.types';

type Props = {
  visible: boolean;
  profile: Profile | null;
  onSave: (payload: Partial<Profile>) => Promise<void>;
  onClose: () => void;
};

export const EditarPerfilModal = ({ visible, profile, onSave, onClose }: Props) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [instituicao, setInstituicao] = useState('');
  const [curso, setCurso] = useState('');

  useEffect(() => {
    setNome(profile?.nome || '');
    setEmail(profile?.email || '');
    setInstituicao(profile?.instituicao || '');
    setCurso(profile?.curso || '');
  }, [profile, visible]);

  const submit = async () => {
    if (!nome || !email) {
      Alert.alert('Campos obrigatórios', 'Nome e e-mail são obrigatórios.');
      return;
    }
    await onSave({ nome, email, instituicao, curso });
    onClose();
  };

  return (
    <ModalSheet visible={visible} title="Editar conta" onClose={onClose}>
      <View style={styles.form}>
        <View style={styles.helperCard}>
          <Text style={styles.helperText}>Atualize seus dados para manter o perfil sincronizado entre dispositivos.</Text>
        </View>
        <Input label="Nome" value={nome} onChangeText={setNome} />
        <Input label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Input label="Instituição" value={instituicao} onChangeText={setInstituicao} />
        <Input label="Curso" value={curso} onChangeText={setCurso} />
        <Button title="Salvar perfil" onPress={submit} />
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: spacing.sm
  },
  helperCard: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DFE6F0',
    padding: spacing.sm
  },
  helperText: {
    color: '#4A5E78',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16
  }
});
