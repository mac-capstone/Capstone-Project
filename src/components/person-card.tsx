import { FlashList } from '@shopify/flash-list';
import React from 'react';

import { usePersonItems } from '@/api/items/use-person-items';
import { usePerson } from '@/api/people/use-people';
import { ActivityIndicator, Text, View } from '@/components/ui';
import { personShare } from '@/lib/utils';
import { type ExpenseIdT, type PersonIdT } from '@/types';

import { PersonAvatar } from './person-avatar';
export const PersonCard = ({
  personId,
  expenseId,
}: {
  personId: PersonIdT;
  expenseId: ExpenseIdT;
}) => {
  const { data, isPending, isError } = usePerson({
    variables: { expenseId, personId },
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading person</Text>;
  }
  return (
    <View className="flex min-h-20 w-full flex-col gap-2 rounded-xl bg-background-900 p-3">
      <View className="flex w-full flex-row justify-between gap-2">
        <View className="flex flex-row items-center gap-2">
          <PersonAvatar size="lg" personId={personId} expenseId={expenseId} />
          <Text className="font-futuraMedium text-xl dark:text-text-50">
            {data.name}
          </Text>
        </View>
        <Text className="font-futuraDemi text-xl dark:text-accent-100">
          ${data.subtotal.toFixed(2)}
        </Text>
      </View>
      <View className="ml-6 mt-1 border-l border-white/15 pl-4">
        <PersonItemList personId={personId} expenseId={expenseId} />
      </View>
    </View>
  );
};

export const PersonItemList = ({
  personId,
  expenseId,
}: {
  personId: PersonIdT;
  expenseId: ExpenseIdT;
}) => {
  const { data, isPending, isError } = usePersonItems({
    variables: { expenseId, personId },
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading items</Text>;
  }
  if (data.length === 0) {
    return (
      <View className="ml-6 border-l border-white/15 pl-4">
        <Text className="text-text-400">No items assigned</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col">
      <FlashList
        data={data}
        renderItem={({ item }) => {
          const share = personShare(item, personId);
          return (
            <View
              key={item.id}
              className="flex-row items-center justify-between"
            >
              <Text className="text-text-300 text-sm dark:text-text-800">
                {item.name}
              </Text>
              <Text className="text-sm font-semibold text-text-50 dark:text-text-50">
                ${share.toFixed(2)}
              </Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        // ItemSeparatorComponent={() => <View className="h-1" />} // 12px gap
      />
    </View>
  );
};
