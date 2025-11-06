/**
 * Modal de gerenciamento de horários/aulas
 * Permite adicionar, editar e remover horários da grade semanal
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
import type { Horario } from '../types/database.types';

/**
 * Estrutura de um horário com informações da matéria
 */
export interface HorarioComMateria extends Horario {
  materia_nome: string;
  materia_cor: string;
}

/**
 * Matéria simplificada para seleção
 */
interface MateriaSimples {
  id: number;
  nome: string;
  cor: string;
}

/**
 * Propriedades aceitas pelo componente
 */
interface HorariosModalProps {
  /** Controla a visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Lista de matérias disponíveis */
  materias: MateriaSimples[];
  /** Callback para atualizar a lista de horários */
  onRefresh: () => void;
}

const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Componente de modal para gerenciar horários de aulas
 */
const HorariosModal: React.FC<HorariosModalProps> = ({
  visible,
  onClose,
  materias,
  onRefresh,
}) => {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState<HorarioComMateria[]>([]);
  const [adicionando, setAdicionando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Estado do formulário de novo horário
  const [novoHorario, setNovoHorario] = useState({
    materia_id: 0,
    dia_semana: 1, // Segunda-feira por padrão
    hora_inicio: '',
    hora_fim: '',
    local: '',
    observacoes: '',
  });

  // Carregar horários quando o modal abrir
  useEffect(() => {
    if (visible && user) {
      carregarHorarios();
    }
  }, [visible, user]);

  const carregarHorarios = async () => {
    if (!user) return;
    
    setCarregando(true);
    try {
      const result = await supabaseService.listarHorarios(user.id);
      if (result.success && result.data) {
        setHorarios(result.data as HorarioComMateria[]);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários');
    } finally {
      setCarregando(false);
    }
  };

  // Adiciona novo horário
  const handleAdicionarHorario = async () => {
    if (!novoHorario.materia_id) {
      Alert.alert('Erro', 'Selecione uma matéria');
      return;
    }

    if (!novoHorario.hora_inicio || !novoHorario.hora_fim) {
      Alert.alert('Erro', 'Informe os horários de início e fim');
      return;
    }

    // Validar formato de hora (HH:MM)
    const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!horaRegex.test(novoHorario.hora_inicio) || !horaRegex.test(novoHorario.hora_fim)) {
      Alert.alert('Erro', 'Use o formato HH:MM para os horários (ex: 08:00)');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setSalvando(true);
    try {
      const result = await supabaseService.criarHorario(user.id, {
        materia_id: novoHorario.materia_id,
        dia_semana: novoHorario.dia_semana,
        hora_inicio: `${novoHorario.hora_inicio}:00`,
        hora_fim: `${novoHorario.hora_fim}:00`,
        local: novoHorario.local || null,
        observacoes: novoHorario.observacoes || null,
      });

      if (result.success) {
        await carregarHorarios();
        onRefresh();
        setNovoHorario({
          materia_id: 0,
          dia_semana: 1,
          hora_inicio: '',
          hora_fim: '',
          local: '',
          observacoes: '',
        });
        setAdicionando(false);
        Alert.alert('Sucesso', 'Horário adicionado com sucesso!');
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar o horário');
      }
    } catch (error) {
      console.error('Erro ao adicionar horário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o horário');
    } finally {
      setSalvando(false);
    }
  };

  // Remove um horário
  const handleRemoverHorario = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este horário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setSalvando(true);
            try {
              const result = await supabaseService.removerHorario(id);
              if (result.success) {
                await carregarHorarios();
                onRefresh();
                Alert.alert('Sucesso', 'Horário removido com sucesso!');
              } else {
                Alert.alert('Erro', 'Não foi possível remover o horário');
              }
            } catch (error) {
              console.error('Erro ao remover horário:', error);
              Alert.alert('Erro', 'Não foi possível remover o horário');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  // Renderiza um item de horário
  const renderHorarioItem = (horario: HorarioComMateria) => (
    <View
      key={horario.id}
      style={{
        backgroundColor: colors.superficie,
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: horario.materia_cor,
        borderWidth: 1,
        borderColor: colors.borda,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textoPrimario }}>
            {horario.materia_nome}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textoSecundario, marginTop: 4 }}>
            {diasSemana[horario.dia_semana]} • {horario.hora_inicio.slice(0, 5)} - {horario.hora_fim.slice(0, 5)}
          </Text>
          {horario.local && (
            <Text style={{ fontSize: 12, color: colors.textoSecundario, marginTop: 2 }}>
              📍 {horario.local}
            </Text>
          )}
          {horario.observacoes && (
            <Text style={{ fontSize: 12, color: colors.textoSecundario, marginTop: 2, fontStyle: 'italic' }}>
              {horario.observacoes}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleRemoverHorario(horario.id)}
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

  // Renderiza formulário de novo horário
  const renderFormularioNovo = () => (
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
      <Text style={[globalStyles.label, { marginBottom: 8 }]}>Novo Horário</Text>

      {/* Seletor de Matéria */}
      <Text style={[globalStyles.label, { marginTop: 5, marginBottom: 5, fontSize: 12 }]}>
        Matéria *
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 15 }}
      >
        {materias.map((materia) => (
          <TouchableOpacity
            key={materia.id}
            onPress={() => setNovoHorario({ ...novoHorario, materia_id: materia.id })}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 20,
              backgroundColor: novoHorario.materia_id === materia.id ? materia.cor : colors.superficie,
              borderWidth: 2,
              borderColor: novoHorario.materia_id === materia.id ? materia.cor : colors.borda,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: novoHorario.materia_id === materia.id ? colors.textoInverso : colors.textoPrimario,
                fontWeight: novoHorario.materia_id === materia.id ? '600' : '400',
                fontSize: 13,
              }}
            >
              {materia.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Seletor de Dia da Semana */}
      <Text style={[globalStyles.label, { marginTop: 5, marginBottom: 5, fontSize: 12 }]}>
        Dia da Semana *
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 15 }}
      >
        {diasSemana.map((dia, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setNovoHorario({ ...novoHorario, dia_semana: index })}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: novoHorario.dia_semana === index ? colors.primario : colors.superficie,
              borderWidth: 2,
              borderColor: novoHorario.dia_semana === index ? colors.primario : colors.borda,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                color: novoHorario.dia_semana === index ? colors.textoInverso : colors.textoPrimario,
                fontWeight: novoHorario.dia_semana === index ? '600' : '400',
                fontSize: 13,
              }}
            >
              {dia.slice(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Horários */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.label, { marginBottom: 5, fontSize: 12 }]}>Início *</Text>
          <TextInput
            style={[globalStyles.input]}
            value={novoHorario.hora_inicio}
            onChangeText={(text) => setNovoHorario({ ...novoHorario, hora_inicio: text })}
            placeholder="08:00"
            placeholderTextColor={colors.textoTerciario}
            maxLength={5}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[globalStyles.label, { marginBottom: 5, fontSize: 12 }]}>Fim *</Text>
          <TextInput
            style={[globalStyles.input]}
            value={novoHorario.hora_fim}
            onChangeText={(text) => setNovoHorario({ ...novoHorario, hora_fim: text })}
            placeholder="10:00"
            placeholderTextColor={colors.textoTerciario}
            maxLength={5}
          />
        </View>
      </View>

      <TextInput
        style={[globalStyles.input, { marginBottom: 10 }]}
        value={novoHorario.local}
        onChangeText={(text) => setNovoHorario({ ...novoHorario, local: text })}
        placeholder="Local (ex: Sala 201)"
        placeholderTextColor={colors.textoTerciario}
      />

      <TextInput
        style={[globalStyles.input, { marginBottom: 15, minHeight: 60 }]}
        value={novoHorario.observacoes}
        onChangeText={(text) => setNovoHorario({ ...novoHorario, observacoes: text })}
        placeholder="Observações (opcional)"
        placeholderTextColor={colors.textoTerciario}
        multiline
        numberOfLines={2}
      />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={[globalStyles.button, { flex: 1, opacity: salvando ? 0.6 : 1 }]}
          onPress={handleAdicionarHorario}
          disabled={salvando}
        >
          <Text style={globalStyles.buttonText}>{salvando ? 'Salvando...' : 'Adicionar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[globalStyles.buttonSecondary, { flex: 1 }]}
          onPress={() => {
            setAdicionando(false);
            setNovoHorario({
              materia_id: 0,
              dia_semana: 1,
              hora_inicio: '',
              hora_fim: '',
              local: '',
              observacoes: '',
            });
          }}
          disabled={salvando}
        >
          <Text style={globalStyles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Agrupar horários por dia
  const horariosPorDia = horarios.reduce((acc, horario) => {
    if (!acc[horario.dia_semana]) {
      acc[horario.dia_semana] = [];
    }
    acc[horario.dia_semana].push(horario);
    return acc;
  }, {} as Record<number, HorarioComMateria[]>);

  // Ordenar horários de cada dia por hora de início
  Object.keys(horariosPorDia).forEach((dia) => {
    horariosPorDia[parseInt(dia)].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[globalStyles.container, globalStyles.containerCompact]}>
        {/* Cabeçalho */}
        <View style={globalStyles.header}>
          <TouchableOpacity onPress={onClose} style={globalStyles.buttonSecondary}>
            <Text style={globalStyles.buttonSecondaryText}>Fechar</Text>
          </TouchableOpacity>
          <Text style={globalStyles.title}>Horários</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Conteúdo */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Aviso se não tiver matérias */}
          {materias.length === 0 && (
            <View
              style={{
                padding: 20,
                backgroundColor: colors.secundarioClaro,
                borderRadius: 8,
                marginBottom: 15,
                borderWidth: 2,
                borderColor: colors.aviso,
              }}
            >
              <Text style={{ color: colors.textoPrimario, textAlign: 'center', fontWeight: '500' }}>
                ⚠️ Cadastre matérias primeiro para adicionar horários
              </Text>
            </View>
          )}

          {/* Botão para adicionar novo horário */}
          {!adicionando && materias.length > 0 && (
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
                + Adicionar Horário
              </Text>
            </TouchableOpacity>
          )}

          {/* Formulário de novo horário */}
          {adicionando && renderFormularioNovo()}

          {/* Lista de horários agrupados por dia */}
          {carregando ? (
            <Text style={{ textAlign: 'center', color: colors.textoSecundario, padding: 20 }}>
              Carregando horários...
            </Text>
          ) : horarios.length === 0 ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <Text style={{ color: colors.textoSecundario, textAlign: 'center' }}>
                Nenhum horário cadastrado.{'\n'}
                Adicione seus horários de aula para melhor organização!
              </Text>
            </View>
          ) : (
            diasSemana.map((dia, index) => {
              const horariosNoDia = horariosPorDia[index] || [];
              if (horariosNoDia.length === 0) return null;

              return (
                <View key={index} style={{ marginBottom: 20 }}>
                  <Text
                    style={[
                      globalStyles.label,
                      { marginBottom: 10, fontSize: 16, fontWeight: '700' },
                    ]}
                  >
                    {dia} ({horariosNoDia.length})
                  </Text>
                  {horariosNoDia.map((horario) => renderHorarioItem(horario))}
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default HorariosModal;
