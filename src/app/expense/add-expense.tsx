import Octicons from '@expo/vector-icons/Octicons';
import { router, Stack } from 'expo-router';
import React from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { useThemeConfig } from '@/lib/use-theme-config';

export default function AddExpense() {
  const theme = useThemeConfig();
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Expense',
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
      <View>
        <Text className="text-text-800 dark:text-text-800">Add Expense</Text>
      </View>
    </>
  );
}
