import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { size, Size, useReactorSize } from '../../hooks/useReactorSize';

export interface MarkdownWidgetProps {
  markdown: string;
  className?: string;
  size?: Size;
}

const MarkdownContainer = themed.div<{ $size: Size }>`
  color: ${(p) => p.theme.text.primary};
  font-size: ${(p) => size(p, ['13px', '15px', '17px'])};
  line-height: ${(p) => size(p, ['18px', '21px', '24px'])};

  a {
    color: ${(p) => p.theme.guide.accent};
    text-decoration: none;
    white-space: nowrap;
  }

  p {
    margin: 0 0 ${(p) => size(p, ['8px', '10px', '12px'])};

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    margin: 0 0 ${(p) => size(p, ['8px', '10px', '12px'])};
    padding-left: ${(p) => size(p, ['18px', '21px', '24px'])};
  }

  li {
    margin: ${(p) => size(p, ['2px', '3px', '4px'])} 0;
  }
`;

export const MarkdownWidget: React.FC<MarkdownWidgetProps> = (props) => {
  const size = useReactorSize(props.size);
  return (
    <MarkdownContainer className={props.className} $size={size}>
      <ReactMarkdown rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}>{props.markdown}</ReactMarkdown>
    </MarkdownContainer>
  );
};
