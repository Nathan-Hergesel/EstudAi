// Tipagens compartilhadas entre telas e provider
export interface Task {
  id: number;
  type: 'ATIVIDADE' | 'TRABALHO' | 'PROVA';
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  title: string;
  description: string;
  date: string; // formato: dd/MM/yyyy HH:mm
  completed?: boolean;
}

export interface FilterOptions {
  period: string;
  type: string;
  difficulty: string;
  status: string;
}

// As implementações de store e hook estão em src/hooks/useTarefas.tsx
export {}; 
