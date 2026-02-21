import { ioc, inject } from '../../inversify.config';
import { EntityAction, EntityActionEvent } from '../parameterized/EntityAction';
import { Theme, ThemeStore } from '../../stores/themes/ThemeStore';
import { ActionStore } from '../../stores/actions/ActionStore';

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
    return ioc.get(ActionStore).getAction<ChangeThemeAction>(ChangeThemeAction.NAME);
  }
}
