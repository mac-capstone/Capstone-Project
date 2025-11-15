import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { useExpense } from '@/api/expenses/use-expenses';
import { useItem } from '@/api/items/use-items';
import { usePeopleIdsForItem } from '@/api/people/use-people';
import { useExpenseCreation } from '@/lib/store';
import {
  type ExpenseIdT,
  type ItemIdT,
  type PersonIdT,
  type PersonWithId,
} from '@/types';

import { PersonAvatar } from './person-avatar';
import { Button } from './ui/button';

type Props = {
  expenseId: ExpenseIdT;
  itemId: ItemIdT;
};

export const ItemCardDetailed = ({ expenseId, itemId }: Props) => {
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const updateItemShare = useExpenseCreation.use.updateItemShare();
  const removePersonFromItem = useExpenseCreation.use.removePersonFromItem();

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

  useEffect(() => {
    if (
      splitMode === 'equal' &&
      assignedPersonIds &&
      assignedPersonIds.length > 0
    ) {
      assignedPersonIds.forEach((personId) => {
        updateItemShare(itemId, personId, 1);
      });
      queryClient.invalidateQueries({
        queryKey: ['items'],
      });
    }
  }, [splitMode, assignedPersonIds, itemId, updateItemShare, expenseId]);

  if (isPending) {
    return <ActivityIndicator />;
  }

  if (isError) {
    return <Text>Error loading item</Text>;
  }

  // Only check item and expense - assignedPersonIds can be empty array
  if (!item || !expense) {
    return null;
  }

  const { name: itemName, amount: itemPrice } = item;
  const people = expense.people; // never undefined as we use temp expenses which has people

  // Default to empty array to prevent undefined rendering
  const assignedPeople =
    people?.filter((p: PersonWithId) =>
      (assignedPersonIds ?? []).includes(p.id)
    ) ?? [];

  const totalShares = Object.values(item.split.shares).reduce(
    (acc, share) => acc + share,
    0
  );

  const handleIncrease = (personId: PersonIdT) => {
    const currentShare = item.split.shares[personId] || 0;
    const newShare = parseFloat((currentShare + 1).toFixed(1));
    updateItemShare(itemId, personId, newShare);
    queryClient.invalidateQueries({
      queryKey: ['items'],
    });
  };

  const handleDecrease = (personId: PersonIdT) => {
    const currentShare = item.split.shares[personId] || 0;
    const newShare = parseFloat(Math.max(0, currentShare - 1).toFixed(1));
    updateItemShare(itemId, personId, newShare);
    queryClient.invalidateQueries({
      queryKey: ['items'],
    });
  };

  const participants = assignedPeople.map((person: PersonWithId) => {
    const share = item.split.shares[person.id] || 0;
    const price = totalShares > 0 ? (itemPrice / totalShares) * share : 0;
    return {
      ...person,
      quantity: share,
      price: `$${price.toFixed(2)}`,
    };
  });

  return (
    <View className="w-full overflow-hidden rounded-xl bg-neutral-800 p-4 shadow-lg">
      {/* Top section */}
      <View className="flex-row items-center justify-between">
        <View
          className={
            splitMode === 'equal'
              ? 'w-10/12 flex-row items-center'
              : 'w-9/12 flex-row items-center'
          }
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {assignedPeople.map((person: PersonWithId, index: number) => (
              <View
                key={person.id}
                style={{
                  marginLeft: index > 0 ? 5 : 0,
                }}
              >
                <PersonAvatar
                  personId={person.id}
                  expenseId={expenseId}
                  size="lg"
                />
              </View>
            ))}
          </ScrollView>
          {assignedPeople.length > 0 && (
            <Pressable
              className="ml-3"
              onPress={() => {
                assignedPeople.forEach((person) => {
                  removePersonFromItem(itemId, person.id);
                });
                queryClient.invalidateQueries({
                  queryKey: ['items'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['people'],
                });
              }}
            >
              <AntDesign name="close" size={12} color="red" />
            </Pressable>
          )}
        </View>
        <Button
          label={splitMode === 'equal' ? 'Equal' : '$ Custom'}
          variant="outline"
          size="sm"
          onPress={() =>
            setSplitMode(splitMode === 'equal' ? 'custom' : 'equal')
          }
        />
      </View>

      {/* Item details */}
      <View className="pt-4">
        <Text className="font-futuraDemi text-3xl dark:text-text-50">
          {itemName}
        </Text>
        <Text className="text-lg dark:text-accent-100">{`$${itemPrice.toFixed(
          2
        )}`}</Text>
      </View>

      {/* Participants */}
      <View className="pt-4">
        {splitMode === 'custom' && participants.length > 0 && (
          <ScrollView className="max-h-40">
            {participants.map(
              (
                participant: PersonWithId & { quantity: number; price: string },
                index: number
              ) => {
                if (!participant) {
                  return null;
                }
                return (
                  <View
                    key={index}
                    className="flex-row items-center justify-between py-2"
                  >
                    <Text className="text-lg text-white">
                      {participant.name}
                    </Text>
                    <View className="flex-row items-center p-1">
                      <Pressable onPress={() => handleDecrease(participant.id)}>
                        <AntDesign name="minus" size={16} color="white" />
                      </Pressable>
                      <View className="mx-4 min-h-8 min-w-8 items-center justify-center rounded-md bg-white px-2 py-1">
                        <Text className="text-md font-bold text-black">
                          {participant.quantity}
                        </Text>
                      </View>
                      <Pressable onPress={() => handleIncrease(participant.id)}>
                        <AntDesign name="plus" size={16} color="white" />
                      </Pressable>
                      <Text className="ml-5 w-auto text-right text-lg text-white">
                        {participant.price}
                      </Text>
                    </View>
                  </View>
                );
              }
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};
