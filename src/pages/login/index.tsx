import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import globalStyles from '../../global/styles';
import { colors } from '../../constants/colors';
import { loginStyles } from './styles';
import { UserIcon } from '../../assets/icons';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      // Simulação de autenticação (placeholder)
      await new Promise((res) => setTimeout(res, 500));
      onLoginSuccess?.();
    } catch (e) {
      Alert.alert('Erro ao entrar', 'Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={loginStyles.headerBar}>
          <Text style={loginStyles.headerTitle}>EstudAI</Text>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={loginStyles.content}>
            {/* Avatar */}
            <View style={loginStyles.avatarCircle}>
              {/* Ícone de usuário */}
              <UserIcon width={64} height={64} fill={colors.textoSecundario} />
            </View>

            {/* Títulos */}
            <Text style={loginStyles.headingHello}>Olá,</Text>
            <Text style={loginStyles.headingWelcome}>Seja Bem Vindo !</Text>

            {/* Campos */}
            <Text style={loginStyles.fieldLabel}>Email ou Usuário</Text>
            <TextInput
              style={loginStyles.inputPill}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textoTerciario}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <Text style={loginStyles.fieldLabel}>Senha</Text>
            <View style={loginStyles.passwordRow}>
              <TextInput
                style={[loginStyles.inputPill, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textoTerciario}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="go"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity
                style={[loginStyles.enterButton, { opacity: loading ? 0.7 : 1 }]}
                onPress={handleLogin}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Entrar"
              >
                <Text style={loginStyles.enterText}>{loading ? 'Entrando…' : 'ENTRAR →'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Fluxo a definir.')}>
              <Text style={loginStyles.forgotLink}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            {/* Divisor */}
            <View style={loginStyles.divider} />

            {/* Cadastro */}
            <View style={loginStyles.signupRow}>
              <Text style={loginStyles.signupText}>Novo na plataforma ?</Text>
              <TouchableOpacity onPress={() => Alert.alert('Criar conta', 'Fluxo a definir.')} style={loginStyles.signupButton}>
                <Text style={loginStyles.signupButtonText}>Crie Sua Conta</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rodapé */}
          <View style={loginStyles.footer}>
            <Text style={loginStyles.footerText}>
              © 2025 EstudAI • Todos os direitos reservados.{"\n"}
              Este aplicativo e seu conteúdo são protegidos por leis de direitos autorais.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
