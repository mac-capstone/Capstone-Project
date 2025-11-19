import { createQuery } from 'react-query-kit';

import { mockData } from '@/lib/mock-data';
import { getTempExpense } from '@/lib/store';
import { mapMockPersonToPerson } from '@/lib/utils';
import {
  type ExpenseIdT,
  type ItemIdT,
  type Person,
  type PersonIdT,
} from '@/types';

export const usePeopleIdsForItem = createQuery<
  PersonIdT[],
  { expenseId: ExpenseIdT; itemId: ItemIdT },
  Error
>({
  queryKey: ['people', 'expenseId', 'itemId'],
  fetcher: async ({ expenseId, itemId }) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      // Go into items, find the item with itemId, and return its assignedPersonIds
      const item = tempExpense.items.find((i) => i.id === itemId);
      if (!item) return [];
      return (
        item.assignedPersonIds ||
        (Object.keys(item.split.shares) as PersonIdT[]) ||
        []
      );
    }
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    const item = expense.items.find((i) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    return item.doc.assignedPersonIds.map((personId) => personId as PersonIdT);
  },
});

export const usePeopleIds = createQuery<PersonIdT[], ExpenseIdT, Error>({
  queryKey: ['people', 'expenseId'],
  fetcher: async (expenseId) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      return tempExpense.people.map((person) => person.id as PersonIdT);
    }
    const expense = mockData.expenses.find((e) => e.id === expenseId);
    if (!expense) throw new Error('Expense not found');
    return expense.people.map((person) => person.id as PersonIdT);
  },
});

export const usePerson = createQuery<
  Person,
  { expenseId: ExpenseIdT; personId: PersonIdT },
  Error
>({
  queryKey: ['people', 'expenseId', 'personId'],
  fetcher: async ({ expenseId, personId }) => {
    if (expenseId === 'temp-expense') {
      const tempExpense = getTempExpense();
      if (!tempExpense) throw new Error('Temp expense not found');
      // calculate subtotal this person
      const subtotal = tempExpense.items.reduce((acc, item) => {
        if (item.assignedPersonIds.includes(personId)) {
          return acc + item.split.shares[personId];
        } else {
          return acc;
        }
      }, 0);
      const person = tempExpense.people.find(
        (person) => person.id === personId
      );
      if (!person) throw new Error('Person not found');
      return {
        ...person,
        subtotal,
      };
    }
    const expense = mockData.expenses.find(
      (expense) => expense.id === expenseId
    );
    if (!expense) throw new Error('Expense not found');
    const person = expense.people.find((person) => person.id === personId);
    if (!person) throw new Error('Person not found');
    return mapMockPersonToPerson(person);
  },
});
