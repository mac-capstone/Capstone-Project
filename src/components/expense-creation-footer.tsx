import { Button, Text, View } from '@/components/ui';

export default function ExpenseCreationFooter({
  totalAmount,
  hasNext = true,
  hasPrevious = true,
  nextDisabled = false,
  previousDisabled = false,
  onNextPress,
  onPreviousPress,
}: {
  totalAmount: number;
  hasNext?: boolean;
  nextDisabled?: boolean;
  hasPrevious?: boolean;
  previousDisabled?: boolean;
  onNextPress?: () => void;
  onPreviousPress?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between bg-background-900 p-8">
      <View className="flex flex-col">
        <Text className="text-base font-medium text-text-800 dark:text-text-800">
          Total
        </Text>
        <Text className="font-futuraBold text-2xl text-accent-100 dark:text-accent-100">
          ${totalAmount.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        {hasPrevious && (
          <Button
            disabled={previousDisabled}
            className="w-28"
            variant="outline"
            size="lg"
            label="Back"
            onPress={onPreviousPress}
          />
        )}
        {hasNext && (
          <Button
            disabled={nextDisabled}
            className="w-28"
            variant="default"
            size="lg"
            label="Next"
            onPress={onNextPress}
          />
        )}
      </View>
    </View>
  );
}
