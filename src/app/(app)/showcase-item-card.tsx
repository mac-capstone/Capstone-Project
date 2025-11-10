import React from 'react';
import { View } from 'react-native';

import { ItemCardDetailedCustom } from '@/components/item-card-detailed-custom';
import { mockData } from '@/lib/mock-data';
import {
  mapMockItemToItemWithId,
  mapMockPersonToPersonWithId,
} from '@/lib/utils';
import { type ExpenseIdT } from '@/types';

export default function ShowcaseItemCard() {
  // Using the first item from the first expense in mockData
  const expense = mockData.expenses[0];
  const item = expense.items[0];
  const people = expense.people;

  const mappedItem = mapMockItemToItemWithId(item);
  const mappedPeople = people.map(mapMockPersonToPersonWithId);

  return (
    <View className="flex items-center justify-center">
      <ItemCardDetailedCustom
        item={mappedItem}
        people={mappedPeople}
        expenseId={expense.id as ExpenseIdT}
      />
    </View>
  );
}
