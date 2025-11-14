import Octicons from '@expo/vector-icons/Octicons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { useExpense } from '@/api/expenses/use-expenses';
import { ItemCardDetailed } from '@/components/item-card-detailed';
import { ActivityIndicator, Pressable, Text, View } from '@/components/ui';
import { clearTempExpense, useExpenseCreation } from '@/lib/store';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ExpenseIdT } from '@/types';

const TEMP_EXPENSE_ID = 'temp-expense' as ExpenseIdT;

export default function SplitExpense() {
  const theme = useThemeConfig();
  const {
    data: tempExpense,
    isPending,
    isError,
  } = useExpense({
    variables: TEMP_EXPENSE_ID,
  });
  const hydrate = useExpenseCreation.use.hydrate();
  const [selectedItemId, setSelectedItemId] = useState(
    tempExpense?.items?.[0]?.id
  );

  useEffect(() => {
    if (!tempExpense) {
      hydrate();
    } else {
      setSelectedItemId(tempExpense.items?.[0]?.id);
    }
  }, [tempExpense, hydrate]);

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
                Alert.alert(
                  'Unsaved Changes',
                  'You have unsaved changes. Are you sure you want to leave?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Leave',
                      onPress: () => {
                        clearTempExpense();
                        queryClient.invalidateQueries({
                          queryKey: ['expenses', 'expenseId', TEMP_EXPENSE_ID],
                        });
                        router.replace('/');
                      },
                    },
                  ]
                );
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
      {isPending || !tempExpense || !selectedItemId ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center">
          <Text>Error loading temp expense</Text>
        </View>
      ) : selectedItemId ? (
        <View className="flex-1 px-4">
          <Text className="font-futuraBold text-4xl dark:text-text-50">
            {tempExpense.name}
          </Text>
          <View className="flex min-w-max items-center justify-center pt-3">
            <ItemCardDetailed
              expenseId={tempExpense.id as ExpenseIdT}
              itemId={selectedItemId}
            />
          </View>
        </View>
      ) : null}
    </>
  );
}
