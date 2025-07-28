import { autorun } from 'mobx';
import { UXStore, VisorMetadata, VisorStore } from '../stores';
import { inject } from '../inversify.config';
import { ThemeStore } from '../stores/themes/ThemeStore';
import { theme } from '../stores/themes/reactor-theme-fragment';

export class IDEStatusVisorMetadata extends VisorMetadata {
  @inject(VisorStore)
  accessor visorStore: VisorStore;

  @inject(ThemeStore)
  accessor themeStore: ThemeStore;

  constructor() {
    super({
      key: 'IDE_STATUS',
      displayName: 'Status',
      displayDefault: true
    });
  }

  init() {
    autorun(() => {
      if (this.visorStore.isLoading()) {
        const message = this.visorStore.getLatestMessage();
        this.reportValue({
          icon: {
            color: this.themeStore.getCurrentTheme(theme).status.loading,
            name: 'refresh',
            spin: true
          },
          value: message
        });
      } else {
        this.reportValue({
          icon: null,
          value: 'Idle'
        });
      }
    });
  }
}
