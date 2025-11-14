import { createQuery } from 'react-query-kit';

import { getTempExpenseState } from '@/lib/store';
import { type ExpenseIdT, type Person, type PersonIdT } from '@/types';

export const usePerson = createQuery<
  Person,
  { expenseId: ExpenseIdT; personId: PersonIdT },
  Error
>({
  queryKey: ['people', 'personId'],
  fetcher: async ({ personId }) => {
    const tempExpense = getTempExpenseState();
    if (!tempExpense) throw new Error('Expense not found in store');

    const person = tempExpense.people.find((person) => person.id === personId);
    if (!person) throw new Error('Person not found');

    return person;
  },
});
