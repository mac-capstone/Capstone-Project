import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { useExpenses } from '@/api/expenses/use-expenses';
import { DottedAddButton } from '@/components/dotted-add-button';
import { ExpenseCard } from '@/components/expense-card';
import { ActivityIndicator, Text, View } from '@/components/ui';

export default function Feed() {
  const { data, isPending, isError } = useExpenses();
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Text>Error loading expenses</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 px-3">
      <FlashList
        data={data}
        renderItem={({ item }) => <ExpenseCard {...item} hasProgress={true} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <DottedAddButton text="Add new expense" path="/expense/add-expense" />
        }
        ListFooterComponent={
          <View className="mt-5">
            <DottedAddButton
              text="Add new expense"
              path="/expense/add-expense"
            />
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-5" />} // 12px gap
      />
    </View>
  );
}
