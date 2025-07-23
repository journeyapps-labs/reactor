import * as React from 'react';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { MatchesWidget } from '../../widgets/search/MatchesWidget';
import { SearchEventMatch } from '@journeyapps-labs/lib-reactor-search';

export interface IndividualSettingsWidgetProps {
  title: string;
  description?: string;
  className?: any;
  search?: SearchEventMatch;
}

namespace S {
  export const Container = styled.div`
    margin-bottom: 2px;
    border-radius: 3px;
    padding: 7px 12px;
  `;
  export const Name = styled.div`
    color: ${(p) => p.theme.text.primary};
    font-size: 16px;
    white-space: nowrap;
  `;

  export const Desc = styled.p`
    font-size: 13px;
    margin-top: 5px;
    color: ${(p) => p.theme.text.secondary};
    max-width: 400px;
  `;

  export const Top = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  export const Control = styled.div`
    padding-left: 10px;
  `;
}

export const IndividualSettingsWidget: React.FC<React.PropsWithChildren<IndividualSettingsWidgetProps>> = (props) => {
  return (
    <S.Container className={props.className}>
      <S.Top>
        <S.Name>
          {props.search ? <MatchesWidget text={props.title} locators={props.search.locators} /> : props.title}
        </S.Name>
        <S.Control>{props.children}</S.Control>
      </S.Top>
      {props.description ? <S.Desc>{props.description}</S.Desc> : null}
    </S.Container>
  );
};
