import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { fireEvent, renderWithProviders, screen } from '@/test/utils';
import z from '@/validation/zod';

import Button from '../Button';

import Input from './index';

const schema = z.object({
  email: z.string().min(1, 'Campo obrigatório'),
});

type Form = z.infer<typeof schema>;

type HostProps = {
  isPassword?: boolean;
  label?: string;
  placeholder?: string;
};

const FormHost = ({ isPassword, label, placeholder }: HostProps) => {
  const { control, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  return (
    <>
      <Input
        control={control}
        isPassword={isPassword}
        label={label}
        name="email"
        placeholder={placeholder}
      />

      <Button
        withoutDelay
        testID="submit"
        text="Enviar"
        onPress={handleSubmit(() => {})}
      />
    </>
  );
};

describe('Input', () => {
  it('renders the label and the placeholder', async () => {
    await renderWithProviders(
      <FormHost label="E-mail" placeholder="Digite seu e-mail" />,
    );

    expect(screen.getByText('E-mail')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeOnTheScreen();
  });

  it('updates the form value on typing', async () => {
    await renderWithProviders(<FormHost placeholder="E-mail" />);

    await fireEvent.changeText(
      screen.getByPlaceholderText('E-mail'),
      'contato@exemplo.com',
    );

    expect(screen.getByDisplayValue('contato@exemplo.com')).toBeOnTheScreen();
  });

  it('shows the validation error message', async () => {
    await renderWithProviders(<FormHost placeholder="E-mail" />);

    expect(screen.queryByText('Campo obrigatório')).toBeNull();

    await fireEvent.press(screen.getByTestId('submit'));

    expect(await screen.findByText('Campo obrigatório')).toBeOnTheScreen();
  });

  it('toggles password visibility when the eye is pressed', async () => {
    await renderWithProviders(<FormHost isPassword placeholder="Senha" />);

    expect(screen.getByPlaceholderText('Senha').props.secureTextEntry).toBe(
      true,
    );

    await fireEvent.press(screen.getByTestId('input-password-toggle'));

    expect(screen.getByPlaceholderText('Senha').props.secureTextEntry).toBe(
      false,
    );
  });
});
