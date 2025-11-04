// Tela de Conta com o mesmo padrão visual das abas Tarefas e Agenda
import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../constants/colors';
import { contaStyles as styles } from './styles';
import { styles as tarefasStyles } from '../tarefas/styles';
import { UserIcon, CalendarIcon, EditIcon, MoreIcon, FilterIcon } from '../../assets/icons';

interface ContaScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function ContaScreen({ onNavigate }: ContaScreenProps) {
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
          <View style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <UserIcon width={28} height={28} />
            </View>
            <View>
              <Text style={styles.greetTitle}>Olá, Usuário 01</Text>
              <Text style={styles.greetSubtitle}>Seja Bem Vindo !</Text>
            </View>
            <Text style={styles.rightArrow}>›</Text>
          </View>

          {/* Grid de ações */}
          <View style={styles.grid}>
            <TouchableOpacity style={styles.tile} onPress={() => onNavigate?.('Agenda')}>
              <CalendarIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Horários</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tile}>
              <MoreIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Matérias</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tile} onPress={() => onNavigate?.('Conta')}>
              <EditIcon width={28} height={28} />
              <Text style={styles.tileLabel}>Editar Conta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tile}>
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
    </View>
  );
}
