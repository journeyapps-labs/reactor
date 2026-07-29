import { describe, expect, it } from 'vitest';
import { ComboBoxItem, SimpleComboBoxDirective } from '../../src';

const items: ComboBoxItem[] = [
  {
    key: 'developers',
    title: 'Developers',
    children: [
      { key: 'create-developer', title: 'Create developer' },
      { key: 'invite-developer', title: 'Invite developer' },
      { key: 'remove-developer', title: 'Remove developer' }
    ]
  },
  {
    key: 'projects',
    title: 'Projects',
    children: [
      { key: 'create-project', title: 'Create project' },
      { key: 'import-project', title: 'Import project' },
      { key: 'archive-project', title: 'Archive project' }
    ]
  }
];

describe('simple combobox search', () => {
  it('keeps browsing hierarchical and flattens descendant search results', () => {
    const directive = new SimpleComboBoxDirective({ items });

    expect(directive.showSearch()).toBe(true);
    expect(directive.getItems().map((item) => item.title)).toEqual(['Developers', 'Projects']);

    directive.setSearch('create developer');
    const [result] = directive.getItems();

    expect(result.title).toBe('Developers › Create developer');
    expect(result.titleMatch).toEqual({ locators: [{ locatorStart: 13, locatorEnd: 29 }] });

    directive.selectItem(result.key);
    expect(directive.getSelectedItem()?.key).toBe('create-developer');
  });
});
