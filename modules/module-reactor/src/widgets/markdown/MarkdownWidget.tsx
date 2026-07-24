import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import { themed } from '../../stores/themes/reactor-theme-fragment';
import { Size, useReactorSize } from '../../hooks/useReactorSize';

export interface MarkdownWidgetProps {
  markdown: string;
  className?: string;
  size?: Size;
}

const MarkdownContainer = themed.div<{ $size: Size }>`
  color: ${(p) => p.theme.text.primary};
  font-size: ${(p) => (p.$size === Size.SMALL ? '13px' : p.$size === Size.LARGE ? '17px' : '15px')};
  line-height: ${(p) => (p.$size === Size.SMALL ? '18px' : p.$size === Size.LARGE ? '24px' : '21px')};

  a {
    color: ${(p) => p.theme.guide.accent};
    text-decoration: none;
    white-space: nowrap;
  }

  p {
    margin: 0 0 ${(p) => (p.$size === Size.SMALL ? '8px' : p.$size === Size.LARGE ? '12px' : '10px')};

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  ul,
  ol {
    margin: 0 0 ${(p) => (p.$size === Size.SMALL ? '8px' : p.$size === Size.LARGE ? '12px' : '10px')};
    padding-left: ${(p) => (p.$size === Size.SMALL ? '18px' : p.$size === Size.LARGE ? '24px' : '21px')};
  }

  li {
    margin: ${(p) => (p.$size === Size.SMALL ? '2px' : p.$size === Size.LARGE ? '4px' : '3px')} 0;
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
