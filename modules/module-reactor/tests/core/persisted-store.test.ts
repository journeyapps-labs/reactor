import { describe, expect, it, vi } from 'vitest';
import { AbstractPersistedStore } from '../../src/stores/AbstractPersistedStore';
import { AbstractSerializer } from '../../src/stores/serializers/AbstractSerializer';

interface TestState {
  value: string;
}

class TestSerializer extends AbstractSerializer<TestState> {
  readonly serialize = vi.fn(async (_data: TestState) => true);

  async deserialize() {
    return { value: 'restored' };
  }

  dispose() {}
}

class TestPersistedStore extends AbstractPersistedStore<TestState> {
  value = 'initial';
  initializedWith: string;

  constructor(readonly serializer: TestSerializer) {
    super({ name: 'PERSISTED_TEST_STORE', serializer });
  }

  protected serialize(): TestState {
    return { value: this.value };
  }

  protected async deserialize(data: TestState) {
    this.value = data.value;
  }

  protected async _initPersisted() {
    this.initializedWith = this.value;
  }
}

describe('AbstractPersistedStore', () => {
  it('restores state before initialization and saves current state', async () => {
    const serializer = new TestSerializer();
    const store = new TestPersistedStore(serializer);

    await store.init();
    expect(store.initializedWith).toBe('restored');

    store.value = 'updated';
    await store.save();
    expect(serializer.serialize).toHaveBeenCalledWith({ value: 'updated' });
  });
});
