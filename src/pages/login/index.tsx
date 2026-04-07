import React, { useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { styles } from '@/pages/login/styles';

export const LoginPage = () => {
  const { signIn, signUp, requestPasswordReset } = useAuth();
  const currentYear = new Date().getFullYear();
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!email || !password || (isSignUp && !nome)) {
      setFeedback({
        tone: 'error',
        title: 'Campos obrigatórios',
        message: 'Preencha todos os campos para continuar.'
      });
      return;
    }

    if (isSignUp && password.length < 6) {
      setFeedback({
        tone: 'error',
        title: 'Senha inválida',
        message: 'A senha precisa ter pelo menos 6 caracteres.'
      });
      return;
    }

    setFeedback(null);

    const result = isSignUp
      ? await signUp(normalizedEmail, password, nome.trim())
      : await signIn(normalizedEmail, password, rememberMe);

    if (!result.success) {
      setFeedback({
        tone: 'error',
        title: 'Não foi possível continuar',
        message: result.error || 'Falha de autenticação.'
      });
      return;
    }

    if (isSignUp) {
      setFeedback({
        tone: 'success',
        title: 'Conta criada com sucesso',
        message: 'Enviamos um e-mail de confirmação. Verifique sua caixa de entrada e o spam.'
      });
      setPassword('');
    }
  };

  const submitPasswordReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setFeedback({
        tone: 'error',
        title: 'Informe seu e-mail',
        message: 'Digite o e-mail da sua conta para enviar o link de redefinição.'
      });
      return;
    }

    setFeedback({
      tone: 'info',
      title: 'Enviando solicitação',
      message: 'Aguarde enquanto preparamos seu e-mail de redefinição de senha.'
    });

    const result = await requestPasswordReset(normalizedEmail);

    if (!result.success) {
      setFeedback({
        tone: 'error',
        title: 'Falha ao enviar e-mail',
        message: result.error || 'Não foi possível iniciar a redefinição de senha agora.'
      });
      return;
    }

    setFeedback({
      tone: 'success',
      title: 'Verifique seu e-mail',
      message: 'Se o e-mail existir na base, você receberá um link para redefinir a senha.'
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />

      <View pointerEvents="none" style={styles.waveTopArea}>
        <Svg width="300%" height="120%" viewBox="0 0 1200 320" preserveAspectRatio="none" style={styles.waveSvg}>
          <Defs>
            <SvgLinearGradient id="waveGradientMain" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#346acf" stopOpacity="0.95" />
              <Stop offset="100%" stopColor="#0077ff" stopOpacity="0.9" />
            </SvgLinearGradient>
            <SvgLinearGradient id="waveGradientSoft" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#f1f1f1" stopOpacity="0.88" />
              <Stop offset="100%" stopColor="#cad2dd" stopOpacity="0.82" />
            </SvgLinearGradient>
          </Defs>

          <Path
            d="M0,126 C146,194 286,40 452,90 C618,144 742,254 910,222 C1038,198 1132,108 1200,126 L1200,0 L0,0 Z"
            fill="url(#waveGradientMain)"
          />
          <Path
            d="M0,186 C176,232 304,130 456,150 C624,174 740,292 914,272 C1050,258 1138,188 1200,202 L1200,0 L0,0 Z"
            fill="url(#waveGradientSoft)"
          />
        </Svg>
      </View>

      <View style={styles.card}>
        <Image source={require('../../img/Logo EstudAI.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brand}>EstudAí</Text>

        <Text style={styles.title}>{isSignUp ? 'Criar sua conta' : 'Bem-Vindo'}</Text>
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
            showPasswordToggle
            placeholder="********"
            showKeyboardPreview
          />

          {!isSignUp ? (
            <Pressable onPress={() => void submitPasswordReset()}>
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

          <Pressable
            onPress={() => {
              setIsSignUp((prev) => !prev);
              setFeedback(null);
            }}
            style={styles.switchMode}
          >
            <Text style={styles.switchText}>
              {isSignUp ? 'Já tem uma conta? ' : 'Não tem uma conta? '}
              <Text style={styles.switchHighlight}>{isSignUp ? 'Entrar' : 'Crie agora'}</Text>
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={!!feedback}
        transparent
        animationType="fade"
        onRequestClose={() => setFeedback(null)}
      >
        <Pressable style={styles.feedbackOverlay} onPress={() => setFeedback(null)}>
          {feedback ? (
            <Pressable
              style={[
                styles.feedbackPopup,
                feedback.tone === 'success'
                  ? styles.feedbackPopupSuccess
                  : feedback.tone === 'error'
                    ? styles.feedbackPopupError
                    : styles.feedbackPopupInfo
              ]}
              onPress={() => undefined}
            >
              <Text style={styles.feedbackTitle}>{feedback.title}</Text>
              <Text style={styles.feedbackMessage}>{feedback.message}</Text>

              <Pressable style={styles.feedbackCloseButton} onPress={() => setFeedback(null)}>
                <Text style={styles.feedbackCloseText}>Entendi</Text>
              </Pressable>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>

      <Text style={styles.footerText}>{`© ${currentYear} EstudAí. Todos os direitos reservados.`}</Text>
    </View>
  );
};
