import { Text, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/common';
import { colors } from '@/theme/colors';

import Pressable from '../Pressable';

type Props = {
  text: string;
  onPress: () => void;
  isActive?: boolean;
  activeBackgroundColor?: string;
  containerStyle?: ViewStyle;
};

const Tab = ({
  isActive = false,
  onPress,
  text,
  activeBackgroundColor = colors.primary,
  containerStyle,
}: Props) => {
  const { isDark } = useTheme();

  const getTextColor = () => {
    if (isActive) {
      return colors.white;
    }

    if (isDark) {
      return colors.neutral[400];
    }

    return colors.neutral[500];
  };

  return (
    <Pressable
      className="items-center overflow-hidden rounded-full px-4 py-3"
      haptic="selection"
      style={[
        {
          backgroundColor: isActive
            ? activeBackgroundColor
            : colors.transparent,
        },
        containerStyle,
      ]}
      onPress={onPress}
    >
      <Text className="text-sm" style={{ color: getTextColor() }}>
        {text}
      </Text>
    </Pressable>
  );
};

export default Tab;
