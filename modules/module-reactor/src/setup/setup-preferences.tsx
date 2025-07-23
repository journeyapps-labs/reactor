import { ioc } from '../inversify.config';
import { PrefsCatgories, PrefsStore } from '../stores/PrefsStore';
import { BooleanSetting } from '../settings/BooleanSetting';
import { ToolbarPosition, ToolbarPreference } from '../settings/ToolbarPreference';
import * as React from 'react';
import { ToolbarWidget } from '../widgets/toolbar/ToolbarWidget';
import { Alignment, Toolbar, UXStore } from '../stores/UXStore';
import { AdvancedWorkspacePreference } from '../preferences/AdvancedWorkspacePreference';
import { LargerCMDPalletSetting } from '../preferences/LargerCMDPalletSetting';
import { KeysSettingsPanelWidget } from '../panels/settings/keys/KeysSettingsPanelWidget';
import { UserSettingsWidget } from '../panels/settings/user-settings/UserSettingsWidget';
import { ShowChangelogSetting } from '../preferences/ShowChangelogSetting';
import { VisorMetadataControl } from '../settings/VisorMetadataControl';
import { DateFormatPreference } from '../preferences/DateFormatPreference';
import { DateLocalSetting } from '../preferences/DateLocalSetting';
import { DateShowZoneSetting } from '../preferences/DateShowZoneSetting';

export enum CorePreferences {
  LEFT_TOOLBAR = '/toolbars/left',
  RIGHT_TOOLBAR = '/toolbars/right'
}

export const setupPrefs = () => {
  const prefsStore = ioc.get(PrefsStore);
  const uxStore = ioc.get(UXStore);

  prefsStore.registerPreference(new ToolbarPreference(ToolbarPosition.HEADER_RIGHT));
  prefsStore.registerPreference(new ToolbarPreference(ToolbarPosition.LEFT));
  prefsStore.registerPreference(new ToolbarPreference(ToolbarPosition.RIGHT));
  prefsStore.registerPreference(new LargerCMDPalletSetting());
  prefsStore.registerPreference(new ShowChangelogSetting());
  prefsStore.registerPreference(new VisorMetadataControl());

  prefsStore.registerPreferenceCategory({
    key: PrefsCatgories.USER_SETTINGS,
    name: 'User Settings',
    generateUI: () => {
      return <UserSettingsWidget />;
    }
  });
  prefsStore.registerPreferenceCategory({
    key: PrefsCatgories.KEYBOARD_SHORTCUTS,
    name: 'Keyboard Shortcuts',
    generateUI: () => {
      return <KeysSettingsPanelWidget />;
    }
  });
  // prefsStore.registerPreferenceCategory({
  //   key: PrefsCatgories.THEMES,
  //   name: 'Theme',
  //   generateUI: () => {
  //     return <ReactorThemesPanelWidget />;
  //   }
  // });

  const createToolbar = (position: Alignment): Toolbar => {
    const c = {
      [Alignment.LEFT]: ToolbarPosition.LEFT,
      [Alignment.RIGHT]: ToolbarPosition.RIGHT
    }[position];

    return {
      allignment: position,
      key: position,
      getWidget: () => {
        return (
          <ToolbarWidget
            hide={() => {
              if (position === Alignment.LEFT) {
                prefsStore.getPreference<BooleanSetting>(CorePreferences.LEFT_TOOLBAR).toggle();
              } else if (position === Alignment.RIGHT) {
                prefsStore.getPreference<BooleanSetting>(CorePreferences.RIGHT_TOOLBAR).toggle();
              }
            }}
            position={c}
            preferences={prefsStore.getPreference<ToolbarPreference>(c)}
            vertical={true}
          />
        );
      }
    };
  };

  const left = createToolbar(Alignment.LEFT);
  const right = createToolbar(Alignment.RIGHT);

  prefsStore.registerPreference(
    new BooleanSetting({
      key: CorePreferences.LEFT_TOOLBAR,
      checked: false,
      name: 'Show left toolbar',
      category: 'Workspace',
      changed: (checked) => {
        if (checked) {
          uxStore.registerToolbar(left);
        } else {
          uxStore.deregisterToolbar(Alignment.LEFT);
        }
      }
    })
  );
  prefsStore.registerPreference(
    new BooleanSetting({
      key: CorePreferences.RIGHT_TOOLBAR,
      checked: false,
      name: 'Show right toolbar',
      category: 'Workspace',
      changed: (checked) => {
        if (checked) {
          uxStore.registerToolbar(right);
        } else {
          uxStore.deregisterToolbar(Alignment.RIGHT);
        }
      }
    })
  );

  prefsStore.registerPreference(new AdvancedWorkspacePreference());
  prefsStore.registerPreference(new DateFormatPreference());
  prefsStore.registerPreference(new DateLocalSetting());
  prefsStore.registerPreference(new DateShowZoneSetting());
};
