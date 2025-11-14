import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { getTempExpense } from '@/lib/store';
import {
  type Expense,
  type ExpenseIdT,
  type ItemWithId,
  type PersonWithId,
} from '@/types';

type AllExpensesResponse = ExpenseIdT[];
type AllExpensesVariables = void;
export const useExpensIds = createQuery<
  AllExpensesResponse,
  AllExpensesVariables,
  Error
>({
  queryKey: ['expenses'],
  fetcher: () => {
    return mockData.expenses.map((e) => e.id as ExpenseIdT);
  },
});

type ExpenseResponse = Expense & {
  id?: ExpenseIdT;
  items?: ItemWithId[];
  people?: PersonWithId[];
};
export const useExpense = createQuery<ExpenseResponse, ExpenseIdT, Error>({
  queryKey: ['expenses', 'expenseId'],
  fetcher: async (expenseId) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      return tempExpense as ExpenseResponse;
    }
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    return expense.doc as Expense;
  },
});
