import * as React from 'react';
import { useEffect, useState } from 'react';
import { KeysTableWidget } from './KeysTableWidget';
import { PanelButtonWidget } from '../../../widgets/forms/PanelButtonWidget';
import { ioc } from '../../../inversify.config';
import { ShortcutStore } from '../../../stores/shortcuts/ShortcutStore';
import { LoadingPanelWidget } from '../../../widgets/panel/panel/LoadingPanelWidget';
import { observer } from 'mobx-react';
import { CheckboxLabelWidget } from '../../../widgets/forms/CheckboxLabelWidget';
import { ExportShortcutsAction } from '../../../actions/builtin-actions/shortcuts/ExportShortcutsAction';
import { ImportShortcutsAction } from '../../../actions/builtin-actions/shortcuts/ImportShortcutsAction';
import { ResetShortcutsAction } from '../../../actions/builtin-actions/shortcuts/ResetShortcutsAction';
import { getScrollableCSS, PANEL_CONTENT_PADDING } from '../../../widgets';
import { styled } from '../../../stores/themes/reactor-theme-fragment';

namespace S {
  export const Container = styled.div`
    overflow: auto;
    height: 100%;
    padding: ${PANEL_CONTENT_PADDING}px;
    ${(p) => getScrollableCSS(p.theme)};
  `;

  export const Button = styled(PanelButtonWidget)`
    margin-right: 5px;
  `;
}
export const KeysSettingsPanelWidget: React.FC<any> = observer(() => {
  const shortcutStore = ioc.get(ShortcutStore);

  const [loading, setLoading] = useState(false);
  const [showBoundOnly, setShowBoundOnly] = useState(false);

  useEffect(() => {
    return ResetShortcutsAction.get().registerListener({
      willFire: async () => {
        setLoading(true);
      },
      cancelled: () => {
        setLoading(false);
      },
      didFire: () => {
        setLoading(false);
      }
    });
  }, []);

  return (
    <LoadingPanelWidget
      loading={loading || !shortcutStore.isInitialized()}
      children={() => {
        return (
          <S.Container>
            <KeysTableWidget showBoundOnly={showBoundOnly}>
              <>
                <S.Button {...ExportShortcutsAction.get().representAsButton()} />
                <S.Button {...ImportShortcutsAction.get().representAsButton()} />
                <S.Button {...ResetShortcutsAction.get().representAsButton()} />
                <CheckboxLabelWidget
                  onChange={(show) => {
                    setShowBoundOnly(show);
                  }}
                  label="Show bound"
                  checked={showBoundOnly}
                />
              </>
            </KeysTableWidget>
          </S.Container>
        );
      }}
    />
  );
});
