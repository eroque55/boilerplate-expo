import { Text } from 'react-native';

import { useDisableDelay, useTheme } from '@/hooks/common';
import { colors } from '@/theme/colors';

import ButtonActivityIndicator from '../../Button/ButtonActivityIndicator';
import Pressable from '../../Pressable';

type Props = {
  text: string;
  onPress: () => Promise<void> | void;
  showBorder?: boolean;
};

const DefaultModalButton = ({ text, onPress, showBorder = false }: Props) => {
  const { executeWithDelay, isLoading } = useDisableDelay();
  const { isDark } = useTheme();

  const handlePress = async () => {
    await executeWithDelay(onPress);
  };

  const getBorderColor = () => {
    if (!showBorder) {
      return colors.transparent;
    }

    return isDark ? colors.neutral[600] : colors.neutral[200];
  };

  return (
    <Pressable
      className="grow items-center justify-center overflow-hidden border-r p-3"
      style={{ borderColor: getBorderColor() }}
      onPress={handlePress}
    >
      <Text className="text-primary text-sm">{text}</Text>

      <ButtonActivityIndicator isLoading={isLoading} />
    </Pressable>
  );
};

export default DefaultModalButton;
