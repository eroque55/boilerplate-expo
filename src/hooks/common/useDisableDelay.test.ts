import { act, renderHook } from '@testing-library/react-native';

import { useDisableDelay } from './useDisableDelay';

describe('useDisableDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('runs the function and flags loading', async () => {
    const fn = jest.fn();
    const { result } = await renderHook(() => useDisableDelay());

    await act(async () => {
      await result.current.executeWithDelay(fn);
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(true);
  });

  it('ignores calls while the previous delay has not elapsed', async () => {
    const fn = jest.fn();
    const { result } = await renderHook(() => useDisableDelay());

    await act(async () => {
      await result.current.executeWithDelay(fn);
      await result.current.executeWithDelay(fn);
      await result.current.executeWithDelay(fn);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows new calls after the delay', async () => {
    const fn = jest.fn();
    const { result } = await renderHook(() => useDisableDelay(1000));

    await act(async () => {
      await result.current.executeWithDelay(fn);
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.executeWithDelay(fn);
    });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('clears the pending timer on unmount', async () => {
    const fn = jest.fn();
    const clearSpy = jest.spyOn(globalThis, 'clearTimeout');
    const { result, unmount } = await renderHook(() => useDisableDelay(1000));

    await act(async () => {
      await result.current.executeWithDelay(fn);
    });

    clearSpy.mockClear();
    await unmount();

    expect(clearSpy).toHaveBeenCalled();

    clearSpy.mockRestore();
  });
});
