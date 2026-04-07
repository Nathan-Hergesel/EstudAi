import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { Manrope_700Bold } from '@expo-google-fonts/manrope';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigation } from '@/components/BottomNavigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { KeyboardPreviewProvider } from '@/contexts/KeyboardPreviewContext';
import { TasksProvider } from '@/hooks/TasksContext';
import { AgendaPage } from '@/pages/agenda/index';
import { ChatIAPage } from '@/pages/chat-ia/index';
import { ContaPage } from '@/pages/conta/index';
import { GruposPage } from '@/pages/grupos';
import { LoginPage } from '@/pages/login/index';
import { TarefasPage } from '@/pages/tarefas/index';
import { colors } from '@/constants/tokens';

type Screen = 'Agenda' | 'Tarefas' | 'Grupos' | 'ChatIA' | 'Conta';

const MainApp = () => {
  const { user, loading } = useAuth();
  const isWeb = Platform.OS === 'web';
  const [currentScreen, setCurrentScreen] = useState<Screen>('Tarefas');
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const transitionTranslate = useRef(new Animated.Value(0)).current;
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    transitionOpacity.setValue(0);
    transitionTranslate.setValue(16);

    Animated.parallel([
      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      }),
      Animated.timing(transitionTranslate, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start();
  }, [currentScreen, transitionOpacity, transitionTranslate]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.safeArea, isWeb && styles.webWidthLimiter]}
        edges={['left', 'right', 'bottom']}
      >
        <LoginPage />
      </SafeAreaView>
    );
  }

  return (
    <TasksProvider>
      <View style={styles.app}>
        <LinearGradient colors={['#F7F9FB', '#FFFFFF']} style={StyleSheet.absoluteFill} />

        <SafeAreaView
          style={[styles.safeArea, isWeb && styles.webWidthLimiter]}
          edges={['top', 'left', 'right']}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: transitionOpacity,
                transform: [{ translateX: transitionTranslate }]
              }
            ]}
          >
            {currentScreen === 'Agenda' ? (
              <AgendaPage onGoTasks={() => setCurrentScreen('Tarefas')} />
            ) : null}
            {currentScreen === 'Tarefas' ? <TarefasPage /> : null}
            {currentScreen === 'Grupos' ? <GruposPage /> : null}
            {currentScreen === 'ChatIA' ? <ChatIAPage /> : null}
            {currentScreen === 'Conta' ? <ContaPage /> : null}
          </Animated.View>

          <SafeAreaView style={styles.bottomNavArea} edges={['bottom']}>
            <BottomNavigation currentScreen={currentScreen} onNavigate={setCurrentScreen} />
          </SafeAreaView>
        </SafeAreaView>
      </View>
    </TasksProvider>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_700Bold
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <KeyboardPreviewProvider>
          <StatusBar style="dark" backgroundColor={colors.surface} translucent={false} />
          <MainApp />
        </KeyboardPreviewProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.surfaceLowest
  },
  safeArea: {
    flex: 1
  },
  webWidthLimiter: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center'
  },
  content: {
    flex: 1
  },
  bottomNavArea: {
    backgroundColor: '#FFFFFF'
  },
  loader: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
