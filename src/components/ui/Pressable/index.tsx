/* eslint-disable no-restricted-imports */
import { ComponentProps, PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  PressableProps,
  Pressable as RNPressable,
  View,
} from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';

import { HapticIntent, triggerHaptic } from '@/utils/haptics';

type Props = {
  withoutFeedback?: boolean;
  haptic?: HapticIntent | false;
} & PressableProps;

const Pressable = ({
  withoutFeedback = false,
  haptic = 'press',
  children,
  onPress,
  ...props
}: PropsWithChildren<Props>) => {
  const handlePress = (event: GestureResponderEvent) => {
    void KeyboardController.dismiss();

    if (haptic) {
      triggerHaptic(haptic);
    }

    if (onPress) {
      onPress(event);
    }
  };

  return (
    <RNPressable onPress={handlePress} {...props}>
      {({ pressed }) => (
        <>
          {children}

          {pressed && !withoutFeedback && (
            <View className="absolute inset-0 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.1)]" />
          )}
        </>
      )}
    </RNPressable>
  );
};

export default Pressable;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type AnimatedPressableProps = ComponentProps<typeof AnimatedPressable>;

export { AnimatedPressable, AnimatedPressableProps };
