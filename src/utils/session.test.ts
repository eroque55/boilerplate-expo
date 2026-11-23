import { session } from './session';
import { storage } from './storage';

const firstPair = { accessToken: 'access-1', refreshToken: 'refresh-1' };
const rotatedPair = { accessToken: 'access-2', refreshToken: 'refresh-2' };

describe('session', () => {
  afterEach(() => {
    session.clear();
  });

  it('keeps a non-persisted session in memory only', () => {
    session.start(firstPair, false);

    expect(session.getAccessToken()).toBe('access-1');
    expect(session.getRefreshToken()).toBe('refresh-1');
    expect(storage.contains('refreshToken')).toBe(false);
  });

  it('writes a persisted session to storage', () => {
    session.start(firstPair, true);

    expect(storage.getString('refreshToken')).toBe('refresh-1');
  });

  it('keeps a persisted session persisted after the refresh token rotates', () => {
    session.start(firstPair, true);
    session.rotate(rotatedPair);

    expect(session.getRefreshToken()).toBe('refresh-2');
    expect(storage.getString('refreshToken')).toBe('refresh-2');
  });

  it('does not persist a rotated token of a non-persisted session', () => {
    session.start(firstPair, false);
    session.rotate(rotatedPair);

    expect(session.getAccessToken()).toBe('access-2');
    expect(storage.contains('refreshToken')).toBe(false);
  });

  it('clears memory and storage', () => {
    session.start(firstPair, true);
    session.clear();

    expect(session.hasSession()).toBe(false);
    expect(storage.contains('accessToken')).toBe(false);
  });
});
