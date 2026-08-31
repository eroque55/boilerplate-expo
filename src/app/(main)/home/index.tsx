import { Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useDefaultModal } from '@/store/defaultModalStore';

const Home = () => {
  const { user, logout } = useAuth();
  const { openModal } = useDefaultModal();

  const handlePress = () => {
    openModal({
      title: 'Sair?',
      message: 'Tem certeza que deseja sair?',
      cancelText: 'Cancelar',
      confirmText: 'Sair',
      onConfirm: logout,
    });
  };

  return (
    <View className="flex-1 items-center justify-center gap-20 p-4">
      <View className="w-full">
        <Text className="text-base text-neutral-500 dark:text-neutral-400">
          Bem Vindo
        </Text>

        <Text className="text-lg text-neutral-800 dark:text-neutral-100">
          {user?.name}
        </Text>
      </View>

      <Button text="Sair" onPress={handlePress} />
    </View>
  );
};

export default Home;
