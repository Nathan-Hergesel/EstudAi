import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { radius, spacing } from '@/constants/tokens';

type CriarGrupoPayload = {
  nome: string;
  emails: string[];
};

type CriarGrupoResult = {
  success: boolean;
  error?: string;
};

type Props = {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: CriarGrupoPayload) => Promise<CriarGrupoResult>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

export const CriarGrupoModal = ({ visible, loading = false, onClose, onSubmit }: Props) => {
  const [nome, setNome] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState('');

  const emailsDeduplicados = useMemo(() => Array.from(new Set(emails.map(normalizeEmail))), [emails]);

  const reset = () => {
    setNome('');
    setEmailDraft('');
    setEmails([]);
    setError('');
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible]);

  const adicionarEmailsDoRascunho = () => {
    const candidatos = emailDraft
      .split(/[\s,;]+/)
      .map(normalizeEmail)
      .filter(Boolean);

    if (candidatos.length === 0) {
      setError('Digite pelo menos um e-mail válido para adicionar.');
      return;
    }

    const invalidos = candidatos.filter((email) => !EMAIL_REGEX.test(email));
    if (invalidos.length > 0) {
      setError(`E-mail inválido: ${invalidos[0]}`);
      return;
    }

    setEmails((prev) => [...prev, ...candidatos]);
    setEmailDraft('');
    setError('');
  };

  const removerEmail = (email: string) => {
    setEmails((prev) => prev.filter((item) => item !== email));
  };

  const salvarGrupo = async () => {
    const nomeNormalizado = nome.trim();
    if (!nomeNormalizado) {
      setError('Informe um nome para o grupo.');
      return;
    }

    setError('');

    const result = await onSubmit({
      nome: nomeNormalizado,
      emails: emailsDeduplicados
    });

    if (!result.success) {
      setError(result.error || 'Não foi possível criar o grupo.');
    }
  };

  return (
    <ModalSheet visible={visible} title="Criar grupo" onClose={onClose}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dados do grupo</Text>

        <Input
          label="Nome do grupo"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Banco de Dados - Turma A"
        />

        <Text style={styles.sectionTitle}>Convidar por email</Text>
        <Input
          label="Emails"
          value={emailDraft}
          onChangeText={setEmailDraft}
          placeholder="Digite emails separados por vírgula"
          keyboardType="email-address"
        />

        <Pressable style={styles.addEmailButton} onPress={adicionarEmailsDoRascunho}>
          <MaterialCommunityIcons name="email-plus-outline" size={14} color="#0F4DAF" />
          <Text style={styles.addEmailText}>Adicionar emails</Text>
        </Pressable>

        {emailsDeduplicados.length === 0 ? (
          <Text style={styles.helperText}>Nenhum convite adicionado. Você pode criar o grupo sem convites.</Text>
        ) : (
          <View style={styles.emailChipsWrap}>
            {emailsDeduplicados.map((email) => (
              <View key={email} style={styles.emailChip}>
                <Text style={styles.emailChipText}>{email}</Text>
                <Pressable onPress={() => removerEmail(email)} hitSlop={8}>
                  <MaterialCommunityIcons name="close" size={14} color="#5A6B85" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button title={loading ? 'Criando...' : 'Criar grupo'} onPress={() => void salvarGrupo()} disabled={loading} />
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#DFE6F2',
    backgroundColor: '#FFFFFF',
    padding: spacing.sm,
    gap: spacing.xs
  },
  sectionTitle: {
    color: '#41546E',
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11,
    marginTop: 2
  },
  addEmailButton: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#CADAF4',
    backgroundColor: '#EDF4FF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  addEmailText: {
    color: '#0F4DAF',
    fontFamily: 'Inter_700Bold',
    fontSize: 11
  },
  helperText: {
    color: '#6F7F95',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  },
  emailChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  emailChip: {
    maxWidth: '100%',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#D7E3F6',
    backgroundColor: '#F4F8FF',
    minHeight: 28,
    paddingLeft: 10,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  emailChipText: {
    color: '#294A78',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    flexShrink: 1
  },
  errorText: {
    color: '#C13A3A',
    fontFamily: 'Inter_500Medium',
    fontSize: 11
  }
});
