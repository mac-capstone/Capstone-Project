// module.exports = require('@gorhom/bottom-sheet/mock');
import React from 'react';
import { View } from 'react-native';

const BottomSheetModal = React.forwardRef((props: any, _ref: any) => {
  const { children, testID, ...rest } = props;
  return React.createElement(View, { testID, ...rest }, children);
});
BottomSheetModal.displayName = 'BottomSheetModal';

const BottomSheet = React.forwardRef((_props: any, _ref: any) => {
  return null;
});
BottomSheet.displayName = 'BottomSheet';

const BottomSheetView = ({ children }: any) => children;
BottomSheetView.displayName = 'BottomSheetView';

const BottomSheetScrollView = ({ children }: any) => children;
BottomSheetScrollView.displayName = 'BottomSheetScrollView';

const BottomSheetBackdrop = () => null;
BottomSheetBackdrop.displayName = 'BottomSheetBackdrop';

const BottomSheetModalProvider = ({ children }: any) => children;
BottomSheetModalProvider.displayName = 'BottomSheetModalProvider';

const BottomSheetFlatList = React.forwardRef((props: any, _ref: any) => {
  const { data, renderItem, keyExtractor } = props;
  if (!data || !renderItem) return null;

  return React.createElement(
    React.Fragment,
    null,
    data.map((item: any, index: number) => {
      const key = keyExtractor ? keyExtractor(item, index) : index;
      return React.createElement(
        React.Fragment,
        { key },
        renderItem({ item, index })
      );
    })
  );
});
BottomSheetFlatList.displayName = 'BottomSheetFlatList';

export {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
};

export default BottomSheet;
