import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
  text?: string;
};

const ErrorText = ({ text }: Props) => {
  if (!text) {
    return null;
  }

  return (
    <Animated.Text
      className="text-alert-error text-xs"
      entering={FadeIn}
      exiting={FadeOut}
    >
      {text}
    </Animated.Text>
  );
};

export default ErrorText;
