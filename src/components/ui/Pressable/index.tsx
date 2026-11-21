/* eslint-disable no-restricted-imports */
import { ComponentProps, PropsWithChildren } from 'react';
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  View,
} from 'react-native';
import { KeyboardController } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';

import { HapticIntent, triggerHaptic } from '@/utils/haptics';

export type PressableProps = {
  withoutFeedback?: boolean;
  haptic?: HapticIntent | false;
} & RNPressableProps;

const Pressable = ({
  withoutFeedback = false,
  haptic = 'press',
  children,
  onPress,
  ...props
}: PropsWithChildren<PressableProps>) => {
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
