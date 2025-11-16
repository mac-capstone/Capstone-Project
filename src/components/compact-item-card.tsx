import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useItem } from '@/api/items/use-items';
import { ActivityIndicator } from '@/components/ui';
import { type ExpenseIdT, type ItemIdT } from '@/types';

type Props = {
  itemId: ItemIdT;
  expenseId: ExpenseIdT;
  onPress?: (itemId: ItemIdT) => void;
  selected?: boolean;
};

export function CompactItemCard({
  itemId,
  expenseId,
  onPress,
  selected,
}: Props) {
  const {
    data: item,
    isPending,
    isError,
  } = useItem({
    variables: { expenseId, itemId },
  });

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (isError || !item) {
    return null;
  }

  const { name: itemName, amount: itemPrice } = item;

  return (
    <Pressable
      onPress={() => onPress?.(itemId)}
      className={`w-full flex-row items-center justify-between rounded-xl border p-6 ${
        selected
          ? 'border-accent-100 bg-accent-900'
          : 'border-transparent bg-background-900'
      }`}
    >
      <View className="flex-1 flex-row items-center justify-between">
        <Text className="font-futuraDemi text-2xl dark:text-text-50">
          {itemName}
        </Text>
        <Text className="font-futuraMedium text-2xl dark:text-text-50">
          ${itemPrice.toFixed(2)}
        </Text>
      </View>
    </Pressable>
  );
}
