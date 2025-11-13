import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { type ItemWithId } from '@/types';

type Props = {
  item: ItemWithId;
  onPress?: (item: ItemWithId) => void;
  selected?: boolean;
};

export function CompactItemCard({ item, onPress, selected }: Props) {
  const { name: itemName, amount: itemPrice } = item;

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      className={`w-full flex-row items-center justify-between rounded-xl border p-6 ${
        selected
          ? 'border-accent-100 bg-accent-800'
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
