// Tela de Conta com o mesmo padrão visual das abas Tarefas e Agenda
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '../../constants/colors';
import { contaStyles as styles } from './styles';
import { styles as tarefasStyles } from '../tarefas/styles';
import { UserIcon, CalendarIcon, EditIcon, MoreIcon, FilterIcon } from '../../assets/icons';
import EditarPerfilModal, { PerfilData } from '../../components/EditarPerfilModal';
import MateriasModal, { Materia } from '../../components/MateriasModal';
import HorariosModal from '../../components/HorariosModal';
import ConfiguracoesModal, { ConfiguracoesData } from '../../components/ConfiguracoesModal';
import { useAuth } from '../../contexts/AuthContext';
import * as supabaseService from '../../services/supabase.service';

interface ContaScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function ContaScreen({ onNavigate }: ContaScreenProps) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  
  // Estados para controlar a visibilidade dos modais
  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [modalMateriasVisivel, setModalMateriasVisivel] = useState(false);
  const [modalHorariosVisivel, setModalHorariosVisivel] = useState(false);
  const [modalConfigVisivel, setModalConfigVisivel] = useState(false);

  // Estado do perfil do usuário
  const [perfil, setPerfil] = useState<PerfilData>({
    nome: profile?.nome || 'Usuário',
    email: profile?.email || user?.email || '',
    instituicao: profile?.instituicao || '',
    curso: profile?.curso || '',
  });

  // Estado das matérias
  const [materias, setMaterias] = useState<Materia[]>([]);

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

  // Carregar dados do Supabase
  useEffect(() => {
    if (user && profile) {
      setPerfil({
        nome: profile.nome,
        email: profile.email,
        instituicao: profile.instituicao || '',
        curso: profile.curso || '',
      });
      carregarMaterias();
      carregarConfiguracoes();
    }
  }, [user, profile]);

  const carregarMaterias = async () => {
    if (!user) return;
    const result = await supabaseService.listarMaterias(user.id);
    if (result.success && result.data) {
      setMaterias(result.data as Materia[]);
    }
  };

  const carregarConfiguracoes = async () => {
    if (!user) return;
    const result = await supabaseService.obterConfiguracoes(user.id);
    if (result.success && result.data) {
      setConfiguracoes({
        notificacoesAtivas: result.data.notificacoes_ativas,
        lembreteTarefas: result.data.lembrete_tarefas,
        alertaVencimento: result.data.alerta_vencimento,
        horasAntecedencia: result.data.horas_antecedencia,
        temaEscuro: result.data.tema_escuro,
        mostrarConcluidas: result.data.mostrar_concluidas,
        sincronizacaoAuto: result.data.sincronizacao_auto,
      });
    }
  };

  // Handlers para salvar dados dos modais
  const handleSalvarPerfil = async (novoPerfil: PerfilData) => {
    if (!user) return;
    
    const result = await supabaseService.atualizarPerfil(user.id, {
      nome: novoPerfil.nome,
      email: novoPerfil.email,
      instituicao: novoPerfil.instituicao,
      curso: novoPerfil.curso,
    });

    if (result.success) {
      setPerfil(novoPerfil);
      await refreshProfile();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  const handleSalvarMaterias = async (novasMaterias: Materia[]) => {
    setMaterias(novasMaterias);
    await carregarMaterias();
  };

  const handleSalvarConfiguracoes = async (novasConfig: ConfiguracoesData) => {
    if (!user) return;

    const result = await supabaseService.atualizarConfiguracoes(user.id, {
      notificacoes_ativas: novasConfig.notificacoesAtivas,
      lembrete_tarefas: novasConfig.lembreteTarefas,
      alerta_vencimento: novasConfig.alertaVencimento,
      horas_antecedencia: novasConfig.horasAntecedencia,
      tema_escuro: novasConfig.temaEscuro,
      mostrar_concluidas: novasConfig.mostrarConcluidas,
      sincronizacao_auto: novasConfig.sincronizacaoAuto,
    });

    if (result.success) {
      setConfiguracoes(novasConfig);
      Alert.alert('Sucesso', 'Configurações atualizadas!');
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar as configurações.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
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
            <TouchableOpacity 
              style={styles.tile}
              onPress={() => setModalHorariosVisivel(true)}
            >
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

          {/* Botão de Logout */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.erro,
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginHorizontal: 20,
              marginVertical: 15,
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: colors.textoInverso, fontSize: 16, fontWeight: '600' }}>
              Sair da Conta
            </Text>
          </TouchableOpacity>

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

      <HorariosModal
        visible={modalHorariosVisivel}
        onClose={() => setModalHorariosVisivel(false)}
        materias={materias.map(m => ({ id: m.id, nome: m.nome, cor: m.cor }))}
        onRefresh={carregarMaterias}
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
