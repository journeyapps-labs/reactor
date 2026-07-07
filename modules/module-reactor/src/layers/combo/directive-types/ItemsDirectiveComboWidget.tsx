import * as React from 'react';
import { FloatingPanelWidget } from '../../../widgets/floating/FloatingPanelWidget';
import { ComboBoxWidget } from '../ComboBoxWidget';
import { ComboBoxItem, UIItemsDirective } from '../../../stores/combo/ComboBoxDirectives';
import { MousePosition } from '../SmartPositionWidget';
import { SmartPositionWidget } from '../SmartPositionWidget';
import { themed } from '../../../stores/themes/reactor-theme-fragment';
import { REACTOR_MOBILE_MEDIA_QUERY } from '../../../hooks/useReactorViewportMode';

export interface ItemsDirectiveComboWidgetProps {
  directive: UIItemsDirective;
  resolve: (item: ComboBoxItem, event: MousePosition) => any;
}

namespace S {
  export const Title = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 15px;
    font-weight: 500;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 22px;
    }
  `;

  export const Title2 = themed.div`
    color: ${(p) => p.theme.combobox.text};
    font-size: 12px;
    font-weight: 500;
    opacity: 0.5;
    padding-top: 3px;

    ${REACTOR_MOBILE_MEDIA_QUERY} {
      font-size: 16px;
    }
  `;
  export const Meta = themed.div`
    padding: 5px 10px;
  `;
}

export class ItemsDirectiveComboWidget extends React.Component<ItemsDirectiveComboWidgetProps> {
  getTitle() {
    if (this.props.directive.title || this.props.directive.title2) {
      return (
        <S.Meta>
          {this.props.directive?.title ? <S.Title>{this.props.directive?.title}</S.Title> : null}
          {this.props.directive?.title2 ? <S.Title2>{this.props.directive?.title2}</S.Title2> : null}
        </S.Meta>
      );
    }
    return null;
  }

  render() {
    return (
      <SmartPositionWidget position={this.props.directive.position} centerOnMobile>
        <FloatingPanelWidget center={false} scaleInOnMobile>
          {this.getTitle()}
          <ComboBoxWidget items={this.props.directive.items} selected={this.props.resolve} />
        </FloatingPanelWidget>
      </SmartPositionWidget>
    );
  }
}
