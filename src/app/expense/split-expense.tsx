import Octicons from '@expo/vector-icons/Octicons';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';

import { ItemCardDetailedCustom } from '@/components/item-card-detailed';
import { ActivityIndicator, Pressable, Text, View } from '@/components/ui';
import { clearTempExpense, useExpenseCreation } from '@/lib/store';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ExpenseIdT } from '@/types';

export default function SplitExpense() {
  const theme = useThemeConfig();
  const tempExpense = useExpenseCreation.use.tempExpense();
  const hydrate = useExpenseCreation.use.hydrate();

  useEffect(() => {
    if (!tempExpense) {
      hydrate();
    }
  }, [tempExpense, hydrate]);

  if (!tempExpense) {
    return <ActivityIndicator />;
  }

  const mappedItem = tempExpense.items[0];
  const mappedPeople = tempExpense.people;

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
          {tempExpense?.name}
        </Text>
        <View className="flex min-w-max items-center justify-center">
          <ItemCardDetailedCustom
            item={mappedItem}
            people={mappedPeople}
            expenseId={tempExpense?.id as ExpenseIdT}
          />
        </View>
      </View>
    </>
  );
}
