import { createQuery } from 'react-query-kit';

import { mapMockItemToItemWithId } from '@/lib';
import { mockData } from '@/lib/mock-data';
import { type ExpenseIdT, type ItemWithId, type PersonIdT } from '@/types';

export const usePersonItems = createQuery<
  ItemWithId[],
  { expenseId: ExpenseIdT; personId: PersonIdT },
  Error
>({
  queryKey: ['items', 'personId'],
  fetcher: async ({ expenseId, personId }) => {
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    // go into items, find every item.assignedPersonIds that includes the personId, and return the items
    return expense.items
      .filter((item) => item.doc.assignedPersonIds.includes(personId))
      .map(mapMockItemToItemWithId);
  },
});
