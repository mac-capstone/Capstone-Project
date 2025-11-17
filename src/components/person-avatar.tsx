import Octicons from '@expo/vector-icons/Octicons';
import { ActivityIndicator } from 'react-native';

import { usePerson } from '@/api/people/use-people';
import { colors, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { type ExpenseIdT, type PersonIdT } from '@/types';
export const PersonAvatar = ({
  size = 'md',
  personId,
  expenseId,
  isSelected = false,
}: {
  size?: 'sm' | 'md' | 'lg';
  personId: PersonIdT;
  expenseId: ExpenseIdT;
  isSelected?: boolean;
}) => {
  const { data, isPending, isError } = usePerson({
    variables: { expenseId, personId },
  });
  if (isPending) {
    return <ActivityIndicator />;
  }
  if (isError) {
    return <Text>Error loading person</Text>;
  }
  const avatarColor =
    colors.avatar?.[data.color as keyof typeof colors.avatar] ??
    colors.avatar.white;
  return (
    <View
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-full',
        size === 'sm' ? 'size-6' : size === 'md' ? 'size-8' : 'size-12',
        isSelected ? 'border-2 border-blue-900' : ''
      )}
      style={{ backgroundColor: avatarColor }}
    >
      <Octicons
        name="person"
        size={size === 'sm' ? 12 : size === 'md' ? 15 : 24}
        color="#F4F4F5"
      />
    </View>
  );
};
