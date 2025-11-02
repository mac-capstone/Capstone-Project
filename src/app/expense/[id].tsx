import Octicons from '@expo/vector-icons/Octicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { useExpense } from '@/api/expenses/use-expenses';
import { ActivityIndicator, Pressable, Text, View } from '@/components/ui';
import { useThemeConfig } from '@/lib/use-theme-config';
import { type ExpenseIdT } from '@/types';

export default function Post() {
  const router = useRouter();
  const theme = useThemeConfig();
  const { id } = useLocalSearchParams<{
    id: ExpenseIdT;
  }>();
  const { data, isPending, isError } = useExpense({
    variables: { id },
  });

  if (isPending) {
    return (
      <View className="flex-1 justify-center p-3">
        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Text className="text-center">Error loading Expense</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: data.name,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Octicons
                className="mr-2"
                name="chevron-left"
                color={theme.dark ? 'white' : 'black'}
                size={24}
              />
            </Pressable>
          ),
        }}
      />
      <View className="flex-1 p-3 ">
        <Text>{data.name}</Text>
        <Text>{data.totalAmount}</Text>
        <Text>{data.date}</Text>
        <Text>{data.remainingAmount}</Text>
      </View>
    </>
  );
}
