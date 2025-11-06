// App principal com navegação simples por estado
// Renderiza uma das três telas: Tarefas, Agenda ou Conta
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TarefasScreen from './src/pages/tarefas';
import AgendaScreen from './src/pages/agenda';
import ContaScreen from './src/pages/conta';
import BottomNavigation from './src/components/Navegação-Inferior';
import { colors } from './src/constants/colors';
import LoginScreen from './src/pages/login';
import { TasksProvider } from './src/hooks/TasksContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState('Tarefas');
  const { user, loading } = useAuth();

  // Retorna o componente da tela atual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'Tarefas':
        return <TarefasScreen />;
      case 'Agenda':
        return <AgendaScreen onNavigate={setCurrentScreen} />;
      case 'Conta':
        return <ContaScreen onNavigate={setCurrentScreen} />;
      default:
        return <TarefasScreen />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primario} />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={colors.fundo} />
        <View style={styles.content}>
          <LoginScreen />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TasksProvider>
      <SafeAreaView style={styles.container}>
        {/* StatusBar com tema claro e fundo alinhado ao app */}
        <StatusBar style="dark" backgroundColor={colors.fundo} />
        <View style={styles.content}>{renderScreen()}</View>
        {/* Navegação inferior controlada por estado local */}
        <BottomNavigation activeTab={currentScreen} onNavigate={setCurrentScreen} />
      </SafeAreaView>
    </TasksProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  backgroundColor: colors.fundo,
  },
  content: {
    flex: 1,
  },
});
