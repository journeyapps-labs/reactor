import { css } from '@emotion/react';
import * as React from 'react';
import * as _ from 'lodash';
import { inject } from '../../inversify.config';
import { observer } from 'mobx-react';
import { PinnableZoneWidget } from './PinnableZoneWidget';
import { CMDPalletStore } from '../../stores';
import { AdvancedWorkspacePreference } from '../../preferences/AdvancedWorkspacePreference';
import { Btn } from '../../definitions/common';
import { PanelButtonMode, PanelButtonWidget } from '../forms/PanelButtonWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MetaButton } from './HeaderMetaButtonWidget';
import { HeaderWorkspaceMenuWidget } from './HeaderWorkspaceMenuWidget';
import { getTransparentColor } from '@journeyapps-labs/lib-reactor-utils';
import { styled, themed } from '../../stores/themes/reactor-theme-fragment';
import { ToolbarPreference } from '../../settings/ToolbarPreference';
import Avatar from 'react-avatar';
import { TooltipPosition } from '../info/tooltips';

export interface HeaderWidgetProps {
  primaryHeading: Btn;
  secondaryHeading: Btn;
  additionalLogo: string;
  toolbar: ToolbarPreference;
  logoClicked: (event: React.MouseEvent) => any;
  forwardRef: React.RefObject<HTMLDivElement>;
  email: string;
  name: string;
  rightContent?: React.JSX.Element;
  /**
   * Sits next to the account button
   */
  metaButtons: Btn[];
  /**
   * Sits next to the workspaces
   */
  leftButtons?: Btn[];
  /**
   * The main account button that represents the avatar
   */
  accountButton: Btn;
  className?: any;
}

const width = 40;
const widthAvatar = 30;

namespace S {
  export const Header = themed.div<{ shadow: boolean }>`
    display: flex;
    min-height: ${width}px;
    flex-grow: 0;
    flex-shrink: 0;
    background: ${(p) => p.theme.header.background};
    margin-bottom: 2px;
    user-select: none;
    box-shadow: ${(p) => (p.shadow ? '0 0 10px rgba(0,0,0,0.2)' : 'none')};
    z-index: ${(p) => (p.shadow ? 1 : 'inherit')};
  `;

  export const AvatarCircle = styled(Avatar)`
    max-height: ${widthAvatar}px;
    max-width: ${widthAvatar}px;
    border-radius: ${widthAvatar / 2}px;
  `;

  export const HeaderButtonsZone = styled(PinnableZoneWidget)`
    align-items: center;
    align-self: center;
    flex-grow: 1;
  `;

  export const Spacer = styled.div`
    flex-grow: 1;
  `;

  export const Logo = themed.div`
    min-width: ${width}px;
    background: ${(p) => p.theme.header.backgroundLogo};
    line-height: 50px;
    vertical-align: middle;
    align-content: center;
    position: relative;
    cursor: pointer;

    &:hover{
      background: ${(p) => p.theme.header.backgroundLogoHover};
    }
  `;
  export const LogoImg = styled.img`
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `;

  export const User = styled.div`
    flex-shrink: 0;
    color: ${(p) => getTransparentColor(p.theme.header.foreground, 0.5)};
    font-size: 18px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
    border-radius: 20px;
    height: ${widthAvatar}px;
    width: ${widthAvatar}px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  `;

  export const Meta = styled.div`
    align-self: center;
    padding-right: 5px;
    padding-left: 15px;
  `;

  export const MetaIcon = css`
    .icon {
      opacity: 0.2;
      text-align: center;
      width: 30px;
    }

    &:hover {
      .icon {
        opacity: 1;
      }
    }
  `;

  export const MetaLabel = styled.div`
    flex-grow: 1;
    padding-right: 10px;
  `;

  export const MetaOrg = styled.div`
    font-size: 10px;
    color: ${(p) => p.theme.header.foreground};
    opacity: 0.6;
    margin-top: -2px;
    white-space: nowrap;
    cursor: pointer;
    display: flex;
    align-items: center;
    ${MetaIcon};
  `;
  export const MetaApp = styled.div`
    font-size: 15px;
    color: ${(p) => p.theme.header.foreground};
    white-space: nowrap;
    cursor: pointer;
    display: flex;
    align-items: center;
    ${MetaIcon};
  `;

  export const LeftButtons = themed.div`
      display: flex;
      margin-left: 10px;
      border-left: solid 1px rgba(255,255,255,0.2);
      padding-left: 20px;
      align-self: center;
      align-items: center;
      margin-bottom: 5px;
  `;

  export const LeftButton = styled(PanelButtonWidget)`
    opacity: 0.3;
    padding: 0;
    margin-right: 15px;

    &:hover {
      opacity: 1;
    }
  `;
}

interface HeaderWidgetState {
  logoClickStarted: boolean;
  primaryHeadingClickStarted: boolean;
}

@observer
export class HeaderWidget extends React.Component<HeaderWidgetProps, HeaderWidgetState> {
  @inject(CMDPalletStore)
  accessor commandPalletStore: CMDPalletStore;

  getLeftButtons() {
    if (!this.props.leftButtons) {
      return null;
    }
    return (
      <S.LeftButtons>
        {this.props.leftButtons.map((button) => {
          return <S.LeftButton key={button.label} mode={PanelButtonMode.LINK} {...button} />;
        })}
      </S.LeftButtons>
    );
  }

  getRightContent(): React.JSX.Element {
    if (!this.props.rightContent) {
      return null;
    }
    return this.props.rightContent;
  }

  render() {
    return (
      <S.Header
        className={this.props.className}
        shadow={!AdvancedWorkspacePreference.enabled()}
        ref={this.props.forwardRef}
      >
        <S.Logo
          onMouseDown={() => {
            this.setState({ logoClickStarted: true });
          }}
          onMouseUp={(event: React.MouseEvent) => {
            if (this.state.logoClickStarted) {
              event.persist();
              this.props.logoClicked(event);
            }
            this.setState({ logoClickStarted: false });
          }}
          onMouseLeave={() => {
            this.setState({ logoClickStarted: false });
          }}
        >
          <S.LogoImg src={this.props.additionalLogo} />
        </S.Logo>
        <S.Meta>
          <S.MetaApp
            onMouseDown={() => {
              this.setState({ primaryHeadingClickStarted: true });
            }}
            onMouseUp={(event) => {
              if (this.state.primaryHeadingClickStarted) {
                event.persist();
                this.props.primaryHeading?.action(event);
              }
              this.setState({ primaryHeadingClickStarted: false });
            }}
            onMouseLeave={() => {
              this.setState({ primaryHeadingClickStarted: false });
            }}
          >
            <S.MetaLabel>{this.props.primaryHeading?.label || '...'}</S.MetaLabel>
            {this.props.primaryHeading?.action ? <FontAwesomeIcon className="icon" icon="angle-down" /> : null}
          </S.MetaApp>
          <S.MetaOrg
            onClick={(event) => {
              event.persist();
              this.props.secondaryHeading?.action(event);
            }}
          >
            <S.MetaLabel>{this.props.secondaryHeading?.label || '...'}</S.MetaLabel>
            {this.props.secondaryHeading?.action ? <FontAwesomeIcon className="icon" icon="angle-down" /> : null}
          </S.MetaOrg>
        </S.Meta>
        <HeaderWorkspaceMenuWidget />
        {this.getLeftButtons()}

        {AdvancedWorkspacePreference.enabled() ? (
          <S.HeaderButtonsZone vertical={false} size={40} preference={this.props.toolbar} />
        ) : (
          <S.Spacer />
        )}

        <MetaButton
          btn={{
            icon: 'search',
            tooltipPos: TooltipPosition.BOTTOM,
            tooltip: 'Search',
            action: () => {
              this.commandPalletStore.showPallet(true);
            }
          }}
        />

        {_.map(this.props.metaButtons, (btn) => {
          return <MetaButton key={btn.tooltip || btn.label} btn={btn} />;
        })}
        {this.getRightContent()}
        <S.User
          onClick={(event) => {
            event.persist();
            this.props.accountButton.action(event);
          }}
        >
          <S.AvatarCircle email={this.props.email || ''} name={this.props.name} maxInitials={2} />
        </S.User>
      </S.Header>
    );
  }
}
