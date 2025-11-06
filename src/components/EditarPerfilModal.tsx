/**
 * Modal de edição de perfil do usuário
 * Permite alterar nome, email e foto do perfil
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import globalStyles from '../global/styles';
import { colors } from '../constants/colors';
import { UserIcon } from '../assets/icons';

/**
 * Estrutura com as informações do perfil
 */
export interface PerfilData {
  /** Nome do usuário */
  nome: string;
  /** Email do usuário */
  email: string;
  /** Instituição de ensino */
  instituicao: string;
  /** Curso */
  curso: string;
}

/**
 * Propriedades aceitas pelo componente
 */
interface EditarPerfilModalProps {
  /** Controla a visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para salvar as alterações */
  onSave: (perfil: PerfilData) => void;
  /** Dados atuais do perfil */
  perfilAtual: PerfilData;
}

/**
 * Componente de modal para edição de perfil do usuário
 */
const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  visible,
  onClose,
  onSave,
  perfilAtual,
}) => {
  // Estado local com os dados do formulário
  const [perfil, setPerfil] = useState<PerfilData>(perfilAtual);

  // Sincroniza estado local quando o modal abrir ou dados mudarem
  useEffect(() => {
    setPerfil(perfilAtual);
  }, [perfilAtual, visible]);

  // Valida e salva as alterações
  const handleSave = () => {
    // Validação básica
    if (!perfil.nome.trim()) {
      Alert.alert('Erro', 'O nome é obrigatório');
      return;
    }

    if (!perfil.email.trim()) {
      Alert.alert('Erro', 'O email é obrigatório');
      return;
    }

    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(perfil.email)) {
      Alert.alert('Erro', 'Digite um email válido');
      return;
    }

    onSave(perfil);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[globalStyles.container, globalStyles.containerCompact]}>
        {/* Cabeçalho do modal */}
        <View style={globalStyles.header}>
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Editar Perfil</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Conteúdo rolável */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Avatar do usuário */}
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: colors.primarioClaro,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: colors.primario,
              }}
            >
              <UserIcon width={50} height={50} />
            </View>
            <TouchableOpacity style={{ marginTop: 10 }}>
              <Text style={{ color: colors.primario, fontWeight: '600' }}>
                Alterar foto
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção de dados pessoais */}
          <View style={globalStyles.section}>
            <Text style={globalStyles.label}>Nome Completo</Text>
            <TextInput
              style={globalStyles.input}
              value={perfil.nome}
              onChangeText={(text) => setPerfil({ ...perfil, nome: text })}
              placeholder="Digite seu nome completo"
              placeholderTextColor={colors.textoTerciario}
            />
          </View>

          <View style={globalStyles.section}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              style={globalStyles.input}
              value={perfil.email}
              onChangeText={(text) => setPerfil({ ...perfil, email: text })}
              placeholder="Digite seu email"
              placeholderTextColor={colors.textoTerciario}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={globalStyles.section}>
            <Text style={globalStyles.label}>Instituição</Text>
            <TextInput
              style={globalStyles.input}
              value={perfil.instituicao}
              onChangeText={(text) => setPerfil({ ...perfil, instituicao: text })}
              placeholder="Digite sua instituição"
              placeholderTextColor={colors.textoTerciario}
            />
          </View>

          <View style={globalStyles.section}>
            <Text style={globalStyles.label}>Curso</Text>
            <TextInput
              style={globalStyles.input}
              value={perfil.curso}
              onChangeText={(text) => setPerfil({ ...perfil, curso: text })}
              placeholder="Digite seu curso"
              placeholderTextColor={colors.textoTerciario}
            />
          </View>

          {/* Seção de segurança */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12 }]}>Segurança</Text>
            <TouchableOpacity
              style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: colors.superficie,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: colors.borda,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: colors.textoPrimario, fontSize: 16 }}>
                Alterar senha
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Rodapé com botão de salvar */}
        <View style={globalStyles.footer}>
          <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
            <Text style={globalStyles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditarPerfilModal;
