import { StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const agendaStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.fundo },
  topBar: {
    flexDirection: 'row',
    backgroundColor: colors.superficieSecundaria,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.borda,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  topButtonText: { color: colors.textoPrimario, fontWeight: '600' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  monthTitle: { fontSize: 18, fontWeight: '700', color: colors.textoPrimario },
  monthNavBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  monthNavText: { color: colors.textoPrimario, fontWeight: '600' },

  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  weekHeaderText: { width: 28, textAlign: 'center', color: colors.textoSecundario, fontWeight: '600' },

  calendarBox: {
    backgroundColor: colors.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borda,
    padding: 12,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCell: {
    width: '13.5%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    borderRadius: 8,
  },
  dayNumber: { color: colors.textoPrimario, fontWeight: '600' },
  dayMuted: { opacity: 0.4 },
  daySelected: { borderWidth: 2, borderColor: colors.primario },

  dayDotsRow: { flexDirection: 'row', gap: 3, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  studyTimeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 6 },
  studyLabel: { fontSize: 16, fontWeight: '700', color: colors.textoPrimario },
  studyValue: { fontSize: 16, fontWeight: '800', color: colors.textoPrimario, marginLeft: 6 },

  sectionSubtle: { color: colors.textoTerciario, marginBottom: 8 },

  card: {
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borda,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, marginRight: 6 },
  pillText: { color: colors.textoInverso, fontWeight: '700', fontSize: 12 },
  pillDiff: { backgroundColor: colors.dificil },
  pillWork: { backgroundColor: colors.trabalho },
  pillActivity: { backgroundColor: colors.atividade },
  pillExam: { backgroundColor: colors.prova },

  cardRight: { marginLeft: 'auto' },
  timeRange: { color: colors.textoPrimario, fontWeight: '600' },
  tinyText: { color: colors.textoTerciario, fontSize: 10 },
  cardTitle: { color: colors.textoPrimario, fontWeight: '600' },
});
