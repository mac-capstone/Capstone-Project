import 'react-native-get-random-values';

import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import ExpenseCreationFooter from '@/components/expense-creation-footer';
import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { clearTempExpense, useExpenseCreation } from '@/lib/store';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ItemIdT } from '@/types';

export default function AddExpense() {
  const theme = useThemeConfig();
  const userId = useAuth.use.userId();
  const tempExpense = useExpenseCreation.use.tempExpense();
  const setExpenseName = useExpenseCreation.use.setExpenseName();
  const getTotalAmount = useExpenseCreation.use.getTotalAmount();
  const initializeTempExpense = useExpenseCreation.use.initializeTempExpense();
  const hydrate = useExpenseCreation.use.hydrate();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (userId && !tempExpense) {
      initializeTempExpense(userId);
    }
  }, [userId, tempExpense, initializeTempExpense]);

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
                if (
                  tempExpense?.items?.length &&
                  tempExpense.items.length > 0
                ) {
                  Alert.alert(
                    'Unsaved Changes',
                    'You have unsaved changes. Are you sure you want to leave?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Leave',
                        onPress: () => {
                          router.replace('/');
                          clearTempExpense();
                        },
                      },
                    ]
                  );
                } else {
                  router.replace('/');
                  clearTempExpense();
                }
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
          Create an expense
        </Text>
        <View className="pb-11 pt-5">
          <Input
            placeholder="Enter Expense Name"
            value={tempExpense?.name}
            onChangeText={(text) => setExpenseName(text)}
          />
        </View>
        <View className="flex flex-col gap-4">
          <TempItemCards />
          <CreateItemCard />
        </View>
      </View>
      <View className="px-4 pb-3">
        <Button
          className="min-h-12"
          label="Scan Receipt"
          icon={<Ionicons name="scan-outline" size={20} />}
          onPress={() => {
            console.log('scan receipt');
          }}
        />
      </View>
      <ExpenseCreationFooter
        nextDisabled={
          tempExpense?.totalAmount === 0 || tempExpense?.name === ''
        }
        onNextPress={() => {
          router.replace('/expense/split-expense');
        }}
        totalAmount={getTotalAmount()}
        hasPrevious={false}
      />
    </>
  );
}

function TempItemCards() {
  const tempExpense = useExpenseCreation.use.tempExpense();
  if (!tempExpense) return null;
  return tempExpense.items.map((item) => (
    <View
      key={item.id}
      className="flex flex-row items-center justify-between rounded-xl bg-background-900 p-4"
    >
      <Text className="font-futuraBold text-lg dark:text-text-50">
        {item.name}
      </Text>
      <Text className="font-futuraDemi text-xl dark:text-text-50">
        ${item.amount.toFixed(2)}
      </Text>
    </View>
  ));
}

function CreateItemCard() {
  const [tempItemName, setTempItemName] = useState<string>('');
  const [tempItemAmount, setTempItemAmount] = useState<number>(0);

  const addItem = useExpenseCreation.use.addItem();

  return (
    <View className="flex w-full flex-col gap-2 rounded-xl bg-background-925 p-4">
      <View className="flex w-full flex-row gap-2">
        <Input
          placeholder="Enter Item Name"
          containerClassName="flex-1 mb-0"
          onChangeText={(text) => setTempItemName(text)}
        />
        <Pressable
          className="size-11 items-center justify-center rounded-2xl bg-background-900"
          onPress={() => {}}
        >
          <Ionicons name="mic-outline" size={24} color="#A4A4A4" />
        </Pressable>
      </View>
      <Input
        placeholder="Enter Item Amount"
        keyboardType="numeric"
        onChangeText={(text) => setTempItemAmount(Number(text))}
      />
      <Button
        label="Add Item"
        onPress={() => {
          addItem({
            id: uuidv4() as ItemIdT,
            name: tempItemName,
            amount: tempItemAmount,
            split: {
              mode: 'equal',
              shares: {},
            },
            assignedPersonIds: [],
          });
        }}
        disabled={!tempItemName || !tempItemAmount}
      />
    </View>
  );
}
