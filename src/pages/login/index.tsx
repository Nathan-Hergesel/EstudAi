import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import globalStyles from '../../global/styles';
import { colors } from '../../constants/colors';
import { loginStyles } from './styles';
import { UserIcon } from '../../assets/icons';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha e-mail e senha para continuar.');
      return;
    }

    const result = await signIn(email, password);
    if (!result.success) {
      Alert.alert('Erro ao entrar', result.error || 'Tente novamente mais tarde.');
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !nome.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Senha fraca', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const result = await signUp(email, password, nome);
    if (result.success) {
      Alert.alert(
        'Conta criada!',
        'Sua conta foi criada com sucesso. Faça login para continuar.',
        [{ text: 'OK', onPress: () => setIsSignUp(false) }]
      );
    } else {
      Alert.alert('Erro ao criar conta', result.error || 'Tente novamente mais tarde.');
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
            <Text style={loginStyles.headingWelcome}>
              {isSignUp ? 'Crie sua Conta !' : 'Seja Bem Vindo !'}
            </Text>

            {/* Campo Nome (apenas no cadastro) */}
            {isSignUp && (
              <>
                <Text style={loginStyles.fieldLabel}>Nome Completo</Text>
                <TextInput
                  style={loginStyles.inputPill}
                  placeholder="Seu nome completo"
                  placeholderTextColor={colors.textoTerciario}
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </>
            )}

            {/* Campos */}
            <Text style={loginStyles.fieldLabel}>Email</Text>
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
                onSubmitEditing={isSignUp ? handleSignUp : handleLogin}
              />
              <TouchableOpacity
                style={[loginStyles.enterButton, { opacity: loading ? 0.7 : 1 }]}
                onPress={isSignUp ? handleSignUp : handleLogin}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={isSignUp ? 'Criar Conta' : 'Entrar'}
              >
                <Text style={loginStyles.enterText}>
                  {loading ? 'Aguarde…' : isSignUp ? 'CRIAR →' : 'ENTRAR →'}
                </Text>
              </TouchableOpacity>
            </View>

            {!isSignUp && (
              <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade em desenvolvimento.')}>
                <Text style={loginStyles.forgotLink}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            )}

            {/* Divisor */}
            <View style={loginStyles.divider} />

            {/* Cadastro/Login */}
            <View style={loginStyles.signupRow}>
              <Text style={loginStyles.signupText}>
                {isSignUp ? 'Já tem uma conta?' : 'Novo na plataforma?'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setNome('');
                  setEmail('');
                  setPassword('');
                }} 
                style={loginStyles.signupButton}
              >
                <Text style={loginStyles.signupButtonText}>
                  {isSignUp ? 'Faça Login' : 'Crie Sua Conta'}
                </Text>
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
