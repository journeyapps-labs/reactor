import * as React from 'react';
import styled from '@emotion/styled';
import * as _ from 'lodash';
import { SearchableTableWidget } from '../../../widgets/table/SearchableTableWidget';
import { ColorPickerWidget } from '../../../widgets/color/ColorPickerWidget';
import { ChangeThemeAction } from '../../../actions';
import { ioc } from '../../../inversify.config';
import { ThemeStore } from '../../../stores/themes/ThemeStore';
import { PanelButtonWidget } from '../../../widgets/forms/PanelButtonWidget';
import { TableRow } from '../../../widgets/table/TableWidget';
import { ColorDefinition } from '../../../stores/themes/ThemeFragment';
import { observer } from 'mobx-react';

namespace S {
  export const Container = styled.div``;

  export const Top = styled.div`
    display: flex;
    flex-grow: 1;
  `;

  export const Button = styled(PanelButtonWidget)`
    margin-left: 5px;
  `;
}

export const fromCamelCaseToSentence = _.memoize((word) =>
  _.capitalize(
    word
      .replace(/([A-Z][a-z]+)/g, ' $1')
      .replace(/([A-Z]{2,})/g, ' $1')
      .replace(/\s{2,}/g, ' ')
      .trim()
  )
);

export enum ThemeTableColumns {
  COLOR = 'color',
  LABEL = 'label'
}

export interface ReactorThemeColor extends TableRow {
  definition: ColorDefinition;
  cells: {};
}

export const ReactorThemesPanelWidget: React.FC = observer((props) => {
  const themeStore = ioc.get(ThemeStore);

  return (
    <S.Container>
      <SearchableTableWidget<ReactorThemeColor>
        columns={[
          {
            key: ThemeTableColumns.COLOR,
            display: 'Color',
            shrink: true,
            accessor: (cell, row) => {
              return <ColorPickerWidget color={cell} colorChanged={(color) => {}} />;
            }
          },
          {
            key: ThemeTableColumns.LABEL,
            display: 'Label',
            accessorSearch: (cell) => {
              return cell;
            }
          }
        ]}
        renderGroup={(event) => {
          return {
            defaultCollapsed: true,
            children: fromCamelCaseToSentence(event.rows[0]?.definition.categoryLabel)
          };
        }}
        rows={_.map(themeStore.getAllColorDefinitions(), (definition) => {
          return {
            definition: definition,
            key: `${definition.category}-${definition.key}`,
            groupKey: definition.category,
            cells: {
              [ThemeTableColumns.LABEL]: definition.label,
              [ThemeTableColumns.COLOR]: themeStore.getCurrentTheme()[definition.category][definition.key]
            }
          } as ReactorThemeColor;
        })}
      >
        <S.Top>
          <S.Button {...ChangeThemeAction.get().representAsButton()} label={themeStore.selectedTheme.entity.label} />
          <S.Button disabled={true} label={'Delete theme'} action={() => {}} />
          <S.Button disabled={false} label={'Save'} action={() => {}} />
        </S.Top>
      </SearchableTableWidget>
    </S.Container>
  );
});
