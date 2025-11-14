import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { useExpenseCreation } from '@/lib/store';
import { type PersonIdT, type PersonWithId } from '@/types';

import { PersonAvatar } from './person-avatar';

export const AddRemovePerson = () => {
  const { tempExpense, addPerson, removePerson } = useExpenseCreation();
  const [selectedPeopleIds, setSelectedPeopleIds] = useState<PersonIdT[]>([]);

  const toggleSelection = (personId: PersonIdT) => {
    setSelectedPeopleIds((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

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
    selectedPeopleIds.forEach((personId) => removePerson(personId));
    setSelectedPeopleIds([]);
  };

  const people = tempExpense?.people ?? [];

  return (
    <View className="bg-transparent p-4">
      <Text className="pb-2 text-sm text-gray-400">Tap to add/remove</Text>
      <View className="flex-row items-center pb-4">
        {people.map((person) => (
          <TouchableOpacity
            key={person.id}
            onPress={() => toggleSelection(person.id)}
            className="pr-2"
            activeOpacity={1}
          >
            <PersonAvatar
              size="lg"
              personId={person.id}
              expenseId={tempExpense!.id}
            />
            {selectedPeopleIds.includes(person.id) && (
              // TODO: @Hadi1723 replace with a better checkmark UI
              <View className="absolute right-0 top-0 size-4 items-center justify-center rounded-full border-2 border-black bg-green-500">
                <Text className="text-xs text-white">✓</Text>
              </View>
            )}
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
          disabled={selectedPeopleIds.length === 0}
        >
          <Text
            className={`font-bold ${
              selectedPeopleIds.length > 0 ? 'text-white' : 'text-gray-500'
            }`}
          >
            - Remove
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
