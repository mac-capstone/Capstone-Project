import React from 'react';

import { useItem } from '@/api/items/use-items';
import { ActivityIndicator, Text, View } from '@/components/ui';
import { type ExpenseIdT, type ItemIdT } from '@/types';

import { PersonAvatar } from './person-avatar';

export const ItemCard = ({
  expenseId,
  itemId,
}: {
  expenseId: ExpenseIdT;
  itemId: ItemIdT;
}) => {
  const { data, isPending, isError } = useItem({
    variables: { expenseId, itemId },
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading item</Text>;
  }

  return (
    <View key={data.id} className="h-24 rounded-xl bg-background-900 px-5 py-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="font-futuraMedium text-xl dark:text-text-50">
          {data.name}
        </Text>
        <Text className="font-futuraDemi text-xl dark:text-text-50">
          ${data.amount.toFixed(2)}
        </Text>
      </View>
      <View className="flex flex-row items-center justify-start gap-2 pt-2">
        {data.assignedPersonIds.map((personId) => (
          <PersonAvatar
            key={personId}
            personId={personId}
            expenseId={expenseId}
          />
        ))}
      </View>
    </View>
  );
};
