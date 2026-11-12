import { Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
  text?: string;
};

const EmptyComponent = ({ text = 'Nada encontrado' }: Props) => {
  return (
    <Animated.View
      className="flex-1 items-center justify-center py-10"
      entering={FadeIn}
      exiting={FadeOut}
    >
      <Text className="text-base text-neutral-400">{text}</Text>
    </Animated.View>
  );
};

export default EmptyComponent;
