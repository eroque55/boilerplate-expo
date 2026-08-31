import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { PressableProps, Text } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import Checkbox from '../Checkbox';
import ErrorText from '../ErrorText';
import Pressable from '../Pressable';

type Props<TFieldValues extends FieldValues> = {
  label: string;
  useLayoutAnimation?: boolean;
} & UseControllerProps<TFieldValues> &
  PressableProps;

const CheckboxField = <TFieldValues extends FieldValues>({
  label,
  name,
  control,
  useLayoutAnimation = true,
  ...props
}: Props<TFieldValues>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const toggleCheckbox = () => {
    field.onChange(!field.value);
  };

  return (
    <Animated.View
      className="gap-1"
      layout={useLayoutAnimation ? LinearTransition : undefined}
    >
      <Pressable
        className="-mx-2 -my-1 flex-row items-center gap-2 overflow-hidden rounded-full px-2 py-1"
        onPress={toggleCheckbox}
        {...props}
      >
        <Checkbox disabled isSelected={field.value} />

        <Text className="text-sm text-neutral-600 dark:text-neutral-300">
          {label}
        </Text>
      </Pressable>

      <ErrorText text={error?.message} />
    </Animated.View>
  );
};

export default CheckboxField;
