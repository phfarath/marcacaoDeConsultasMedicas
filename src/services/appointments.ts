import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipo para representar uma consulta
export type Consulta = {
  id: string; // UUID ou timestamp para identificar
  especialidade: string;
  medico: string;
  data: string;  // Ex: '2025-03-28'
  hora: string;  // Ex: '14:00'
};

// Chave usada no AsyncStorage
const CONSULTAS_KEY = '@consultas_agendadas';

// Salva uma nova consulta
export const salvarConsulta = async (novaConsulta: Consulta): Promise<void> => {
  try {
    const dados = await AsyncStorage.getItem(CONSULTAS_KEY);
    const consultas: Consulta[] = dados ? JSON.parse(dados) : [];

    const atualizadas = [...consultas, novaConsulta];
    await AsyncStorage.setItem(CONSULTAS_KEY, JSON.stringify(atualizadas));
  } catch (error) {
    console.error('Erro ao salvar consulta:', error);
  }
};

// Busca todas as consultas agendadas
export const listarConsultas = async (): Promise<Consulta[]> => {
  try {
    const dados = await AsyncStorage.getItem(CONSULTAS_KEY);
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao listar consultas:', error);
    return [];
  }
};

// Remove uma consulta por ID
export const removerConsulta = async (id: string): Promise<void> => {
  try {
    const dados = await AsyncStorage.getItem(CONSULTAS_KEY);
    const consultas: Consulta[] = dados ? JSON.parse(dados) : [];

    const atualizadas = consultas.filter(consulta => consulta.id !== id);
    await AsyncStorage.setItem(CONSULTAS_KEY, JSON.stringify(atualizadas));
  } catch (error) {
    console.error('Erro ao remover consulta:', error);
  }
};

// (Opcional) Limpar tudo — útil para testes
export const limparTodasConsultas = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CONSULTAS_KEY);
  } catch (error) {
    console.error('Erro ao limpar consultas:', error);
  }
};