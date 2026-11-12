import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';

const Root = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Redirect href={user ? '/(main)/home' : '/(auth)/login'} />;
};

export default Root;
