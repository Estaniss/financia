import { useCallback, useState } from 'react';

const STORAGE_KEY = 'financia:simulation-history';

export interface InsightData {
  feasibility: { status: 'viable' | 'needs_adjustment' | 'unfeasible'; content: string };
  diagnosis: { content: string };
  suggestions: { items: string[] };
  extraIncome: { items: string[] };
  investment: { items: string[] };
  motivation: { content: string };
}

export interface SimulationRecord {
  id: string;
  createdAt: string;
  renda: number;
  custosFixos: number;
  parcelas: number;
  objetivo: string;
  custoObjetivo: number;
  insight?: InsightData;
}

type NewSimulation = Omit<SimulationRecord, 'id' | 'createdAt' | 'insight'>;

function readFromStorage(): SimulationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao ler histórico de simulações:', error);
    return [];
  }
}

function writeToStorage(history: SimulationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Erro ao salvar histórico de simulações:', error);
  }
}

export function useSimulationHistory() {
  const [history, setHistory] = useState<SimulationRecord[]>(() => readFromStorage());

  const addSimulation = useCallback((simulation: NewSimulation) => {
    const newRecord: SimulationRecord = {
      ...simulation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setHistory((prev) => {
      const updated = [newRecord, ...prev];
      writeToStorage(updated);
      return updated;
    });

    return newRecord;
  }, []);

  const getSimulationById = useCallback(
    (id: string) => history.find((item) => item.id === id),
    [history],
  );

  const updateSimulation = useCallback((id: string, patch: Partial<SimulationRecord>) => {
    setHistory((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...patch } : item));
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const removeSimulation = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    writeToStorage([]);
  }, []);

  return {
    history,
    addSimulation,
    getSimulationById,
    updateSimulation,
    removeSimulation,
    clearHistory,
  };
}
