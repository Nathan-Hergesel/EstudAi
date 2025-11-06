// Tela de Conta com o mesmo padrão visual das abas Tarefas e Agenda
import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import { contaStyles as styles } from './styles';
import { styles as tarefasStyles } from '../tarefas/styles';
import { UserIcon, CalendarIcon, EditIcon, MoreIcon, FilterIcon } from '../../assets/icons';
import EditarPerfilModal, { PerfilData } from '../../components/EditarPerfilModal';
import MateriasModal, { Materia } from '../../components/MateriasModal';
import ConfiguracoesModal, { ConfiguracoesData } from '../../components/ConfiguracoesModal';

interface ContaScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function ContaScreen({ onNavigate }: ContaScreenProps) {
  // Estados para controlar a visibilidade dos modais
  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [modalMateriasVisivel, setModalMateriasVisivel] = useState(false);
  const [modalConfigVisivel, setModalConfigVisivel] = useState(false);

  // Estado do perfil do usuário
  const [perfil, setPerfil] = useState<PerfilData>({
    nome: 'Usuário 01',
    email: 'usuario01@uniso.br',
    instituicao: 'UNISO',
    curso: 'Ciência da Computação',
  });

  // Estado das matérias
  const [materias, setMaterias] = useState<Materia[]>([
    {
      id: 1,
      nome: 'Programação Mobile',
      professor: 'João Silva',
      cor: colors.primario,
      codigo: 'CC301',
    },
    {
      id: 2,
      nome: 'Banco de Dados',
      professor: 'Maria Santos',
      cor: colors.atividade,
      codigo: 'CC302',
    },
  ]);

  // Estado das configurações
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesData>({
    notificacoesAtivas: true,
    lembreteTarefas: true,
    alertaVencimento: true,
    horasAntecedencia: 24,
    temaEscuro: false,
    mostrarConcluidas: true,
    sincronizacaoAuto: true,
  });

  // Handlers para salvar dados dos modais
  const handleSalvarPerfil = (novoPerfil: PerfilData) => {
    setPerfil(novoPerfil);
  };

  const handleSalvarMaterias = (novasMaterias: Materia[]) => {
    setMaterias(novasMaterias);
  };

  const handleSalvarConfiguracoes = (novasConfig: ConfiguracoesData) => {
    setConfiguracoes(novasConfig);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.fundo} />

      {/* Navegação Superior (mesmo estilo visual das demais abas) */}
      <View style={[tarefasStyles.topNavigation, { justifyContent: 'center' }]}>
        <TouchableOpacity
          style={[
            tarefasStyles.navButton,
            tarefasStyles.navButtonActive,
            { flex: 0, minWidth: 120, alignSelf: 'center' },
          ]}
          activeOpacity={1}
        >
          <Text style={[tarefasStyles.navButtonText, tarefasStyles.navButtonTextActive]}>CONTA</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.content}>
          {/* Card de perfil */}
          <TouchableOpacity 
            style={styles.profileCard}
            onPress={() => setModalPerfilVisivel(true)}
            activeOpacity={0.7}
          >
            <View style={styles.avatarCircle}>
              <UserIcon width={28} height={28} />
            </View>
            <View>
              <Text style={styles.greetTitle}>Olá, {perfil.nome}</Text>
              <Text style={styles.greetSubtitle}>Seja Bem Vindo !</Text>
            </View>
            <Text style={styles.rightArrow}>›</Text>
          </TouchableOpacity>

          {/* Grid de ações */}
          <View style={styles.grid}>
            <TouchableOpacity style={styles.tile} onPress={() => onNavigate?.('Agenda')}>
              <CalendarIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Horários</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tile}
              onPress={() => setModalMateriasVisivel(true)}
            >
              <MoreIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Matérias</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tile} 
              onPress={() => setModalPerfilVisivel(true)}
            >
              <EditIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Editar Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tile}
              onPress={() => setModalConfigVisivel(true)}
            >
              <FilterIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Configurações</Text>
            </TouchableOpacity>
          </View>

          {/* Banner institucional */}
          <View style={styles.banner}>
            <View style={styles.bannerRow}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>U</Text>
              </View>
              <View>
                <Text style={styles.bannerTitle}>UNISO</Text>
                <Text style={styles.bannerSub}>Universidade de Sorocaba</Text>
              </View>
            </View>
            <Text style={styles.bannerText}>
              O EstudAI foi desenvolvido por estudantes da UNISO com o objetivo de auxiliar na organização e
              otimização dos estudos, proporcionando uma experiência prática e eficiente para quem busca
              melhorar seu desempenho acadêmico. Esta ferramenta foi idealizada por estudantes para fins
              educacionais e não possui objetivos comerciais ou fins lucrativos.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modais */}
      <EditarPerfilModal
        visible={modalPerfilVisivel}
        onClose={() => setModalPerfilVisivel(false)}
        onSave={handleSalvarPerfil}
        perfilAtual={perfil}
      />

      <MateriasModal
        visible={modalMateriasVisivel}
        onClose={() => setModalMateriasVisivel(false)}
        onSave={handleSalvarMaterias}
        materias={materias}
      />

      <ConfiguracoesModal
        visible={modalConfigVisivel}
        onClose={() => setModalConfigVisivel(false)}
        onSave={handleSalvarConfiguracoes}
        configAtual={configuracoes}
      />
    </View>
  );
}
