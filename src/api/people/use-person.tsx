import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { mapMockPersonToPerson } from '@/lib/utils';
import { type ExpenseIdT, type Person, type PersonIdT } from '@/types';

export const usePerson = createQuery<
  Person,
  { expenseId: ExpenseIdT; personId: PersonIdT },
  Error
>({
  queryKey: ['people', 'personId'],
  fetcher: async ({ expenseId, personId }) => {
    const expense = mockData.expenses.find(
      (expense) => expense.id === expenseId
    );
    if (!expense) throw new Error('Expense not found');
    const person = expense.people.find((person) => person.id === personId);
    if (!person) throw new Error('Person not found');
    return mapMockPersonToPerson(person);
  },
});
