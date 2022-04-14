import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from './services/api';

interface Transaction {
  id: number;
  title: string;
  type: string;
  category: string;
  amount: number;
  createdAt: string;
}

// maneiras de declarar uma nova transação sem os atributos que são criados automáticos
// pode ser uma nova interface
// interface TransactionInput {
//   title: string;
//   type: string;
//   category: string;
//   amount: number;
// }
// pode ser pelo Omit que omite os atributos x, y e z de um tipo que já existe
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;
// pode ser pelo Pick que seleciona os atributos a, b e c de um tipo que já existe
// type TransactionInput = Pick<Transaction, 'title' | 'type' | 'category' | 'amount'>;

interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => void;
}

export const TransactionsContext = createContext<TransactionContextData>(
  {} as TransactionContextData
);

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api
      .get('transactions')
      .then(response => setTransactions(response.data.transactions));
  }, []);

  function createTransaction(transaction: TransactionInput) {
    api.post('/transaction', transaction);
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}
