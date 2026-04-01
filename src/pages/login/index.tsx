import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { styles } from '@/pages/login/styles';

export const LoginPage = () => {
  const { signIn, signUp } = useAuth();
  const currentYear = new Date().getFullYear();
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    if (!email || !password || (isSignUp && !nome)) {
      Alert.alert('Campos obrigatórios', 'Preencha os campos para continuar.');
      return;
    }

    if (isSignUp && password.length < 6) {
      Alert.alert('Senha inválida', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    const result = isSignUp ? await signUp(email, password, nome) : await signIn(email, password);

    if (!result.success) {
      Alert.alert('Erro', result.error || 'Falha de autenticação.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../../img/Logo EstudAI.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>EstudAi</Text>

        <Text style={styles.title}>{isSignUp ? 'Criar sua conta' : 'Bem-vindo de volta'}</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Preencha seus dados para começar a organizar seus estudos.' : 'Acesse sua conta para continuar seus estudos.'}
        </Text>

        <View style={styles.dividerWrap}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{isSignUp ? 'CADASTRO' : 'FAÇA SEU LOGIN'}</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.form}>
          {isSignUp ? (
            <Input
              label="Nome"
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              showKeyboardPreview
            />
          ) : null}
          <Input
            label="Endereço de e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="nome@exemplo.com"
            showKeyboardPreview
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="********"
            showKeyboardPreview
          />

          {!isSignUp ? (
            <Pressable onPress={() => Alert.alert('Recuperação de senha', 'Essa função será disponibilizada em breve.') }>
              <Text style={styles.forgot}>Esqueceu a senha?</Text>
            </Pressable>
          ) : null}

          {!isSignUp ? (
            <Pressable style={styles.rememberRow} onPress={() => setRememberMe((prev) => !prev)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                {rememberMe ? <View style={styles.checkboxDot} /> : null}
              </View>
              <Text style={styles.rememberText}>Manter-me conectado</Text>
            </Pressable>
          ) : null}

          <Button title={isSignUp ? 'Criar conta' : 'Entrar'} onPress={submit} />

          <Pressable onPress={() => setIsSignUp((prev) => !prev)} style={styles.switchMode}>
            <Text style={styles.switchText}>
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem uma conta? Crie agora'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footerText}>{`© ${currentYear} EstudAi. Todos os direitos reservados.`}</Text>
    </View>
  );
};
