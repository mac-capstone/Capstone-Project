import 'react-native-get-random-values';

import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { router, Stack } from 'expo-router';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { queryClient } from '@/api';
import { useExpense } from '@/api/expenses/use-expenses';
import ExpenseCreationFooter from '@/components/expense-creation-footer';
import { Button, Input, Pressable, Text, View } from '@/components/ui';
import { useAuth } from '@/lib';
import { clearTempExpense, useExpenseCreation } from '@/lib/store';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ExpenseIdT, type ItemIdT } from '@/types';

const TEMP_EXPENSE_ID = 'temp-expense' as ExpenseIdT;

export default function AddExpense() {
  const theme = useThemeConfig();
  const userId = useAuth.use.userId();
  const {
    data: tempExpense,
    isPending,
    isError,
  } = useExpense({
    variables: TEMP_EXPENSE_ID,
  });
  const [expenseName, setExpenseName] = useState<string>('');
  const setExpenseNameInStore = useExpenseCreation.use.setExpenseName();
  const getTotalAmount = useExpenseCreation.use.getTotalAmount();
  const initializeTempExpense = useExpenseCreation.use.initializeTempExpense();
  const hydrate = useExpenseCreation.use.hydrate();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // if the user is logged in and the temp expense is not found
    if (userId && (!tempExpense || isError)) {
      initializeTempExpense(userId);
      queryClient.invalidateQueries({
        queryKey: ['expenses', 'expenseId', TEMP_EXPENSE_ID],
      });
    }
  }, [userId, tempExpense, initializeTempExpense, isError]);

  if (isPending) {
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
              <Pressable onPress={() => router.replace('/')}>
                <Octicons
                  name="x"
                  color={theme.dark ? 'white' : 'black'}
                  size={24}
                />
              </Pressable>
            ),
          }}
        />
        <View className="flex-1 justify-center p-3">
          <ActivityIndicator />
        </View>
      </>
    );
  }

  if (isError) {
    return <Text>Error loading temp expense</Text>;
  }

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
                          setExpenseName('');
                          queryClient.invalidateQueries({
                            queryKey: [
                              'expenses',
                              'expenseId',
                              TEMP_EXPENSE_ID,
                            ],
                          });
                        },
                      },
                    ]
                  );
                } else {
                  router.replace('/');
                  clearTempExpense();
                  setExpenseName('');
                  queryClient.invalidateQueries({
                    queryKey: ['expenses', 'expenseId', TEMP_EXPENSE_ID],
                  });
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
            value={expenseName}
            onChangeText={(text) => {
              setExpenseName(text);
              setExpenseNameInStore(text);
            }}
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
          onPress={() => router.push('/reciept-camera')}
        />
      </View>
      <ExpenseCreationFooter
        nextDisabled={getTotalAmount() === 0 || expenseName === ''}
        onNextPress={() => {
          setExpenseNameInStore(expenseName);
          setExpenseName('');
          queryClient.invalidateQueries({
            queryKey: ['expenses', 'expenseId', TEMP_EXPENSE_ID],
          });
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

function getItemAndAmountFromTaggedWords(taggedWords: any[]): {
  itemName: string;
  itemAmount: number;
} {
  let itemName = '';
  let itemAmount = 0;
  let index = 0;
  let start = -1;
  let end = -1;
  let lastCDIndex = -1;

  taggedWords.forEach((pair: [string, string]) => {
    if (pair[1] === '$') {
      // Price should come after dollar sign
      itemAmount = parseFloat(taggedWords[index + 1][0]);
    } else if (
      pair[0].toLowerCase() !== 'cost' &&
      pair[0].toLowerCase() !== 'dollar' &&
      pair[0].toLowerCase() !== 'dollars' &&
      (pair[1] === 'NN' ||
        pair[1] === 'NNS' ||
        pair[1] === 'NNP' ||
        pair[1] === 'NNPS')
    ) {
      // Noun indicates item name, set start if not set
      // also ignore "cost" and "dollar(s)" as they are not item names
      if (start === -1) {
        start = index;
      }
    } else {
      if (pair[0].toLowerCase() !== 'and') {
        // any other word indicates end of item name if start has been set
        if (start !== -1 && end === -1) {
          end = index;
        }
      } else {
        // handle "and" case
        // and must be followed by a noun or item name ends on the index of "and"
        // also must not be the last word
        if (
          index + 1 !== taggedWords.length &&
          (taggedWords[index + 1][1] === 'NN' ||
            taggedWords[index + 1][1] === 'NNS' ||
            taggedWords[index + 1][1] === 'NNP' ||
            taggedWords[index + 1][1] === 'NNPS')
        ) {
          // do nothing, continue item name
        } else {
          // bad "and" case, item name ends here
          if (start !== -1 && end === -1) {
            end = index;
          }
        }
      }
    }
    // Keep track of last CD (cardinal number) index for amount extraction
    // in the case no dollar sign is present
    // this case shouldn't happen using voice to text

    // could be adjusted in the future using multiple possible voice text possibilities,
    // picking the one with a dollar sign
    if (pair[1] === 'CD') {
      lastCDIndex = index;
    }

    index++;
  });
  if (lastCDIndex !== -1 && itemAmount === 0) {
    itemAmount = parseFloat(taggedWords[lastCDIndex][0]);
  }

  if (end === -1) {
    end = taggedWords.length;
  }
  itemName = taggedWords
    .slice(start, end)
    .map((pair: [string, string]) => pair[0])
    .join(' ');

  // Logging for debugging
  // console.log('sentence:', taggedWords);
  // console.log('itemName start index:', start);
  // console.log('itemName end index:', end);
  // console.log('Extracted Item Name:', itemName);
  // console.log('Extracted Item Amount:', itemAmount);

  return { itemName, itemAmount };
}

function CreateItemCard() {
  const [tempItemName, setTempItemName] = useState<string>('');
  const [tempItemAmount, setTempItemAmount] = useState<number>(0);
  const [recognizing, setRecognizing] = useState(false);

  const addItem = useExpenseCreation.use.addItem();

  useSpeechRecognitionEvent('start', () => setRecognizing(true));
  useSpeechRecognitionEvent('end', () => setRecognizing(false));
  useSpeechRecognitionEvent('result', (event) => {
    console.log(event);
    const transcriptText = event.results[0]?.transcript ?? '';

    if (event.isFinal) {
      let pos = require('pos');
      let words = new pos.Lexer().lex(transcriptText);

      let tagger = new pos.Tagger();
      let taggedWords = tagger.tag(words);

      let { itemName, itemAmount } =
        getItemAndAmountFromTaggedWords(taggedWords);

      setTempItemName(itemName);
      setTempItemAmount(itemAmount);
    }
  });
  useSpeechRecognitionEvent('error', (event) => {
    console.log('error code:', event.error, 'error message:', event.message);
  });

  const handleStart = async () => {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!result.granted) {
      console.warn('Permissions not granted', result);
      return;
    }
    // Start speech recognition
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      interimResults: true,
      continuous: false,
    });
  };

  return (
    <View className="flex w-full flex-col gap-2 rounded-xl bg-background-925 p-4">
      <View className="flex w-full flex-row gap-2">
        <Input
          placeholder="Enter Item Name"
          containerClassName="flex-1 mb-0"
          value={tempItemName}
          onChangeText={(text) => setTempItemName(text)}
        />
        {!recognizing ? (
          <Pressable
            className="size-11 items-center justify-center rounded-2xl bg-background-900"
            onPress={handleStart}
          >
            <Ionicons name="mic-outline" size={24} color="#A4A4A4" />
          </Pressable>
        ) : (
          <Pressable
            className="size-11 items-center justify-center rounded-2xl bg-background-900"
            onPress={() => {
              ExpoSpeechRecognitionModule.stop();
              console.log('stopped');
            }}
          >
            <Ionicons name="mic-outline" size={24} color="#c70000ff" />
          </Pressable>
        )}
      </View>
      <Input
        placeholder="Enter Item Amount"
        keyboardType="numeric"
        value={tempItemAmount === 0 ? '' : tempItemAmount.toString()}
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
          queryClient.invalidateQueries({
            queryKey: ['expenses', 'expenseId', TEMP_EXPENSE_ID],
          });
          queryClient.invalidateQueries({
            queryKey: ['items', 'expenseId', TEMP_EXPENSE_ID],
          });
          setTempItemName('');
          setTempItemAmount(0);
        }}
        disabled={!tempItemName || !tempItemAmount}
      />
    </View>
  );
}
