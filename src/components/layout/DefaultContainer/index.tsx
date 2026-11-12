import { PropsWithChildren } from 'react';
import { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';

import KeyboardAwareScrollView from '@/components/ui/KeyboardAwareScrollView';

import TabBar from '../TabBar';

type Props = {
  showTabBar?: boolean;
} & KeyboardAwareScrollViewProps;

const DefaultContainer = ({
  children,
  showTabBar = false,
  ...props
}: PropsWithChildren<Props>) => {
  return (
    <>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} {...props}>
        {children}
      </KeyboardAwareScrollView>

      {showTabBar && <TabBar />}
    </>
  );
};

export default DefaultContainer;
