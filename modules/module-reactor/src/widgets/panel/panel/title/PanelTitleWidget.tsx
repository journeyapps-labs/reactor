import * as React from 'react';
import { Btn } from '../../../../definitions/common';
import { inject, ioc } from '../../../../inversify.config';
import { WorkspaceCollectionModel, WorkspaceNodeModel } from '@projectstorm/react-workspaces-core';
import { WorkspaceStore } from '../../../../stores/workspace/WorkspaceStore';
import { AdvancedWorkspacePreference } from '../../../../preferences/AdvancedWorkspacePreference';
import { observer } from 'mobx-react';
import { AttentionWrapperWidget } from '../../../guide/AttentionWrapperWidget';
import { PanelTitleIconSimpleWidget, PanelTitleIconWidget } from './PanelTitleIconWidget';
import { WorkspaceModelContext } from '../PanelWidget';
import { ButtonComponentSelection, ReactorComponentType } from '../../../../stores/guide/selections/common';
import { ReactorPanelModel } from '../../../../stores/workspace/react-workspaces/ReactorPanelModel';
import { ComboBoxStore2 } from '../../../../stores/combo2/ComboBoxStore2';
import { SimpleComboBoxDirective } from '../../../../stores/combo2/directives/simple/SimpleComboBoxDirective';
import { styled } from '../../../../stores/themes/reactor-theme-fragment';
import { System } from '../../../../core/System';
import { IconWidget, ReactorIcon } from '../../../icons/IconWidget';
import { FloatingWindowModel } from '@projectstorm/react-workspaces-model-floating-window';
import { ReactorPanelFactory } from '../../../../stores/workspace/react-workspaces/ReactorPanelFactory';
import { ActionSource } from '../../../../actions/Action';
import { ReactorEntities } from '../../../../entities-reactor/ReactorEntities';
import { useButton } from '../../../../hooks/useButton';
import { PassiveActionValidationState } from '../../../../actions/validators/ActionValidator';

export interface PanelTitleWidgetProps {
  name: string;
  icon?: ReactorIcon;
  icon2?: ReactorIcon;
  color?: string;
  btns?: (Btn & { highlight?: boolean })[];
  active?: boolean;
  model: ReactorPanelModel;
}

namespace S {
  export const TitleName = styled.div`
    align-self: center;
    color: ${(p) => p.theme.panels.titleForeground};
    font-size: 14px;
    margin-left: 5px;
    font-weight: 500;
    white-space: nowrap;
  `;

  export const Button = styled.div<{ selected: boolean; highlight: boolean }>`
    align-self: stretch;
    padding-left: ${(p) => (p.selected ? 10 : 2)}px;
    padding-right: ${(p) => (p.selected ? 10 : 2)}px;
    margin-right: 2px;
    opacity: ${(p) => (p.highlight || p.selected ? 1 : 0.2)};
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 12px;
    border-radius: 3px;

    background: ${(p) => (p.selected ? p.theme.guide.accent : 'transparent')};
    color: ${(p) => (p.selected ? p.theme.guide.accentText : p.theme.panels.titleForeground)};

    &:hover {
      opacity: 1;
    }
  `;

  export const Buttons = styled.div`
    flex-shrink: 0;
    display: flex;
    margin-right: 5px;
    margin-left: 5px;
  `;

  export const Spacer = styled.div`
    flex-grow: 1;
  `;

  export const Title = styled.div<{ attention: boolean }>`
    width: 100%;
    display: flex;
    min-height: 30px;
    flex-shrink: 0;
    background: ${(p) => (p.attention ? 'black' : p.theme.panels.titleBackground)};
    ${(p) => (p.attention ? `border: solid 1px ${p.theme.guide.accent}; border-bottom: none` : '')};
    box-sizing: border-box;
  `;

  export const SimpleIcon = styled.div`
    width: 30px;
    height: 30px;
    position: relative;
  `;

  export const PanelMicroButtonIcon = styled(IconWidget)<{ highlight: boolean }>`
    ${(p) => (p.highlight ? `color:${p.theme.panels.itemIconColorSelected};` : ``)}
  `;
}

const PanelIconButton: React.FC<{ btn: Btn; highlight: boolean }> = ({ btn, highlight }) => {
  const { onClick, disabled, ref, validationResult } = useButton({ btn });

  if (validationResult.type === PassiveActionValidationState.DISALLOWED) {
    return null;
  }

  return (
    <AttentionWrapperWidget<ButtonComponentSelection>
      forwardRef={ref}
      selection={{
        label: btn.tooltip || btn.label
      }}
      type={ReactorComponentType.PANEL_MICRO_BUTTON}
      activated={(selected) => {
        return (
          <S.Button
            ref={ref}
            highlight={highlight && !disabled}
            selected={!!selected}
            aria-label={btn.tooltip || btn.label}
            data-balloon-pos="left"
            onClick={(event) => {
              event.persist();
              onClick(event);
            }}
          >
            <S.PanelMicroButtonIcon highlight={highlight && !disabled} icon={btn.icon} />
          </S.Button>
        );
      }}
    />
  );
};

@observer
export class PanelTitleWidget extends React.Component<PanelTitleWidgetProps> {
  @inject(ComboBoxStore2)
  accessor comboBoxStore: ComboBoxStore2;

  btn(p: Btn & { highlight?: boolean }, index) {
    return <PanelIconButton highlight={p.highlight} btn={p} key={p.tooltip || p.label || index} />;
  }

  getIconWrapped() {
    if (AdvancedWorkspacePreference.enabled()) {
      return (
        <div
          onClick={async (event) => {
            const definition = ioc.get(System).getDefinition<ReactorPanelFactory>(ReactorEntities.PANEL);
            const factoryOb = await definition.selectEntity({
              position: event,
              source: ActionSource.BUTTON,
              entity: null
            });

            if (this.props.model.parent instanceof FloatingWindowModel) {
              this.props.model.parent.setChild(factoryOb.generateModel());
            } else if (this.props.model.parent instanceof WorkspaceCollectionModel) {
              this.props.model.parent.replaceModel(this.props.model, factoryOb.generateModel());
            }
          }}
        >
          {this.getIcon()}
        </div>
      );
    }
    return this.getIcon();
  }

  getIcon() {
    if (!AdvancedWorkspacePreference.enabled()) {
      return (
        <S.SimpleIcon>
          <PanelTitleIconSimpleWidget color={this.props.color} icon={this.props.icon} icon2={this.props.icon2} />
        </S.SimpleIcon>
      );
    }
    if (this.props.icon) {
      return <PanelTitleIconWidget color={this.props.color} icon={this.props.icon} icon2={this.props.icon2} />;
    }
    return null;
  }

  render() {
    return (
      <WorkspaceModelContext.Provider value={this.props.model}>
        <S.Title
          onDoubleClick={() => {
            if (this.props.model.parent instanceof FloatingWindowModel) {
              return;
            }
            const workspaceStore = ioc.get(WorkspaceStore);
            if (workspaceStore.fullscreenModel) {
              workspaceStore.setFullscreenModel(null);
            } else {
              workspaceStore.setFullscreenModel(this.props.model);
            }
          }}
          attention={this.props.model?.grabAttention}
          onContextMenu={async (event) => {
            if (AdvancedWorkspacePreference.enabled()) {
              event.persist();
              event.preventDefault();
              await this.comboBoxStore.show(
                new SimpleComboBoxDirective({
                  event,
                  items: [
                    {
                      key: 'close',
                      title: 'Close',
                      action: async () => {
                        this.props.model.delete();
                        ioc.get(WorkspaceStore).engine.normalize();
                      }
                    },
                    {
                      key: 'tabs',
                      title: 'Convert to tabs',
                      action: async () => {
                        const tabs = ioc.get(WorkspaceStore).engine.generateReactorTabModel();
                        (this.props.model.parent as WorkspaceNodeModel).replaceModel(this.props.model, tabs);
                        tabs.addModel(this.props.model);
                      }
                    },
                    {
                      key: 'tray',
                      title: 'Convert to tray',
                      action: async () => {
                        const tray = ioc.get(WorkspaceStore).engine.generateReactorTrayModel();
                        (this.props.model.parent as WorkspaceNodeModel).replaceModel(this.props.model, tray);
                        tray.addModel(this.props.model);
                      }
                    }
                  ]
                })
              );
            }
          }}
        >
          {this.getIconWrapped()}
          <S.TitleName>{this.props.name}</S.TitleName>
          <S.Spacer />
          <S.Buttons>
            {(this.props.btns || []).map((btn, index) => {
              return this.btn(btn, index);
            })}
          </S.Buttons>
        </S.Title>
      </WorkspaceModelContext.Provider>
    );
  }
}
