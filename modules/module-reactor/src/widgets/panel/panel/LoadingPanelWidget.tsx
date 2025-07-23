import * as React from 'react';
import styled from '@emotion/styled';
import { ioc, inject } from '../../../inversify.config';
import { BarLoader } from 'react-spinners';
import { observer, Observer } from 'mobx-react';
import { ThemeStore } from '../../../stores/themes/ThemeStore';
import { theme } from '../../../stores/themes/reactor-theme-fragment';

export interface LoadingPanelWidgetProps {
  children: () => React.JSX.Element;
  loading: boolean;
  className?;
}

namespace S {
  export const Loading = styled.div`
    background: var(--panels-background);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    min-width: 200px;
    width: 100%;
    height: 100%;
  `;
}

export const LoadingPanelWidget: React.FC<LoadingPanelWidgetProps> = observer((props) => {
  const themeStore = ioc.get(ThemeStore);

  if (props.loading) {
    return (
      <S.Loading className={props.className}>
        <BarLoader width={100} height={5} color={themeStore.getCurrentTheme(theme).header.primary} loading={true} />
      </S.Loading>
    );
  }
  return (
    <Observer
      children={() => {
        return props.children();
      }}
    />
  );
});
