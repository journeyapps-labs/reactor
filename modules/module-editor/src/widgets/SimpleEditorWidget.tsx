import * as React from 'react';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { EditorWidget } from './EditorWidget';
import { editor, Uri } from 'monaco-editor';
import createModel = editor.createModel;
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
import { v4 } from 'uuid';

export interface SimpleEditorWidgetProps {
  text: string;
  lang: string;
  path: string;
  className?: any;
}

export const SimpleEditorWidget: React.FC<SimpleEditorWidgetProps> = (props) => {
  const [height, setHeight] = useState(0);
  const [model] = useState(() => {
    // For simple read-only editors: we add entropy here to allow panels to be moved around which would otherwise cause
    // race conditions with 'model already exists' errors.
    // good to know: this problem is solved for shared models in other ways with more complex panel lifecycle logic
    const uri = Uri.parse(`${v4()}/${props.path}`);
    return createModel(props.text, props.lang, uri);
  });
  useEffect(() => {
    return () => {
      model.dispose();
    };
  }, [model]);

  return (
    <S.Container height={height} className={props.className}>
      <EditorWidget
        options={{
          readOnly: true,
          scrollBeyondLastLine: false,
          glyphMargin: false,
          minimap: {
            enabled: false
          },
          guides: {
            indentation: false
          },
          scrollbar: {
            horizontal: 'hidden',
            vertical: 'hidden',
            alwaysConsumeMouseWheel: false
          },
          overviewRulerLanes: 0,
          occurrencesHighlight: 'off'
        }}
        model={model}
        events={{
          getEditor: (editor: IStandaloneCodeEditor) => {
            setHeight(editor.getContentHeight());
          }
        }}
      />
    </S.Container>
  );
};
namespace S {
  export const Container = styled.div<{ height: number }>`
    height: ${(p) => p.height}px;
    box-sizing: border-box;
    overflow: hidden;

    .monaco-editor {
      outline: none;
      .margin {
        background-color: transparent !important;
      }
      .cursors-layer .cursor {
        display: none;
      }
    }
  `;
}
