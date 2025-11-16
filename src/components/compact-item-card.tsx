import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useExpense } from '@/api/expenses/use-expenses';
import { useItem } from '@/api/items/use-items';
import { usePeopleIdsForItem } from '@/api/people/use-people';
import { ActivityIndicator } from '@/components/ui';
import { type ExpenseIdT, type ItemIdT, type PersonWithId } from '@/types';

import { PersonAvatar } from './person-avatar';

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
    isPending: isItemPending,
    isError: isItemError,
  } = useItem({
    variables: { expenseId, itemId },
  });

  const {
    data: assignedPersonIds,
    isPending: isAssignedIdsPending,
    isError: isAssignedIdsError,
  } = usePeopleIdsForItem({
    variables: { expenseId, itemId },
  });

  const {
    data: expense,
    isPending: isExpensePending,
    isError: isExpenseError,
  } = useExpense({
    variables: expenseId,
  });

  const isPending = isItemPending || isAssignedIdsPending || isExpensePending;
  const isError = isItemError || isAssignedIdsError || isExpenseError;

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (isError || !item || !expense) {
    return null;
  }

  const { name: itemName, amount: itemPrice } = item;
  const people = expense.people;

  const assignedPeople =
    people?.filter((p: PersonWithId) =>
      (assignedPersonIds ?? []).includes(p.id)
    ) ?? [];

  return (
    <Pressable
      onPress={() => onPress?.(itemId)}
      className={`w-full flex-row items-center justify-between rounded-xl border p-6 ${
        selected
          ? 'border-accent-100 bg-accent-900'
          : 'border-transparent bg-background-900'
      }`}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {assignedPeople.length > 0 && (
          <View className="flex-row items-center">
            {assignedPeople
              .slice(0, 4)
              .map((person: PersonWithId, index: number) => (
                <View
                  key={person.id}
                  style={{
                    marginLeft: index > 0 ? -10 : 0,
                  }}
                >
                  <PersonAvatar
                    personId={person.id}
                    expenseId={expenseId}
                    size="md"
                  />
                </View>
              ))}
            {assignedPeople.length > 4 && (
              <Text className="ml-2 text-lg dark:text-text-50">···</Text>
            )}
          </View>
        )}
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="font-futuraDemi text-2xl dark:text-text-50">
            {itemName}
          </Text>
          <Text className="font-futuraMedium text-2xl dark:text-text-50">
            ${itemPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
