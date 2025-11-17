import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useExpenseCreation } from '@/lib/store';
import {
  type ExpenseIdT,
  type ItemIdT,
  type PersonIdT,
  type PersonWithId,
} from '@/types';

import { PersonAvatar } from './person-avatar';

type Props = {
  itemID: ItemIdT;
  expenseId: ExpenseIdT;
};

export const AddRemovePerson = ({ itemID, expenseId }: Props) => {
  const {
    tempExpense,
    assignPersonToItem,
    getItemPaersonIds,
    addPerson,
    removePersonFromItem,
    removePerson,
  } = useExpenseCreation();

  const handleAddPerson = () => {
    if (!tempExpense) return;
    const newPerson: PersonWithId = {
      id: `person-${Date.now()}` as PersonIdT,
      name: `Person ${tempExpense.people.length + 1}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      userRef: null,
      subtotal: 0,
    };
    addPerson(newPerson);
  };

  const handleRemove = () => {
    if (!tempExpense) return;
    const selectedPeopleIds = getItemPaersonIds(itemID);
    selectedPeopleIds.forEach((personId) => {
      removePersonFromItem(itemID, personId);
      removePerson(personId);
    });
  };

  const people = tempExpense?.people ?? [];
  const assignedPeopleIds = getItemPaersonIds(itemID);

  return (
    <View className="bg-transparent p-4">
      <Text className="pb-2 text-sm text-gray-400">
        {itemID ? 'Tap to assign to item' : 'Select an item to assign people'}
      </Text>
      <View className="flex-row items-center pb-4">
        {people.map((person) => (
          <TouchableOpacity
            key={person.id}
            onPress={() => assignPersonToItem(itemID, person.id)}
            className="pr-2"
            activeOpacity={1}
            disabled={!itemID}
          >
            <PersonAvatar
              size="lg"
              personId={person.id}
              expenseId={expenseId}
              isSelected={isAssigned}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-between pb-4">
        <TouchableOpacity
          className="mr-2 flex-1 items-center rounded-lg bg-gray-800 py-3"
          onPress={handleAddPerson}
          activeOpacity={1}
        >
          <Text className="font-bold text-white">+ Add person</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-2 ml-2 items-center rounded-lg bg-gray-800 px-6 py-3"
          onPress={handleRemove}
          disabled={assignedPeopleIds.length === 0}
        >
          <Text
            className={`font-bold ${
              assignedPeopleIds.length > 0 ? 'text-white' : 'text-gray-500'
            }`}
          >
            - Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
