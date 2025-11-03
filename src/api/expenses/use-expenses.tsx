import { createQuery } from 'react-query-kit';

import { type Expense, type ExpenseIdT } from '@/types';

const mockExpenses: Expense[] = [
  {
    id: '1' as ExpenseIdT,
    name: 'Boston Pizza',
    totalAmount: 64.23,
    date: '2025-10-20',
    remainingAmount: 23.45,
  },
  {
    id: '2' as ExpenseIdT,
    name: 'Hai Di Lao',
    totalAmount: 250.1,
    date: '2024-10-30',
    remainingAmount: 100.39,
  },
  {
    id: '3' as ExpenseIdT,
    name: "Wendy's",
    totalAmount: 30.15,
    date: '2025-10-30',
    remainingAmount: 24.39,
  },
];

type AllExpensesResponse = Expense[];
type AllExpensesVariables = void;
export const useExpenses = createQuery<
  AllExpensesResponse,
  AllExpensesVariables,
  Error
>({
  queryKey: ['expenses'],
  fetcher: () => {
    return mockExpenses;
  },
});

type ExpenseResponse = Expense;
type ExpenseVariables = { id: ExpenseIdT };
export const useExpense = createQuery<ExpenseResponse, ExpenseVariables, Error>(
  {
    queryKey: ['expenses', 'id'],
    fetcher: async (variables) => {
      const expense = mockExpenses.find((e) => e.id === variables.id);
      if (!expense) throw new Error('Expense not found');
      return expense;
    },
  }
);
