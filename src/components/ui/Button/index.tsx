import {
  DimensionValue,
  GestureResponderEvent,
  PressableProps,
  Text,
} from 'react-native';
import { LinearTransition } from 'react-native-reanimated';

import { useDisableDelay } from '@/hooks/common';
import { colors } from '@/theme/colors';

import Icon, { IconProps } from '../Icon';
import { AnimatedPressable, AnimatedPressableProps } from '../Pressable';

import ButtonActivityIndicator from './ButtonActivityIndicator';

type Props = {
  text?: string;
  wired?: boolean;
  color?: string;
  leftIcon?: IconProps;
  isLoading?: boolean;
  width?: DimensionValue;
  withoutDelay?: boolean;
  useLayoutAnimation?: boolean;
} & AnimatedPressableProps &
  PressableProps;

const Button = ({
  text,
  wired = false,
  color = colors.primary,
  isLoading = false,
  onPress,
  withoutDelay = false,
  width = '100%',
  leftIcon,
  style,
  useLayoutAnimation = true,
  ...props
}: Props) => {
  const { executeWithDelay, isLoading: loading } = useDisableDelay();

  const handleColor = () => {
    if (wired) {
      return undefined;
    }

    return color;
  };

  const handleTextColor = () => {
    if (wired) {
      return color;
    }

    return colors.neutral[100];
  };

  const handlePress = async (e: GestureResponderEvent) => {
    if (!onPress) {
      return;
    }

    if (withoutDelay) {
      onPress(e);
      return;
    }

    await executeWithDelay(() => onPress(e));
  };

  return (
    <AnimatedPressable
      className="flex-row items-center justify-center gap-3 overflow-hidden rounded-full border-2 p-3"
      layout={useLayoutAnimation ? LinearTransition : undefined}
      style={[
        {
          backgroundColor: handleColor(),
          borderColor: wired ? color : colors.transparent,
          width,
        },
        style,
      ]}
      onPress={handlePress}
      {...props}
    >
      {leftIcon && (
        <Icon color={leftIcon.color || handleTextColor()} {...leftIcon} />
      )}

      <Text
        className="text-base"
        style={{
          color: handleTextColor(),
        }}
      >
        {text}
      </Text>

      <ButtonActivityIndicator isLoading={isLoading || loading} />
    </AnimatedPressable>
  );
};

export default Button;
