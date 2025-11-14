import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { getTempExpense } from '@/lib/store';
import { mapMockItemToItemWithId } from '@/lib/utils';
import { type ExpenseIdT, type ItemIdT, type ItemWithId } from '@/types';

export const useItems = createQuery<ItemWithId[], ExpenseIdT, Error>({
  queryKey: ['items', 'expenseId'],
  fetcher: async (expenseId) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      return tempExpense.items;
    }
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    return expense.items.map(mapMockItemToItemWithId);
  },
});

export const useItem = createQuery<
  ItemWithId,
  { expenseId: ExpenseIdT; itemId: ItemIdT },
  Error
>({
  queryKey: ['items', 'expenseId', 'itemId'],
  fetcher: async ({ expenseId, itemId }) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      const item = tempExpense.items.find((i) => i.id === itemId);
      if (!item) throw new Error('Item not found');
      return item;
    }
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    const item = expense.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    return mapMockItemToItemWithId(item);
  },
});
