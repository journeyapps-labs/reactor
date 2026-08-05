import { describe, expect, it } from 'vitest';
import { BooleanSetting } from '../../src/settings/BooleanSetting';
import { EntitySetting } from '../../src/settings/EntitySetting';

describe('AbstractUserSetting defaults', () => {
  it('applies an updated default before initialization', async () => {
    const setting = new BooleanSetting({
      key: 'boolean-default',
      checked: true
    });

    setting.setDefault(false);

    expect(setting.checked).toBe(false);
    await setting.init();
    expect(setting.checked).toBe(false);
  });

  it('does not replace deserialized state with a late default', async () => {
    const setting = new BooleanSetting({
      key: 'boolean-deserialized',
      checked: true
    });

    setting.doDeserialize({ checked: true });
    setting.setDefault(false);

    expect(setting.checked).toBe(true);
    await setting.init();
    expect(setting.checked).toBe(true);

    setting.reset();
    expect(setting.checked).toBe(false);
  });

  it('uses an updated entity default when reset', async () => {
    const initial = { id: 'initial' };
    const updated = { id: 'updated' };
    const selected = { id: 'selected' };
    const setting = new EntitySetting({
      key: 'entity-default',
      type: 'test-entity',
      defaultEntity: initial
    });

    await setting.init();
    setting.setItem(selected);
    setting.updateOptions({ defaultEntity: updated });

    expect(setting.entity).toEqual(selected);
    setting.reset();
    expect(setting.entity).toEqual(updated);
  });
});
