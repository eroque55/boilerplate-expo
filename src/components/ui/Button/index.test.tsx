import { fireEvent, renderWithProviders, screen } from '@/test/utils';

import Button from './index';

describe('Button', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the given text', async () => {
    await renderWithProviders(<Button text="Entrar" />);

    expect(screen.getByText('Entrar')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <Button testID="button" text="Entrar" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByTestId('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ignores repeated presses during the blocking delay', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <Button testID="button" text="Entrar" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByTestId('button'));
    await fireEvent.press(screen.getByTestId('button'));
    await fireEvent.press(screen.getByTestId('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('allows consecutive presses when withoutDelay is set', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <Button withoutDelay testID="button" text="Entrar" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByTestId('button'));
    await fireEvent.press(screen.getByTestId('button'));

    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it('shows the loading indicator when isLoading', async () => {
    await renderWithProviders(<Button isLoading text="Entrar" />);

    expect(screen.getByTestId('button-activity-indicator')).toBeOnTheScreen();
  });

  it('does not show the indicator when not loading', async () => {
    await renderWithProviders(<Button text="Entrar" />);

    expect(screen.queryByTestId('button-activity-indicator')).toBeNull();
  });
});
