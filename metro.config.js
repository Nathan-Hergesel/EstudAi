
// Metro config usando preset do Expo e suporte a SVG via react-native-svg-transformer
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').ConfigT} */
const config = getDefaultConfig(__dirname);

// Habilita o transformer para arquivos .svg
config.transformer = config.transformer || {};
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Ajusta extensões: trata SVG como código-fonte (para importar como componente)
config.resolver = config.resolver || {};
const assetExts = config.resolver.assetExts || [];
const sourceExts = config.resolver.sourceExts || [];

config.resolver.assetExts = assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = sourceExts.includes('svg')
  ? sourceExts
  : [...sourceExts, 'svg'];

module.exports = config;
