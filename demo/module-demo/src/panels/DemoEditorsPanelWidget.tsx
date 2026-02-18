import * as React from 'react';
import { observer } from 'mobx-react';
import {
  CardWidget,
  MetadataWidget,
  PanelButtonMode,
  PanelButtonWidget,
  ReactorPanelModel,
  styled
} from '@journeyapps-labs/reactor-mod';
import { DualEditorWidget, EditorWidget, SimpleEditorWidget } from '@journeyapps-labs/reactor-mod-editor';
import { editor, Uri } from 'monaco-editor';
import { v4 } from 'uuid';

export interface DemoEditorsPanelWidgetProps {
  model: ReactorPanelModel;
}

const STANDARD_EDITOR_INITIAL = `{
  "name": "editor-playground",
  "featureFlags": {
    "dualEditor": true,
    "readOnlyPreview": true
  },
  "theme": "reactor-dark"
}`;

const SIMPLE_EDITOR_SNIPPET = `const createPanel = (name) => ({
  id: name.toLowerCase().replace(/\\s+/g, '-'),
  title: name,
  kind: 'demo'
});`;

const DIFF_ORIGINAL = `function formatTodoLabel(label) {
  return label.trim();
}

const todo = formatTodoLabel("Write docs");
`;

const DIFF_UPDATED = `function formatTodoLabel(label) {
  return label.trim().toUpperCase();
}

const todo = formatTodoLabel("Write docs");
console.log({ todo });
`;

export const DemoEditorsPanelWidget: React.FC<DemoEditorsPanelWidgetProps> = observer(() => {
  const [configModel] = React.useState(() => {
    return editor.createModel(STANDARD_EDITOR_INITIAL, 'json', Uri.parse(`${v4()}/demo/editors/config.json`));
  });

  React.useEffect(() => {
    return () => {
      configModel.dispose();
    };
  }, [configModel]);

  const resetModel = React.useCallback(() => {
    configModel.setValue(STANDARD_EDITOR_INITIAL);
  }, [configModel]);

  return (
    <S.Container>
      <CardWidget
        title="Standard editor widgets"
        subHeading="Editable editor plus a compact read-only snippet"
        sections={[
          {
            key: 'standard-editor',
            content: () => {
              return (
                <>
                  <S.EditorFrame>
                    <EditorWidget model={configModel} options={{ minimap: { enabled: false }, fontSize: 13 }} />
                  </S.EditorFrame>
                  <S.Buttons>
                    <PanelButtonWidget
                      label="Reset editable editor"
                      icon="redo"
                      mode={PanelButtonMode.PRIMARY}
                      action={resetModel}
                    />
                  </S.Buttons>
                </>
              );
            }
          },
          {
            key: 'simple-editor',
            content: () => {
              return (
                <S.SimpleEditorFrame>
                  <SimpleEditorWidget text={SIMPLE_EDITOR_SNIPPET} lang="javascript" path="demo/snippet.js" />
                </S.SimpleEditorFrame>
              );
            }
          }
        ]}
      />

      <CardWidget
        title="Dual editor widget"
        subHeading="Side-by-side diff preview with custom headers"
        sections={[
          {
            key: 'dual-editor',
            content: () => {
              return (
                <S.DualEditorFrame>
                  <DualEditorWidget
                    original={DIFF_ORIGINAL}
                    value={DIFF_UPDATED}
                    language="javascript"
                    options={{
                      readOnly: true,
                      minimap: {
                        enabled: false
                      },
                      renderOverviewRuler: false
                    }}
                    getLeftHeaderContent={() => (
                      <S.HeaderContent>
                        <MetadataWidget label="Side" value="Original" color="orange" />
                        <MetadataWidget label="State" value="Baseline" color="gray" />
                      </S.HeaderContent>
                    )}
                    getRightHeaderContent={() => (
                      <S.HeaderContent>
                        <MetadataWidget label="Side" value="Updated" color="cyan" />
                        <MetadataWidget label="State" value="Proposed" color="green" />
                      </S.HeaderContent>
                    )}
                  />
                </S.DualEditorFrame>
              );
            }
          }
        ]}
      />
    </S.Container>
  );
});

namespace S {
  export const Container = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    min-height: 100%;
    box-sizing: border-box;
  `;

  export const Buttons = styled.div`
    margin-top: 10px;
    display: flex;
    gap: 8px;
  `;

  export const EditorFrame = styled.div`
    position: relative;
    height: 260px;
    border: solid 1px ${(p) => p.theme.panels.divider};
    border-radius: 6px;
    overflow: hidden;
  `;

  export const SimpleEditorFrame = styled.div`
    border: solid 1px ${(p) => p.theme.panels.divider};
    border-radius: 6px;
    overflow: hidden;
    padding: 6px 8px;
  `;

  export const DualEditorFrame = styled.div`
    position: relative;
    height: 300px;
    border: solid 1px ${(p) => p.theme.panels.divider};
    border-radius: 6px;
    overflow: hidden;
  `;

  export const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
  `;
}
