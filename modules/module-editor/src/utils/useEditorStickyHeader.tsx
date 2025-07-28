import * as monaco from 'monaco-editor';
import { useEffect, useState } from 'react';
import * as _ from 'lodash';

export interface UseEditorStickyHeaderOptions {
  editor: monaco.editor.IStandaloneCodeEditor;
}

export const useEditorStickyHeader = (props: UseEditorStickyHeaderOptions) => {
  const [zIndex, setZIndex] = useState<number>();
  const [lines, setLines] = useState(0);

  useEffect(() => {
    if (props.editor) {
      const compute = _.debounce(() => {
        let element = props.editor.getContainerDomNode().querySelector('.sticky-widget');
        if (element) {
          _.defer(() => {
            let lines = element.querySelector('.sticky-widget-lines')?.childNodes || [];
            setZIndex((element.computedStyleMap().get('z-index') as any)?.value);
            setLines(lines.length);
          });
        }
      }, 200);

      // could already be on scrolled sticky state
      let res = setTimeout(() => {
        compute();
        res = null;
      }, 500);

      const l1 = props.editor.onDidScrollChange(() => {
        compute();
      });
      const l2 = props.editor.onDidDispose(() => {
        l1.dispose();
        l2.dispose();
      });

      return () => {
        l1.dispose();
        l2.dispose();
        if (res) {
          clearTimeout(res);
        }
      };
    }
  }, [props.editor]);

  return {
    zIndex,
    lines
  };
};
