import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mockData } from '@/lib/mock-data';
import { type ExpenseIdT, type ItemIdT, type PersonIdT } from '@/types';

type UpdateItemSharesPayload = {
  expenseId: ExpenseIdT;
  itemId: ItemIdT;
  personId: PersonIdT;
  newShare: number;
};

export const useUpdateItemShares = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      expenseId,
      itemId,
      personId,
      newShare,
    }: UpdateItemSharesPayload) => {
      // Find the expense
      const expense = mockData.expenses.find((e) => e.id === expenseId);
      if (!expense) {
        throw new Error('Expense not found');
      }

      // Find the item
      const item = expense.items.find((i) => i.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      // Update the share
      (item.doc.split.shares as Record<PersonIdT, number>)[personId] = newShare;

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 200));

      return item;
    },
    onSuccess: (_, { expenseId }) => {
      // Invalidate queries to refetch data
      return queryClient.invalidateQueries({ queryKey: ['items', expenseId] });
    },
  });
};
