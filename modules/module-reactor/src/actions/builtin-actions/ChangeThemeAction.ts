import { ioc, inject } from '../../inversify.config';
import { EntityAction, EntityActionEvent } from '../parameterized/EntityAction';
import { System } from '../../core/System';
import { Theme, ThemeStore } from '../../stores/themes/ThemeStore';

export class ChangeThemeAction extends EntityAction<Theme> {
  static NAME = 'Change theme';

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  constructor() {
    super({
      id: 'CHANGE_THEME',
      name: ChangeThemeAction.NAME,
      icon: 'moon',
      target: 'theme'
    });
  }

  async fireEvent(event: EntityActionEvent<Theme>): Promise<any> {
    this.themeStore.setSelectedTheme(event.targetEntity);
  }

  static get() {
    return ioc.get(System).getAction<ChangeThemeAction>(ChangeThemeAction.NAME);
  }
}
