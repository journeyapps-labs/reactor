import { expect, test } from 'vitest';
import { TokenWrapper } from '../src/TokenWrapper';

test('token wrapper error', async () => {
  const wrapper = new TokenWrapper(async () => {
    throw new Error('error');
  }, 100);

  await expect(async () => {
    await wrapper.getToken();
  }).rejects.toThrowError();
});

test('token wrapper expire', async () => {
  const wrapper = new TokenWrapper(async () => {
    return await new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }, 100);

  await expect(async () => {
    await wrapper.getToken();
  }).rejects.toThrowError('Provision timeout');
});
