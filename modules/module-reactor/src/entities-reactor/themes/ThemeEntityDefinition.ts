import { Theme } from '../../stores/themes/ThemeStore';
import { EntityDefinition } from '../../entities/EntityDefinition';
import { EntityDescriberComponent } from '../../entities/components/meta/EntityDescriberComponent';
import { InlineEntityEncoderComponent } from '../../entities/components/encoder/InlineEntityEncoderComponent';
import { SimpleEntitySearchEngineComponent } from '../../entities/components/search/SimpleEntitySearchEngineComponent';
import { ReactorEntities, ReactorEntityCategories } from '../ReactorEntities';

interface EncodedTheme {
  key: string;
}

export class ThemeEntityDefinition extends EntityDefinition<Theme> {
  constructor() {
    super({
      type: ReactorEntities.THEME,
      category: ReactorEntityCategories.CORE,
      label: 'Theme',
      icon: 'paint-brush',
      iconColor: 'orange'
    });

    this.registerComponent(
      new EntityDescriberComponent<Theme>({
        label: 'Simple',
        describe: (entity: Theme) => {
          return {
            simpleName: entity.label,
            complexName: entity.light ? 'Light theme' : 'Dark theme'
          };
        }
      })
    );

    this.registerComponent(
      new InlineEntityEncoderComponent<Theme, EncodedTheme>({
        version: 1,
        encode: (entity) => {
          return { key: entity.key };
        },
        decode: async (entity) => {
          return this.themeStore.getThemeByKey(entity.key);
        }
      })
    );

    this.registerComponent(
      new SimpleEntitySearchEngineComponent<Theme>({
        label: 'Themes',
        getEntities: async () => {
          return this.themeStore.getThemes();
        }
      })
    );
  }

  getEntityUID(theme: Theme): string {
    return theme.key;
  }

  matchEntity(entity: any): boolean {
    return entity instanceof Theme;
  }
}
