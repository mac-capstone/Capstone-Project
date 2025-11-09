import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { mapMockPersonToPersonWithId } from '@/lib/utils';
import { type ExpenseIdT, type PersonIdT, type PersonWithId } from '@/types';

export const usePeople = createQuery<PersonWithId[], ExpenseIdT, Error>({
  queryKey: ['people', 'expenseId'],
  fetcher: async (expenseId) => {
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    return expense.people.map(mapMockPersonToPersonWithId);
  },
});

export const usePeopleIds = createQuery<PersonIdT[], ExpenseIdT, Error>({
  queryKey: ['people', 'expenseId', 'personIds'],
  fetcher: async (expenseId) => {
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    return expense.people.map((person) => person.id as PersonIdT);
  },
});
