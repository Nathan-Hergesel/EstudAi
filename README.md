# ESTUDAI

_Aprimore seu aprendizado, domine o seu futuro._

[![Último Commit](https://img.shields.io/github/last-commit/Nathan-Hergesel/EstudAi?label=%C3%BAltimo%20commit)](https://github.com/Nathan-Hergesel/EstudAi/commits)
![TypeScript](https://img.shields.io/badge/typescript-94.9%25-blue)
![Linguagens](https://img.shields.io/github/languages/count/Nathan-Hergesel/EstudAi?label=linguagens)

Desenvolvido com as seguintes ferramentas e tecnologias:

![JSON](https://img.shields.io/badge/JSON-000000.svg)
![npm](https://img.shields.io/badge/npm-CB3837.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg)
![Gradle](https://img.shields.io/badge/Gradle-02303A.svg)
![React](https://img.shields.io/badge/React-20232A.svg)
![XML](https://img.shields.io/badge/XML-8A2BE2.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6.svg)
![BAT](https://img.shields.io/badge/BAT%20scripts-000000.svg)
![Expo](https://img.shields.io/badge/Expo-000020.svg)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF.svg)

---

## Índice

- [Visão Geral](#visão-geral)
  - [Instalação](#-Instalação)
    - [Uso](#-Uso)
    - [Testes](#-Testes)
  - [Contribuição](#-Contribuição)
    - [Licença](#-Licença)

---

## Visão Geral

**EstudAi** é uma estrutura (framework) mobile completa, desenvolvida com **React Native** e **Expo**, com foco em **gestão de tarefas**, **agendamento** e **engajamento do usuário**.  
O projeto adota uma **arquitetura modular**, com gerenciamento de estado centralizado, navegação fluida e design de interface coeso, ideal para o desenvolvimento de aplicativos educacionais e produtivos.

### Por que o EstudAi?

Este projeto tem como objetivo simplificar o desenvolvimento de aplicativos móveis **multiplataforma**, escaláveis e de alta produtividade.  
As principais funcionalidades incluem:

- 🎯 **Gestão de Tarefas**: Contextos e hooks centralizados para criar, atualizar e filtrar tarefas de forma eficiente.
- 🚀 🛠 **Configuração Multiplataforma**: Preparado para execução em **iOS**, **Android** e **Web**, com scripts otimizados de compilação.
- 🎨 📱 **Estilo Consistente**: Paleta de cores unificada, integração com SVG e design visual padronizado.
- 🧭 🌐 **Navegação e Fluxo**: Sistema de abas inferiores intuitivo e renderização condicional conforme a autenticação do usuário.
- 🧩 🧬 **Componentes Modulares**: Modais e componentes reutilizáveis para criação, filtragem e manipulação de tarefas em lote.

---

## 🧩 Instalação

Siga os passos abaixo para clonar e configurar o projeto localmente:

### 1. Clonar o repositório

```bash
git clone https://github.com/Nathan-Hergesel/EstudAi.git
```

### 2. Acessar o diretório do projeto

```bash
cd EstudAi
```

### 3. Instalar as dependências

#### Usando npm:

```bash
npm install
```

#### Usando Gradle (para integração com Android nativo):

```bash
gradle build
```

---

## 🚀 Uso

Para executar o projeto, utilize um dos comandos abaixo, conforme sua preferência:

### Usando npm (via Expo):

```bash
npm start
```

Esse comando iniciará o servidor de desenvolvimento do Expo, permitindo:

- Escanear o QR Code no aplicativo Expo Go (Android/iOS);
- Executar o aplicativo em um emulador ou simulador;
- Rodar diretamente no navegador via Expo Web.

### Usando Gradle (para execução nativa):

```bash
gradle run
```

💡 Observação: os comandos do Gradle podem variar conforme a configuração do seu ambiente Android.  
Por exemplo:

```bash
gradlew assembleDebug
gradlew installDebug
```

---

## 🧪 Testes

O **EstudAi** utiliza o framework **Jest** para execução de testes automatizados.  
Para rodar a suíte de testes, utilize um dos comandos abaixo:

### Usando npm:

```bash
npm test
```

### Usando Gradle:

```bash
gradle test
```

---

## 🤝 Contribuição

Contribuições, sugestões e correções são **bem-vindas**!  
Você pode participar do desenvolvimento de duas formas:

- Abrindo uma *issue* para relatar erros ou sugerir melhorias;
- Enviando um *pull request* com novas funcionalidades.

### Etapas de contribuição:

1. Faça um **fork** do projeto.
2. Crie uma nova branch:

```bash
git checkout -b feature/nova-funcionalidade
```
3. Realize as alterações desejadas e confirme o commit:

```bash
git commit -m "Adiciona nova funcionalidade"
```
4. Envie as alterações:

```bash
git push origin feature/nova-funcionalidade
```
5. Abra um **Pull Request** no repositório principal.

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT**.  
Consulte o arquivo `LICENSE` para mais informações.
