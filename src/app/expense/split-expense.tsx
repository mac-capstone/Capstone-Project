import Octicons from '@expo/vector-icons/Octicons';
import { FlashList } from '@shopify/flash-list';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { AddRemovePerson } from '@/components/add-remove-person';
import { CompactItemCard } from '@/components/compact-item-card';
import ExpenseCreationFooter from '@/components/expense-creation-footer';
import { ItemCardDetailedCustom } from '@/components/item-card-detailed';
import { ActivityIndicator, Pressable, Text, View } from '@/components/ui';
import { clearTempExpense, useExpenseCreation } from '@/lib/store';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ExpenseIdT, type ItemWithId } from '@/types';

export default function SplitExpense() {
  const theme = useThemeConfig();
  const tempExpense = useExpenseCreation.use.tempExpense();
  const hydrate = useExpenseCreation.use.hydrate();
  const [selectedItem, setSelectedItem] = useState<ItemWithId | null>(
    tempExpense?.items[0] || null
  );

  useEffect(() => {
    if (!tempExpense) {
      hydrate();
    } else if (tempExpense.items.length > 0 && !selectedItem) {
      setSelectedItem(tempExpense.items[0]);
    }
  }, [tempExpense, hydrate, selectedItem]);

  useEffect(() => {
    if (!tempExpense || !selectedItem) return;

    const updatedItem = tempExpense.items.find((i) => i.id === selectedItem.id);

    if (updatedItem && updatedItem !== selectedItem) {
      setSelectedItem(updatedItem);
    }
  }, [tempExpense, selectedItem]);

  if (!tempExpense) {
    return <ActivityIndicator />;
  }

  const selectedPeople = tempExpense.people;

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                clearTempExpense();
                router.replace('/');
              }}
            >
              <Octicons
                className="mr-2"
                name="x"
                color={theme.dark ? 'white' : 'black'}
                size={24}
              />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 px-4">
        <Text className="font-futuraBold text-4xl dark:text-text-50">
          {tempExpense.name}
        </Text>

        {tempExpense.items.length > 0 ? (
          <>
            {selectedItem && (
              <View className="pt-4">
                <ItemCardDetailedCustom
                  item={selectedItem}
                  people={selectedPeople}
                  expenseId={tempExpense.id as ExpenseIdT}
                />
              </View>
            )}

            <View className="flex-1 pt-4">
              <FlashList
                data={tempExpense.items}
                renderItem={({ item }) => (
                  <CompactItemCard
                    item={item}
                    expenseId={tempExpense.id as ExpenseIdT}
                    onPress={setSelectedItem}
                    selected={selectedItem?.id === item.id}
                  />
                )}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View className="h-3" />}
              />
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center pt-8">
            <Text className="dark:text-text-400 text-lg">
              No items added yet
            </Text>
          </View>
        )}
      </View>
      <AddRemovePerson item={selectedItem} expenseId={tempExpense.id} />
      <ExpenseCreationFooter
        totalAmount={tempExpense.totalAmount}
        onPreviousPress={() => router.push('/expense/add-expense')}
        onNextPress={() => router.push('/expense/confirm-expense')}
      />
    </>
  );
}
