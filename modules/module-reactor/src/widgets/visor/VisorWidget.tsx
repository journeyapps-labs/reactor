import * as React from 'react';
import * as _ from 'lodash';
import styled from '@emotion/styled';
import { MetadataWidget } from '../meta/MetadataWidget';
import { IconWidget } from '../icons/IconWidget';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { VisorMetadataControl } from '../../settings/VisorMetadataControl';
import { ComboBoxStore } from '../../stores/combo/ComboBoxStore';
import { VisorStore } from '../../stores/visor/VisorStore';
import { VisorMetadata } from '../../stores/visor/VisorMetadata';
import { themed } from '../../stores/themes/reactor-theme-fragment';

export interface VisorWidgetProps {
  metadata: VisorMetadata[];
}

namespace S {
  export const Visor = themed.div`
    height: 28px;
    align-self: center;
    margin-right: 5px;
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    align-items: center;
    overflow: hidden;
    flex-grow: 1;
    flex-shrink: 1;
  `;

  export const Container = styled.div`
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    min-width: 700px;
  `;

  export const Metadata = styled(MetadataWidget)`
    margin-right: 6px;
  `;

  export const Icon = styled(IconWidget)`
    color: white;
    font-size: 12px;
  `;

  export const IconContainer = styled.div`
    width: 22px;
    height: 22px;
    background: rgba(0, 0, 0, 0.1);
    margin-right: 5px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    opacity: 0.6;
    flex-shrink: 0;

    &:hover {
      opacity: 1;
    }
  `;
}

@observer
export class VisorWidget extends React.Component<VisorWidgetProps> {
  @inject(ComboBoxStore)
  accessor comboBox: ComboBoxStore;

  @inject(VisorStore)
  accessor visorStore: VisorStore;

  render() {
    return (
      <S.Container>
        <S.IconContainer
          aria-label="Configure footer"
          data-balloon-pos="up-left"
          onClick={async (event) => {
            const control = VisorMetadataControl.get();
            const items = await this.comboBox.showMultiSelectComboBox(
              this.visorStore.activeMetaData.map((m) => {
                return {
                  title: m.configurationName,
                  key: m.options.key,
                  checked: control.items.has(m.options.key)
                };
              }),
              event
            );

            control.setItems(
              items.map((i) => {
                return this.visorStore.getMetadata(i.key);
              })
            );
          }}
        >
          <S.Icon icon="cog" />
        </S.IconContainer>
        <S.Visor>
          {_.map(this.props.metadata, (datum) => {
            if (!datum.currentInstance) {
              return null;
            }
            return <S.Metadata key={datum.options.key} {...datum.currentInstance} />;
          })}
        </S.Visor>
      </S.Container>
    );
  }
}
