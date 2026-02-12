import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { FloatingPanelWidget } from '../../../widgets/floating/FloatingPanelWidget';
import { PanelButtonMode, PanelButtonWidget } from '../../../widgets/forms/PanelButtonWidget';
import { GuideStep, GuideStepOptions } from './GuideStep';
import { ReactorComponentSelections } from '../selections/common';
import { Layer, LayerManager } from '../../layer/LayerManager';
import { UXStore } from '../../UXStore';
import { inject } from '../../../inversify.config';
import { styled } from '../../themes/reactor-theme-fragment';

namespace S {
  export const Image = styled.img`
    width: 100%;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.2);
  `;

  export const Footer = styled.div`
    padding: 20px;
    display: flex;
    padding-top: 0;
    align-items: center;
  `;

  export const Link = styled.a`
    color: cyan;
    text-decoration: none;
  `;

  export const Markdown = styled.div`
    color: white;
    padding: 20px;
    max-width: 700px;

    > * {
      padding-bottom: 20px;

      &:last-child {
        padding-bottom: 0;
      }
    }

    p,
    li {
      font-size: 17px;
      color: ${(p) => p.theme.text.secondary};
    }

    p {
      margin-bottom: 10px;
    }

    ul {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  `;

  const screen_13_inch = `
    @media screen
      and (min-device-width: 1200px)
      and (max-device-width: 1600px)
  `;

  export const Image2 = styled.img<{ fit: boolean }>`
    max-width: 800px;
    ${(p) => (p.fit ? `min-width: 800px` : '')};

    ${screen_13_inch} {
      max-width: 600px;
      ${(p) => (p.fit ? `min-width: 600px` : '')};
    }
  `;

  export const ImageContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  `;

  export const Spacer = styled.div`
    flex-grow: 1;
  `;

  export const Pagination = styled.div`
    color: ${(p) => p.theme.text.secondary};
  `;
  export const Button = styled(PanelButtonWidget)`
    margin-left: 5px;
  `;
}

export interface InformativeGuideStepOptions extends GuideStepOptions {
  video?: string;
  image?: string;
  fit?: boolean;
}

export class InformativeGuideStep extends GuideStep<ReactorComponentSelections, InformativeGuideStepOptions> {
  @inject(LayerManager)
  accessor layerManager: LayerManager;

  @inject(UXStore)
  accessor uxStore: UXStore;

  layer: Layer;

  activated() {
    super.activated();
    this.layer = new Layer({
      render: () => {
        return (
          <FloatingPanelWidget center={true}>
            {this.options.video ? (
              <iframe
                width="560"
                height="315"
                src={this.options.video}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : null}
            {this.options.image ? (
              <S.ImageContainer>
                <S.Image2 fit={!!this.options.fit} src={this.options.image} />
              </S.ImageContainer>
            ) : null}
            <S.Markdown>
              <ReactMarkdown
                children={this.options.desc}
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
              />
            </S.Markdown>
            <S.Footer>
              <S.Pagination>
                {this.workflow.currentStepIndex() + 1} of {this.workflow.steps.length}
              </S.Pagination>
              <S.Spacer />
              <S.Button
                mode={PanelButtonMode.NORMAL}
                label="Exit guide"
                action={() => {
                  this.workflow.exit();
                }}
              />
              <S.Button
                mode={PanelButtonMode.PRIMARY}
                label="Next"
                action={() => {
                  this.complete();
                }}
              />
            </S.Footer>
          </FloatingPanelWidget>
        );
      },
      clickThrough: false,
      userCanExit: false
    });
    this.layerManager.registerLayer(this.layer);
    this.uxStore.lockReactor(true);
  }

  deactivated() {
    super.deactivated();
    this.uxStore.lockReactor(false);
    this.layer.dispose();
    this.layer = null;
  }
}
