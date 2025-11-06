import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { mapMockExpenseToExpenseWithId } from '@/lib/utils';
import { type Expense, type ExpenseIdT, type ExpenseWithId } from '@/types';

type AllExpensesResponse = ExpenseWithId[];
type AllExpensesVariables = void;
export const useExpenses = createQuery<
  AllExpensesResponse,
  AllExpensesVariables,
  Error
>({
  queryKey: ['expenses'],
  fetcher: () => {
    return mockData.expenses.map(mapMockExpenseToExpenseWithId);
  },
});

type ExpenseResponse = Expense;
type ExpenseVariables = { id: ExpenseIdT };
export const useExpense = createQuery<ExpenseResponse, ExpenseVariables, Error>(
  {
    queryKey: ['expenses', 'id'],
    fetcher: async (variables) => {
      const expense = mockData.expenses.find((e) => e.id === variables.id);
      if (!expense) throw new Error('Expense not found');
      return expense.doc as Expense;
    },
  }
);
