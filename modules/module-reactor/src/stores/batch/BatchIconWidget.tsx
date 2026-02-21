import * as React from 'react';
import { IconWidget } from '../../widgets/icons/IconWidget';
import { ioc } from '../../inversify.config';
import { BatchStore } from './BatchStore';
import { observer } from 'mobx-react';
import { styled } from '../themes/reactor-theme-fragment';

namespace S {
  export const ICON_WIDTH = 30;

  export const DragIcon = styled(IconWidget)`
    color: ${(p) => p.theme.trees.labelColor};
    font-size: 20px;
  `;

  export const DragIconContainer = styled.div`
    background: ${(p) => p.theme.trees.selectedBackground};
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${ICON_WIDTH}px;
    height: ${ICON_WIDTH}px;
    border-radius: 5px;
    position: fixed;
    left: -${ICON_WIDTH}px;
    top: -${ICON_WIDTH}px;
  `;

  export const Count = styled.div`
    position: absolute;
    bottom: 0;
    right: 0;
    color: ${(p) => p.theme.trees.labelColor};
    background: rgba(0, 0, 0, 0.8);
    padding: 2px;
    box-sizing: border-box;
    font-size: 10px;
    font-weight: bold;
  `;
}

export const BatchIconWidget: React.FC = observer(() => {
  const store = ioc.get(BatchStore);
  const icon = store.getSelectionIcon();

  if (!icon) {
    return null;
  }

  return (
    <S.DragIconContainer ref={store.ref}>
      <S.DragIcon icon={icon} />
      <S.Count>{store.selections.length}</S.Count>
    </S.DragIconContainer>
  );
});
