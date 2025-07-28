import * as React from 'react';
import { editor } from 'monaco-editor';
import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import ITextModel = editor.ITextModel;
import { DARK_THEME } from '../theme/theme-utils';

export interface MonacoEditorWidgetProps {
  className?: any;
  model: ITextModel;
  options: editor.IStandaloneEditorConstructionOptions;
  editorDidMount?: (editor: editor.IStandaloneCodeEditor) => any;
}

export const MonacoEditorWidget: React.FC<MonacoEditorWidgetProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const editorRef = editor.create(ref.current, {
      ...props.options,
      model: props.model,
      value: null,
      theme: DARK_THEME
    });
    props.editorDidMount?.(editorRef);
    return () => {
      editorRef.dispose();
    };
  }, []);

  return <S.Container className={props.className} ref={ref}></S.Container>;
};
namespace S {
  export const Container = styled.div`
    width: 100%;
    height: 100%;

    .monaco-editor {
      outline: none;
    }
  `;
}
