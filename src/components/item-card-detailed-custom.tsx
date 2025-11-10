import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  type ExpenseIdT,
  type ItemWithId,
  type PersonIdT,
  type PersonWithId,
} from '@/types';

import { useUpdateItemShares } from '../api/items/use-update-item';
import { PersonAvatar } from './person-avatar';
import { Button } from './ui/button';

type Props = {
  item: ItemWithId;
  people: PersonWithId[];
  expenseId: ExpenseIdT;
};

export const ItemCardDetailedCustom = ({ item, people, expenseId }: Props) => {
  const { mutate: updateShares } = useUpdateItemShares();

  if (!item) {
    return null;
  }

  const {
    id: itemId,
    name: itemName,
    amount: itemPrice,
    assignedPersonIds,
  } = item;

  const assignedPeople = people.filter((p) => assignedPersonIds.includes(p.id));

  const totalShares = Object.values(item.split.shares).reduce(
    (acc, share) => acc + share,
    0
  );

  const handleIncrease = (personId: PersonIdT) => {
    const currentShare = item.split.shares[personId] || 0;
    const newShare = parseFloat((currentShare + 0.1).toFixed(1));
    updateShares({
      expenseId,
      itemId,
      personId: personId,
      newShare,
    });
  };

  const handleDecrease = (personId: PersonIdT) => {
    const currentShare = item.split.shares[personId] || 0;
    const newShare = parseFloat(Math.max(0, currentShare - 0.1).toFixed(1));
    updateShares({
      expenseId,
      itemId,
      personId: personId,
      newShare,
    });
  };

  const participants = assignedPeople.map((person) => {
    const share = item.split.shares[person.id] || 0;
    const price = totalShares > 0 ? (itemPrice / totalShares) * share : 0;
    return {
      ...person,
      quantity: share,
      price: `$${price.toFixed(2)}`,
    };
  });

  return (
    <View className="m-2 w-11/12 overflow-hidden rounded-xl bg-neutral-800 p-4 shadow-lg">
      {/* Top section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="flex-row">
            {assignedPeople.map((person, index) => (
              <View
                key={person.id}
                style={{
                  marginLeft: index > 0 ? -12 : 0,
                }}
              >
                <PersonAvatar
                  personId={person.id}
                  expenseId={expenseId}
                  size="md"
                />
              </View>
            ))}
          </View>
          <Pressable className="ml-3">
            <AntDesign name="close" size={24} color="white" />
          </Pressable>
        </View>
        <Button label="$ Custom" variant="secondary" size="sm" />
      </View>

      {/* Item details */}
      <View className="mt-4">
        <Text className="text-3xl font-bold text-white">{itemName}</Text>
        <Text className="text-lg text-gray-400">{`$${itemPrice.toFixed(
          2
        )}`}</Text>
      </View>

      {/* Participants */}
      <View className="mt-6">
        {participants.map((participant, index) => {
          if (!participant) {
            return null;
          }
          return (
            <View
              key={index}
              className="flex-row items-center justify-between py-3"
            >
              <Text className="text-lg text-white">{participant.name}</Text>
              <View className="flex-row items-center">
                <Pressable onPress={() => handleDecrease(participant.id)}>
                  <AntDesign name="minus" size={20} color="white" />
                </Pressable>
                <View className="mx-4 min-w-10 items-center justify-center rounded-md bg-white px-2 py-1">
                  <Text className="text-lg font-bold text-black">
                    {participant.quantity}
                  </Text>
                </View>
                <Pressable onPress={() => handleIncrease(participant.id)}>
                  <AntDesign name="plus" size={20} color="white" />
                </Pressable>
                <Text className="ml-5 w-16 text-right text-lg text-white">
                  {participant.price}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
