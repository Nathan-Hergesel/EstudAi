/**
 * Modal de configurações do aplicativo
 * Permite ajustar preferências e configurações gerais
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import globalStyles from '../global/styles';
import { colors } from '../constants/colors';

/**
 * Estrutura das configurações
 */
export interface ConfiguracoesData {
  /** Notificações habilitadas */
  notificacoesAtivas: boolean;
  /** Notificações de lembrete de tarefas */
  lembreteTarefas: boolean;
  /** Notificações de tarefas próximas ao vencimento */
  alertaVencimento: boolean;
  /** Horas de antecedência para alertas (24, 48, 72h) */
  horasAntecedencia: number;
  /** Tema escuro habilitado */
  temaEscuro: boolean;
  /** Mostrar tarefas concluídas */
  mostrarConcluidas: boolean;
  /** Sincronização automática */
  sincronizacaoAuto: boolean;
}

/**
 * Propriedades aceitas pelo componente
 */
interface ConfiguracoesModalProps {
  /** Controla a visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Callback para salvar as configurações */
  onSave: (config: ConfiguracoesData) => void;
  /** Configurações atuais */
  configAtual: ConfiguracoesData;
}

/**
 * Componente de modal para configurações do app
 */
const ConfiguracoesModal: React.FC<ConfiguracoesModalProps> = ({
  visible,
  onClose,
  onSave,
  configAtual,
}) => {
  // Estado local com as configurações
  const [config, setConfig] = useState<ConfiguracoesData>(configAtual);

  // Sincroniza estado local quando modal abrir
  useEffect(() => {
    setConfig(configAtual);
  }, [configAtual, visible]);

  // Salva as configurações
  const handleSalvar = () => {
    onSave(config);
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    onClose();
  };

  // Renderiza uma opção com switch
  const renderSwitchOption = (
    label: string,
    description: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    disabled?: boolean
  ) => (
    <View
      style={{
        backgroundColor: colors.superficie,
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.borda,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, marginRight: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textoPrimario }}>
            {label}
          </Text>
          <Text style={{ fontSize: 13, color: colors.textoSecundario, marginTop: 4 }}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.borda, true: colors.primarioClaro }}
          thumbColor={value ? colors.primario : colors.textoTerciario}
          disabled={disabled}
        />
      </View>
    </View>
  );

  // Renderiza opções de escolha múltipla
  const renderMultipleChoice = (
    label: string,
    options: { value: number; label: string }[],
    currentValue: number,
    onSelect: (value: number) => void
  ) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={[globalStyles.label, { marginBottom: 12 }]}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              globalStyles.chip,
              currentValue === option.value && {
                backgroundColor: colors.primario,
                borderColor: colors.primario,
                borderWidth: 2,
              },
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={[
                globalStyles.chipText,
                currentValue === option.value && {
                  color: colors.textoInverso,
                  fontWeight: '700',
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
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
          <Text style={globalStyles.title}>Configurações</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Conteúdo */}
        <ScrollView style={globalStyles.content} showsVerticalScrollIndicator={false}>
          {/* Seção: Notificações */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12, fontSize: 18 }]}>
              Notificações
            </Text>

            {renderSwitchOption(
              'Ativar Notificações',
              'Receba alertas e lembretes no seu dispositivo',
              config.notificacoesAtivas,
              (value) => {
                setConfig({
                  ...config,
                  notificacoesAtivas: value,
                  // Desativa sub-opções se notificações forem desativadas
                  lembreteTarefas: value ? config.lembreteTarefas : false,
                  alertaVencimento: value ? config.alertaVencimento : false,
                });
              }
            )}

            {renderSwitchOption(
              'Lembrete de Tarefas',
              'Receba lembretes sobre suas tarefas pendentes',
              config.lembreteTarefas,
              (value) => setConfig({ ...config, lembreteTarefas: value }),
              !config.notificacoesAtivas
            )}

            {renderSwitchOption(
              'Alerta de Vencimento',
              'Seja avisado quando tarefas estiverem próximas ao vencimento',
              config.alertaVencimento,
              (value) => setConfig({ ...config, alertaVencimento: value }),
              !config.notificacoesAtivas
            )}

            {/* Opções de antecedência apenas se alertas estiverem ativos */}
            {config.notificacoesAtivas && config.alertaVencimento && (
              renderMultipleChoice(
                'Antecipar alertas em:',
                [
                  { value: 24, label: '24h' },
                  { value: 48, label: '48h' },
                  { value: 72, label: '72h' },
                ],
                config.horasAntecedencia,
                (value) => setConfig({ ...config, horasAntecedencia: value })
              )
            )}
          </View>

          {/* Seção: Aparência */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12, fontSize: 18 }]}>
              Aparência
            </Text>

            {renderSwitchOption(
              'Tema Escuro',
              'Ative o modo escuro para reduzir o brilho da tela',
              config.temaEscuro,
              (value) => setConfig({ ...config, temaEscuro: value })
            )}

            <View
              style={{
                backgroundColor: colors.aviso + '20',
                padding: 12,
                borderRadius: 8,
                borderLeftWidth: 4,
                borderLeftColor: colors.aviso,
              }}
            >
              <Text style={{ color: colors.textoSecundario, fontSize: 13 }}>
                ⚠️ Tema escuro estará disponível em breve
              </Text>
            </View>
          </View>

          {/* Seção: Exibição */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12, fontSize: 18 }]}>
              Exibição
            </Text>

            {renderSwitchOption(
              'Mostrar Tarefas Concluídas',
              'Exiba tarefas já concluídas na lista de tarefas',
              config.mostrarConcluidas,
              (value) => setConfig({ ...config, mostrarConcluidas: value })
            )}
          </View>

          {/* Seção: Dados */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12, fontSize: 18 }]}>
              Sincronização
            </Text>

            {renderSwitchOption(
              'Sincronização Automática',
              'Sincronize automaticamente seus dados na nuvem',
              config.sincronizacaoAuto,
              (value) => setConfig({ ...config, sincronizacaoAuto: value })
            )}

            <TouchableOpacity
              style={{
                backgroundColor: colors.informacao,
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <Text style={{ color: colors.textoInverso, fontSize: 16, fontWeight: '600' }}>
                Sincronizar Agora
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção: Sobre */}
          <View style={globalStyles.section}>
            <Text style={[globalStyles.label, { marginBottom: 12, fontSize: 18 }]}>
              Sobre o App
            </Text>

            <View
              style={{
                backgroundColor: colors.superficie,
                borderRadius: 8,
                padding: 15,
                borderWidth: 1,
                borderColor: colors.borda,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: colors.textoSecundario }}>Versão</Text>
                <Text style={{ color: colors.textoPrimario, fontWeight: '600' }}>1.0.0</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: colors.textoSecundario }}>Desenvolvido por</Text>
                <Text style={{ color: colors.textoPrimario, fontWeight: '600' }}>UNISO</Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                padding: 15,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 15,
                borderWidth: 1,
                borderColor: colors.erro,
              }}
              onPress={() =>
                Alert.alert(
                  'Sair da Conta',
                  'Tem certeza que deseja sair?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Sair', style: 'destructive' },
                  ]
                )
              }
            >
              <Text style={{ color: colors.erro, fontSize: 16, fontWeight: '600' }}>
                Sair da Conta
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Rodapé */}
        <View style={globalStyles.footer}>
          <TouchableOpacity style={globalStyles.button} onPress={handleSalvar}>
            <Text style={globalStyles.buttonText}>Salvar Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfiguracoesModal;
