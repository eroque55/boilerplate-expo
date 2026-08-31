import { useEffect } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/common';
import { colors } from '@/theme/colors';

import Icon from '../Icon';
import { AnimatedPressable } from '../Pressable';

type Props = {
  isSelected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
};

const Checkbox = ({ isSelected = false, disabled = false, onPress }: Props) => {
  const { isDark } = useTheme();

  const activeValue = useSharedValue(isSelected ? 1 : 0);
  const inactiveBackgroundColor = isDark ? colors.neutral[800] : colors.white;

  const containerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeValue.value,
      [0, 1],
      [inactiveBackgroundColor, colors.alert.success],
    );

    return {
      backgroundColor,
    };
  });

  useEffect(() => {
    activeValue.value = withTiming(isSelected ? 1 : 0);
  }, [isSelected, activeValue]);

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <AnimatedPressable
      className="aspect-square w-6 items-center justify-center overflow-hidden rounded-md"
      disabled={disabled}
      haptic={isSelected ? 'toggleOff' : 'toggleOn'}
      style={containerStyle}
      onPress={handlePress}
    >
      {isSelected && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Icon color={colors.white} name="CheckIcon" size={16} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

export default Checkbox;
