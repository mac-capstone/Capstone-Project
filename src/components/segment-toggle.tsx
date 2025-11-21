import { useEffect, useMemo, useState } from 'react';
import { type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Pressable, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';

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
