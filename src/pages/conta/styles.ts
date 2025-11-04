import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const contaStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },

  // Card de perfil (avatar + saudação)
  profileCard: {
    backgroundColor: colors.superficie,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: colors.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.superficie,
    borderWidth: 2,
    borderColor: colors.divisor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  greetTitle: { fontSize: 18, fontWeight: '700', color: colors.textoPrimario },
  greetSubtitle: { fontSize: 14, color: colors.textoSecundario },
  rightArrow: { marginLeft: 'auto', fontSize: 16, color: colors.textoTerciario },

  // Grid de ações
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  tile: {
    width: '48%',
    backgroundColor: colors.superficie,
    borderWidth: 2,
    borderColor: colors.borda,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.sombra,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tileLabel: { marginTop: 8, color: colors.textoPrimario, fontWeight: '600' },

  // Banner UNISO
  banner: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginTop: 16,
  },
  bannerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarioClaro,
    borderWidth: 2,
    borderColor: colors.primario,
    marginRight: 10,
  },
  logoText: { color: colors.primario, fontWeight: '800' },
  bannerTitle: { color: colors.textoPrimario, fontWeight: '700' },
  bannerSub: { color: colors.textoPrimario },
  bannerText: { color: colors.textoTerciario, fontSize: 12, lineHeight: 16, marginTop: 8 }
});
