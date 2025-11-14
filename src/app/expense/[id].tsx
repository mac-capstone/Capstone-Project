import Octicons from '@expo/vector-icons/Octicons';
import { FlashList } from '@shopify/flash-list';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useExpense } from '@/api/expenses/use-expenses';
import { useItems } from '@/api/items/use-items';
import { usePeopleIds } from '@/api/people/use-people';
import ExpenseCreationFooter from '@/components/expense-creation-footer';
import { ItemCard } from '@/components/item-card';
import { PersonCard } from '@/components/person-card';
import { ActivityIndicator, Pressable, Text, View } from '@/components/ui';
import { useThemeConfig } from '@/lib/use-theme-config';
import { cn } from '@/lib/utils';
import { type ExpenseIdT } from '@/types';

export default function Post() {
  const router = useRouter();
  const theme = useThemeConfig();
  const { id } = useLocalSearchParams<{
    id: ExpenseIdT;
  }>();
  const [mode, setMode] = useState<'split' | 'items'>('split');
  const { data, isPending, isError } = useExpense({
    variables: id,
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

  const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          {data.name}
        </Text>
        <Text className="text-base font-medium dark:text-text-800">
          {formattedDate}
        </Text>
        <View className="pt-4">
          <SegmentToggle value={mode} onChange={setMode} />
        </View>
        <View className="pt-4">
          {mode === 'split' && (
            <View className="">
              <ExpenseSplitMode expenseId={id} />
            </View>
          )}
          {mode === 'items' && (
            <View className="">
              <ExpenseItemsMode expenseId={id} />
            </View>
          )}
        </View>
      </View>
      <ExpenseCreationFooter
        totalAmount={data.totalAmount}
        hasNext={false}
        hasPrevious={false}
      />
    </>
  );
}

export const ExpenseSplitMode = ({ expenseId }: { expenseId: ExpenseIdT }) => {
  const { data, isPending, isError } = usePeopleIds({
    variables: expenseId,
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading people</Text>;
  }
  return (
    <View className="flex min-h-[60vh] w-full flex-col gap-2 pt-4">
      <FlashList
        data={data}
        renderItem={({ item }) => (
          <PersonCard personId={item} expenseId={expenseId} />
        )}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View className="h-3" />} // 12px gap
      />
    </View>
  );
};

export const ExpenseItemsMode = ({ expenseId }: { expenseId: ExpenseIdT }) => {
  const { data, isPending, isError } = useItems({
    variables: expenseId,
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading items</Text>;
  }
  return (
    <>
      <View className="flex min-h-[60vh] w-full flex-col gap-2 pt-4">
        <FlashList
          data={data}
          renderItem={({ item }) => (
            <ItemCard expenseId={expenseId} itemId={item.id} />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View className="h-3" />} // 12px gap
        />
      </View>
    </>
  );
};

export const SegmentToggle = ({
  value,
  onChange,
}: {
  value: 'split' | 'items';
  onChange: (value: 'split' | 'items') => void;
}) => {
  const [w, setW] = useState(0); // container width
  const segW = useMemo(() => (w > 0 ? w / 2 : 0), [w]);

  // animated translateX for the pill
  const tx = useSharedValue(0);

  useEffect(() => {
    // move to 0 for "split", segW for "items"
    tx.value = withTiming(value === 'split' ? 0 : segW, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, segW, tx]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    setW(e.nativeEvent.layout.width);
  };
  return (
    <View
      onLayout={onLayout}
      className="relative h-12 flex-row items-center rounded-full bg-background-900"
    >
      {/* Sliding pill */}
      <Animated.View
        style={[indicatorStyle, { width: segW }]}
        className={cn(
          'absolute inset-y-1 -left-1 rounded-full bg-background-950',
          value === 'split' ? 'left-1' : '-left-1'
        )}
        pointerEvents="none"
      />
      <Pressable
        onPress={() => onChange('split')}
        className="z-10 h-full flex-1 items-center justify-center rounded-full"
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'split' }}
      >
        <Text
          className={cn(
            'text-base font-semibold',
            value === 'split'
              ? 'dark:text-text-50 text-text-800'
              : 'dark:text-text-800 text-text-50'
          )}
        >
          Split
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChange('items')}
        className="z-10 h-full flex-1 items-center justify-center rounded-full"
        accessibilityRole="button"
        accessibilityState={{ selected: value === 'items' }}
      >
        <Text
          className={cn(
            'text-base font-semibold',
            value === 'items' ? 'dark:text-text-50' : 'dark:text-text-800'
          )}
        >
          Items
        </Text>
      </Pressable>
    </View>
  );
};
