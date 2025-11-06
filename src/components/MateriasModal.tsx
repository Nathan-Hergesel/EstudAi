/**
 * Modal de gerenciamento de matérias/disciplinas
 * Permite adicionar, editar e remover matérias
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
import { useAuth } from '../contexts/AuthContext';
import * as supabaseService from '../services/supabase.service';

/**
 * Estrutura de uma matéria
 */
export interface Materia {
  /** ID único da matéria */
  id: number;
  /** Nome da matéria */
  nome: string;
  /** Professor da matéria */
  professor: string;
  /** Cor associada à matéria (hex) */
  cor: string;
  /** Código da disciplina (opcional) */
  codigo?: string;
}

/**
 * Propriedades aceitas pelo componente
 */
interface MateriasModalProps {
  /** Controla a visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Lista atual de matérias */
  materias: Materia[];
  /** Callback para salvar alterações nas matérias */
  onSave: (materias: Materia[]) => void;
}

/**
 * Componente de modal para gerenciar matérias
 */
const MateriasModal: React.FC<MateriasModalProps> = ({
  visible,
  onClose,
  materias,
  onSave,
}) => {
  const { user } = useAuth();
  // Estado local com a lista de matérias
  const [listaMaterias, setListaMaterias] = useState<Materia[]>(materias);
  // Estado para controlar edição de matéria específica
  const [editandoId, setEditandoId] = useState<number | null>(null);
  // Estado para adicionar nova matéria
  const [adicionando, setAdicionando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  // Estado do formulário de nova matéria
  const [novaMateria, setNovaMateria] = useState<Omit<Materia, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    nome: '',
    professor: '',
    cor: colors.primario,
    codigo: '',
  });

  // Cores disponíveis para as matérias
  const coresDisponiveis = [
    colors.primario,
    colors.atividade,
    colors.trabalho,
    colors.prova,
    colors.secundario,
    // colors.informacao removido pois é igual a primario (#2563EB)
  ];

  // Sincroniza estado local quando modal abrir
  useEffect(() => {
    setListaMaterias(materias);
    setAdicionando(false);
    setEditandoId(null);
  }, [materias, visible]);

  // Adiciona nova matéria
  const handleAdicionarMateria = async () => {
    if (!novaMateria.nome.trim()) {
      Alert.alert('Erro', 'O nome da matéria é obrigatório');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setSalvando(true);
    try {
      const result = await supabaseService.criarMateria(user.id, {
        nome: novaMateria.nome,
        professor: novaMateria.professor || null,
        codigo: novaMateria.codigo || null,
        cor: novaMateria.cor,
      });

      if (result.success && result.data) {
        const novaListaAtualizada = [...listaMaterias, result.data];
        setListaMaterias(novaListaAtualizada);
        onSave(novaListaAtualizada); // Atualiza o estado pai imediatamente
        setNovaMateria({
          nome: '',
          professor: '',
          cor: colors.primario,
          codigo: '',
        });
        setAdicionando(false);
        Alert.alert('Sucesso', 'Matéria adicionada com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar a matéria');
      }
    } catch (error) {
      console.error('Erro ao adicionar matéria:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a matéria');
    } finally {
      setSalvando(false);
    }
  };

  // Remove uma matéria
  const handleRemoverMateria = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta matéria?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setSalvando(true);
            try {
              const result = await supabaseService.removerMateria(id);
              if (result.success) {
                const novaListaAtualizada = listaMaterias.filter((m) => m.id !== id);
                setListaMaterias(novaListaAtualizada);
                onSave(novaListaAtualizada); // Atualiza o estado pai imediatamente
                Alert.alert('Sucesso', 'Matéria removida com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível remover a matéria');
              }
            } catch (error) {
              console.error('Erro ao remover matéria:', error);
              Alert.alert('Erro', 'Não foi possível remover a matéria');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  // Renderiza um item de matéria
  const renderMateriaItem = (materia: Materia) => (
    <View
      key={materia.id}
      style={{
        backgroundColor: colors.superficie,
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: materia.cor,
        borderWidth: 1,
        borderColor: colors.borda,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textoPrimario }}>
            {materia.nome}
          </Text>
          {materia.codigo && (
            <Text style={{ fontSize: 12, color: colors.textoSecundario, marginTop: 2 }}>
              Código: {materia.codigo}
            </Text>
          )}
          {materia.professor && (
            <Text style={{ fontSize: 14, color: colors.textoSecundario, marginTop: 4 }}>
              Prof. {materia.professor}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleRemoverMateria(materia.id)}
          style={{
            padding: 8,
            backgroundColor: colors.erro,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: colors.textoInverso, fontWeight: '600', fontSize: 12 }}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderiza formulário de nova matéria
  const renderFormularioNova = () => (
    <View
      style={{
        backgroundColor: colors.primarioClaro,
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: colors.primario,
      }}
    >
      <Text style={[globalStyles.label, { marginBottom: 8 }]}>Nova Matéria</Text>

      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        value={novaMateria.nome}
        onChangeText={(text) => setNovaMateria({ ...novaMateria, nome: text })}
        placeholder="Nome da matéria *"
        placeholderTextColor={colors.textoTerciario}
      />

      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        value={novaMateria.codigo}
        onChangeText={(text) => setNovaMateria({ ...novaMateria, codigo: text })}
        placeholder="Código da disciplina (opcional)"
        placeholderTextColor={colors.textoTerciario}
      />

      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        value={novaMateria.professor}
        onChangeText={(text) => setNovaMateria({ ...novaMateria, professor: text })}
        placeholder="Nome do professor"
        placeholderTextColor={colors.textoTerciario}
      />

      {/* Seletor de cor */}
      <Text style={[globalStyles.label, { marginTop: 5, marginBottom: 8 }]}>
        Cor da matéria
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
        {coresDisponiveis.map((cor, index) => (
          <TouchableOpacity
            key={`${cor}-${index}`}
            onPress={() => setNovaMateria({ ...novaMateria, cor })}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: cor,
              borderWidth: novaMateria.cor === cor ? 3 : 1,
              borderColor: novaMateria.cor === cor ? colors.textoPrimario : colors.borda,
            }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={[globalStyles.button, { flex: 1, opacity: salvando ? 0.6 : 1 }]}
          onPress={handleAdicionarMateria}
          disabled={salvando}
        >
          <Text style={globalStyles.buttonText}>{salvando ? 'Salvando...' : 'Adicionar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.buttonSecondary, { flex: 1 }]}
          onPress={() => {
            setAdicionando(false);
            setNovaMateria({
              nome: '',
              professor: '',
              cor: colors.primario,
              codigo: '',
            });
          }}
          disabled={salvando}
        >
          <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[globalStyles.container, globalStyles.containerCompact]}>
        {/* Cabeçalho */}
        <View style={globalStyles.header}>
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Matérias</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Conteúdo */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Botão para adicionar nova matéria */}
          {!adicionando && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primario,
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={() => setAdicionando(true)}
            >
              <Text style={{ color: colors.textoInverso, fontSize: 16, fontWeight: '600' }}>
                + Adicionar Matéria
              </Text>
            </TouchableOpacity>
          )}

          {/* Formulário de nova matéria */}
          {adicionando && renderFormularioNova()}

          {/* Lista de matérias */}
          <View>
            <Text style={[globalStyles.label, { marginBottom: 12 }]}>
              Minhas Matérias ({listaMaterias.length})
            </Text>
            {listaMaterias.length === 0 ? (
              <View
                style={{
                  padding: 30,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.textoSecundario, textAlign: 'center' }}>
                  Nenhuma matéria cadastrada.{'\n'}
                  Adicione suas matérias para organizar melhor seus estudos!
                </Text>
              </View>
            ) : (
              listaMaterias.map((materia) => renderMateriaItem(materia))
            )}
          </View>
        </ScrollView>

        {/* Rodapé */}
        <View style={globalStyles.footer}>
          <TouchableOpacity style={globalStyles.button} onPress={onClose}>
            <Text style={globalStyles.buttonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MateriasModal;
