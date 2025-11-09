import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { mapMockItemToItemWithId } from '@/lib/utils';
import { type ExpenseIdT, type ItemIdT, type ItemWithId } from '@/types';

export const useItems = createQuery<ItemWithId[], ExpenseIdT, Error>({
  queryKey: ['items', 'expenseId'],
  fetcher: async (variables) => {
    const expense = mockData.expenses.find((e) => e.id === variables);
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
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    const item = expense.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    return mapMockItemToItemWithId(item);
  },
});
