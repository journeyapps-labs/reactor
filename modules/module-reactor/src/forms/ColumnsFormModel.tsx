import * as React from 'react';
import { FormModel } from './FormModel';
import { FormInput, FormInputWidget } from './FormInput';
import * as _ from 'lodash';
import styled from '@emotion/styled';

export enum ColumnsFormModelRenderMode {
  TABLE = 'table',
  DIVISIONS = 'divisions'
}

export interface ColumnsFormModelOptions {
  columnWidths?: number[];
  columnSpacing?: number;
  mode?: ColumnsFormModelRenderMode;
}

export class ColumnsFormModel<T = {}> extends FormModel<T> {
  columns: Map<FormInput, number>;

  constructor(protected options: ColumnsFormModelOptions = {}) {
    super();
    this.columns = new Map<FormInput, number>();
  }

  getMode() {
    return this.options.mode || ColumnsFormModelRenderMode.TABLE;
  }

  addInput<T extends FormInput>(input: T, column: number = 0): T {
    this.columns.set(input, column);
    const l1 = input.registerListener({
      removed: () => {
        l1();
        this.columns.delete(input);
      }
    });
    return super.addInput(input);
  }

  render(): React.JSX.Element {
    const totalColumns = Math.max(...Array.from(this.columns.values()));

    const groups = _.groupBy(this.inputs, (i) => {
      return this.columns.get(i);
    });

    const totalRows = Math.max(..._.map(groups, (g) => g.length));

    if (this.options.mode === ColumnsFormModelRenderMode.DIVISIONS) {
      return (
        <S.Columns spacing={this.options.columnSpacing}>
          {_.range(0, totalColumns + 1).map((col) => {
            return (
              <S.ColumnDiv width={this.options.columnWidths?.[col]} key={col}>
                {groups?.[col].map((entry) => {
                  return <React.Fragment key={entry.name}>{entry.renderInputWidget({ inline: false })}</React.Fragment>;
                })}
              </S.ColumnDiv>
            );
          })}
        </S.Columns>
      );
    }

    return (
      <table>
        <thead>
          <tr>
            {_.range(0, totalColumns + 1).map((col) => {
              let colOb = <S.Column width={this.options.columnWidths?.[col] || 200}></S.Column>;

              return (
                <React.Fragment key={col}>
                  {colOb}
                  {col < totalColumns + 1 ? <S.Column width={this.options.columnSpacing || 10}></S.Column> : null}
                </React.Fragment>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {_.range(0, totalRows + 1).map((row) => {
            return (
              <tr key={row}>
                {_.range(0, totalColumns + 1).map((col) => {
                  if (!groups?.[col]?.[row]) {
                    return <td key={col} />;
                  }

                  return (
                    <React.Fragment key={col}>
                      <td>
                        <S.Input key={groups[col][row].name}>
                          {groups[col][row].renderInputWidget({ inline: false })}
                        </S.Input>
                      </td>
                      {col < totalColumns + 1 ? <td></td> : null}
                    </React.Fragment>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

namespace S {
  export const Input = styled.div`
    margin-bottom: 5px;
  `;
  export const Column = styled.th<{ width: number }>`
    width: ${(p) => p.width}px;
  `;

  export const Columns = styled.div<{ spacing: number }>`
    display: flex;
    row-gap: ${(p) => p.spacing}px;
    column-gap: ${(p) => p.spacing}px;
  `;

  export const ColumnDiv = styled.div<{ width: number }>`
    min-width: ${(p) => p.width}px;
    max-width: ${(p) => p.width}px;
    display: flex;
    flex-direction: column;
    row-gap: 5px;
  `;
}
