import * as React from 'react';
import { FloatingPanelWidget } from '../../widgets/floating/FloatingPanelWidget';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { FloatingPanelButtonWidget } from '../../widgets/floating/FloatingPanelButtonWidget';
import { Btn } from '../../definitions/common';
import * as _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inject } from '../../inversify.config';
import { ComboBoxItem } from '../../stores/combo/ComboBoxDirectives';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { DialogButtonStyle } from '../../stores/DialogStore';
import { AttentionWrapperWidget } from '../../widgets/guide/AttentionWrapperWidget';
import { ReactorComponentType } from '../../stores/guide/selections/common';
import { PanelButtonWidget } from '../../widgets/forms/PanelButtonWidget';
import {
  REACTOR_MOBILE_MEDIA_QUERY,
  ReactorViewportMode,
  useReactorViewportMode
} from '../../hooks/useReactorViewportMode';
import { MarkdownWidget } from '../../widgets/markdown/MarkdownWidget';

export interface DialogWidgetProps {
  title: string;
  desc?: string;
  markdown?: string;
  btns: Btn[];
  buttonStyle?: DialogButtonStyle;
  disableDescriptionOpacity?: boolean;
  menuItems?: ComboBoxItem[];
  menuItemSelected?: (selected: ComboBoxItem) => any;
  className?: any;
}

namespace S {
  export const Container = themed.form`
    padding: 20px;
    min-width: 400px;
    box-sizing: border-box;
    max-height: 90vh;
    min-height: 0;
    display: flex;
    flex-direction: column;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      box-sizing: border-box;
      width: 100%;
      min-width: 0;
      max-height: calc(100vh - 28px);
      padding: 18px;
      display: flex;
      flex-direction: column;
    }
  `;

  export const TitleContainer = themed.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    flex-shrink: 0;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      align-items: flex-start;
      margin-bottom: 14px;
    }
  `;
  export const Title = themed.div`
    font-size: 25px;
    color: ${(p) => p.theme.combobox.text};
    user-select: none;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 28px;
      line-height: 1.15;
    }
  `;

  export const ContextIcon = themed.div`
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: ${(p) => p.theme.button.icon};
  `;

  export const Desc = themed.div<{ disableOpacity?: boolean }>`
    font-size: 14px;
    color: ${(p) => p.theme.text.secondary};
    margin-bottom: 20px;
    max-width: 400px;
    user-select: none;
    flex-shrink: 0;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      max-width: none;
      font-size: 16px;
      margin-bottom: 16px;
    }
  `;
  export const Content = themed.div`
    margin-bottom: 10px;
    min-height: 0;
    overflow: auto;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      margin-bottom: 16px;
    }
  `;
  export const Bottom = themed.div`
    display: flex;
    justify-content: flex-end;
    column-gap: 5px;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      flex-shrink: 0;
      column-gap: 8px;
    }
  `;

  export const MobileOverlay = themed.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 14px;
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  `;

  export const MobilePanel = themed.div<{ highlight: boolean }>`
    width: 100%;
    max-width: calc(100vw - 28px);
    max-height: calc(100vh - 28px);
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: ${(p) => p.theme.combobox.background};
    border: solid ${(p) => (p.highlight ? '2px' : '1px')} ${(p) => (p.highlight ? p.theme.guide.accent : p.theme.combobox.border)};
    border-radius: 10px;
    box-shadow: 0 0 20px ${(p) => p.theme.combobox.shadowColor};

    *::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      padding-left: 3px;
    }
    *::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      border-left: solid 2px ${(p) => p.theme.combobox.background};
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
    }
    *::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
}

interface DialogPanelWidgetProps {
  selected: object | null;
  forwardRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const DialogPanelWidget: React.FC<DialogPanelWidgetProps> = (props) => {
  const viewportMode = useReactorViewportMode();
  const preventLayerDismissal = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  if (viewportMode === ReactorViewportMode.MOBILE) {
    return (
      <S.MobileOverlay>
        <S.MobilePanel
          ref={props.forwardRef}
          highlight={!!props.selected}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
          }}
          onMouseDown={preventLayerDismissal}
        >
          {props.children}
        </S.MobilePanel>
      </S.MobileOverlay>
    );
  }

  return (
    <FloatingPanelWidget highlight={!!props.selected} forwardRef={props.forwardRef} center={true}>
      {props.children}
    </FloatingPanelWidget>
  );
};

export class DialogWidget extends React.Component<React.PropsWithChildren<DialogWidgetProps>> {
  @inject(ComboBoxStore)
  accessor comboBoxStore: ComboBoxStore;

  ref: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    return (
      <AttentionWrapperWidget
        forwardRef={this.ref}
        type={ReactorComponentType.DIALOG}
        boundsMutator={(bounds) => {
          return {
            ...bounds,
            height: bounds.height + 10
          };
        }}
        activated={(selected) => {
          return (
            <DialogPanelWidget selected={selected} forwardRef={this.ref}>
              <S.Container
                className={this.props.className}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <S.TitleContainer>
                  <S.Title>{this.props.title}</S.Title>
                  {this.props.menuItems?.length > 0 ? (
                    <S.ContextIcon
                      onClick={async (event) => {
                        event.stopPropagation();
                        event.persist();
                        const selection = await this.comboBoxStore.showComboBox(this.props.menuItems, event);
                        if (selection) {
                          this.props.menuItemSelected(selection);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon="ellipsis-v" />
                    </S.ContextIcon>
                  ) : null}
                </S.TitleContainer>
                <S.Desc disableOpacity={this.props.disableDescriptionOpacity}>
                  {this.props.desc?.split('\n').map((line, index) => {
                    return <p key={`line_${index}`}>{line}</p>;
                  })}
                  {this.props.markdown ? <MarkdownWidget markdown={this.props.markdown} /> : null}
                </S.Desc>
                <S.Content>{this.props.children}</S.Content>
                <S.Bottom>
                  {_.map(this.props.btns, (btn, index) => {
                    const key = `${btn.tooltip || btn.label}_${index}`;
                    if (this.props.buttonStyle === DialogButtonStyle.PANEL) {
                      return <PanelButtonWidget key={key} {...btn} />;
                    }

                    return <FloatingPanelButtonWidget key={key} btn={btn} />;
                  })}
                </S.Bottom>
              </S.Container>
            </DialogPanelWidget>
          );
        }}
      />
    );
  }
}
