import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { ExpenseCard } from '@/components/expense-card';
import { EmptyList, View } from '@/components/ui';
import { type Expense } from '@/types';

export default function Feed() {
  const expenses: Expense[] = [
    {
      id: '1',
      name: 'Boston Pizza',
      totalAmount: 64.23,
      date: '2025-10-20',
      remainingAmount: 23.45,
    },
    {
      id: '2',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 100.39,
    },
    {
      id: '3',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 100.39,
    },
    {
      id: '4',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 100.39,
    },
    {
      id: '5',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 100.39,
    },
    {
      id: '6',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 0,
    },
    {
      id: '7',
      name: 'Hai Di Lao',
      totalAmount: 250.1,
      date: '2025-10-30',
      remainingAmount: 100.39,
    },
  ];

  return (
    <View className="flex-1">
      <FlashList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard key={item.id} {...item} />}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={false} />}
      />
    </View>
  );
}
