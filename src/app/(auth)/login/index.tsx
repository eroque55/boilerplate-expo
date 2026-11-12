import { zodResolver } from '@hookform/resolvers/zod';
import { updateId } from 'expo-updates';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import {
  Button,
  CheckboxField,
  Input,
  KeyboardAwareScrollView,
  Pressable,
} from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/common';
import { LoginForm, LoginSchema } from '@/validation/login.validation';

const Login = () => {
  const { login } = useAuth();
  const { toggleTheme } = useTheme();

  const [showUpdateId, setShowUpdateId] = useState(false);

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      requestRefresh: false,
    },
  });

  return (
    <KeyboardAwareScrollView
      contentContainerClassName="w-full grow items-start justify-center gap-10 p-4"
      mode="layout"
    >
      <Input
        control={control}
        keyboardType="email-address"
        label="E-mail"
        name="email"
        placeholder="E-mail"
        useLayoutAnimation={false}
      />

      <Input
        isPassword
        control={control}
        label="Senha"
        name="password"
        placeholder="Senha"
        useLayoutAnimation={false}
      />

      <CheckboxField
        control={control}
        label="Manter-me conectado"
        name="requestRefresh"
        useLayoutAnimation={false}
      />

      <View className="w-full gap-4">
        <Button
          text="Entrar"
          useLayoutAnimation={false}
          onPress={handleSubmit(login)}
        />

        <Button
          wired
          withoutDelay
          text="Alterar tema"
          useLayoutAnimation={false}
          onPress={toggleTheme}
        />
      </View>

      <Pressable
        className="absolute right-0 bottom-8 left-0 h-4 items-center justify-center"
        onPress={() => setShowUpdateId(!showUpdateId)}
      >
        {showUpdateId && (
          <Text className="text-xs text-neutral-600">{updateId}</Text>
        )}
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default Login;
