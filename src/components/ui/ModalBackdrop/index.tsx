/* eslint-disable no-restricted-imports */
import { PropsWithChildren, useEffect } from 'react';
import { BackHandler, Pressable } from 'react-native';
import {
  KeyboardAvoidingView,
  KeyboardController,
} from 'react-native-keyboard-controller';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';

import { useDimensions } from '@/hooks/common';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  onPress?: () => void;
};

const ModalBackdrop = ({ onPress, children }: PropsWithChildren<Props>) => {
  const { height, width } = useDimensions();

  useEffect(() => {
    const backHandler = () => {
      onPress?.();
      return true;
    };
    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      backHandler,
    );
    return () => {
      backHandlerListener.remove();
    };
  }, [onPress]);

  useEffect(() => {
    void KeyboardController.dismiss();
  }, []);

  return (
    <Animated.View
      className="absolute w-screen bg-[rgba(0,0,0,0.2)] dark:bg-[rgba(0,0,0,0.6)]"
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        height,
        width,
      }}
    >
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <Pressable
          className="flex-1 items-center justify-center"
          onPress={onPress}
        >
          <AnimatedPressable
            className="w-[90%]"
            layout={LinearTransition}
            onPress={e => e.stopPropagation()}
          >
            {children}
          </AnimatedPressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

export default ModalBackdrop;
