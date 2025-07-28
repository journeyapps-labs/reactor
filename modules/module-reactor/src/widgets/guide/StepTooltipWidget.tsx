import * as React from 'react';
import { styled } from '../../stores/themes/reactor-theme-fragment';
import { GuideStep } from '../../stores/guide/steps/GuideStep';
import ReactMarkdown from 'react-markdown';

export interface StepTooltipWidgetProps {
  step: GuideStep;
  label?: string;
  fullWidth?: boolean;
}

namespace S {
  export const Image = styled.img`
    width: 100%;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);
  `;

  export const Markdown = styled.div`
    color: white;
    padding: 10px;
    > * {
      padding-bottom: 20px;
      &:last-of-type {
        padding-bottom: 0px;
      }
    }
    p {
      font-size: 14px;
      color: ${(p) => p.theme.text.primary};
      max-width: 400px;
    }
    b {
      font-weight: normal;
      color: ${(p) => p.theme.guide.accent};
    }
    code {
      user-select: all;
    }
  `;

  export const Container = styled.div<{ fullWidth: boolean }>`
    padding: 5px;
    background: ${(p) => p.theme.guide.tooltipBackground};
    color: ${(p) => p.theme.guide.accentText};
    border: solid 2px ${(p) => p.theme.guide.accent};
    border-radius: 5px;
    ${(p) => (!p.fullWidth ? `max-width: 300px` : ``)};
  `;

  export const Bottom = styled.div`
    display: flex;
    padding: 10px;
    padding-top: 0;
    align-items: center;
  `;

  export const Spacer = styled.div`
    flex-grow: 1;
  `;

  export const Pagination = styled.div`
    color: ${(p) => p.theme.text.secondary};
  `;

  export const Link = styled.a`
    color: cyan;
    text-decoration: none;
  `;

  export const ExitTutorial = styled.div`
    font-size: 13px;
    color: ${(p) => p.theme.text.primary};
    opacity: 0.5;
    user-select: none;
    cursor: pointer;
    pointer-events: all;

    &:hover {
      opacity: 1;
    }
  `;
}

export const StepTooltipWidget = (props: StepTooltipWidgetProps) => {
  return (
    <S.Container fullWidth={props.fullWidth}>
      <S.Markdown>
        <ReactMarkdown
          components={{
            img: (props) => {
              return <S.Image src={props.src as string} />;
            },
            a: (props) => {
              return (
                <S.Link target="_blank" href={props.href as string}>
                  {props.children}
                </S.Link>
              );
            }
          }}
          children={props.label || props.step.options.desc}
        />
      </S.Markdown>
      <S.Bottom>
        <S.ExitTutorial
          onClick={() => {
            props.step.workflow.exit();
          }}
        >
          Exit guide
        </S.ExitTutorial>
        <S.Spacer />
        <S.Pagination>
          {props.step.getIndexNumber()} of {props.step.workflow.steps.length}
        </S.Pagination>
      </S.Bottom>
    </S.Container>
  );
};
