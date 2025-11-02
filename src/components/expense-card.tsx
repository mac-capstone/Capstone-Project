import { useRouter } from 'expo-router';
import React from 'react';

import { Pressable, ProgressBar, Text, View } from '@/components/ui';
import { type Expense } from '@/types';

export const ExpenseCard = ({
  id,
  name,
  totalAmount,
  date,
  remainingAmount,
  hasProgress = false,
}: Expense & { hasProgress?: boolean }) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const router = useRouter();
  return (
    <Pressable
      className="flex-1"
      onPress={() => {
        router.push(`/expense/${id}`);
      }}
    >
      <View className="min-h-40 rounded-xl bg-background-900">
        <View className="flex flex-col justify-between gap-1 px-5 py-6">
          <View className="flex flex-row justify-between">
            <Text className="font-futuraBold text-xl text-text-50 dark:text-text-50">
              {name}
            </Text>
            <Text className="text-sm font-semibold dark:text-text-800">
              {formattedDate}
            </Text>
          </View>
          <View className="flex flex-row items-baseline gap-1 pt-1">
            <Text className="font-futuraBold text-xl dark:text-accent-100">
              ${remainingAmount.toFixed(2)}
            </Text>
            <Text className="text-sm font-medium text-text-800 dark:text-text-800">
              Remaining
            </Text>
          </View>
          <View className="flex flex-row items-center gap-1 pb-2">
            <Text className="text-sm font-medium text-text-800 dark:text-text-800">
              ${totalAmount.toFixed(2)}
            </Text>
            <Text className="text-sm font-medium text-text-800 dark:text-text-800">
              Total
            </Text>
          </View>
          {hasProgress && (
            <ProgressBar
              className=""
              initialProgress={
                ((totalAmount - remainingAmount) / totalAmount) * 100
              }
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};
