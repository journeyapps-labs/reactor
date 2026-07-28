import type { Config } from '@docusaurus/types';
import { packages } from './utils/packages';

import { generateConfig, generateTSDocPlugin } from '@journeyapps-labs/common-docs';

const base_config = generateConfig({
  project_name: 'reactor'
});

const config: Config = {
  title: 'Reactor Docs',
  tagline: 'Ambitious app building framework',
  favicon: 'img/favicon.ico',
  ...base_config,
  plugins: packages.map((p) => generateTSDocPlugin(p)),
  themeConfig: {
    // Replace with your project's social card
    ...base_config.themeConfig,
    image: 'img/labs.png',
    navbar: {
      title: 'Reactor',
      logo: {
        alt: 'Labs Logo',
        src: 'img/labs.png'
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'gettingStartedSidebar',
          position: 'left',
          label: 'Getting started'
        },
        {
          type: 'docSidebar',
          sidebarId: 'subsystemsSidebar',
          position: 'left',
          label: 'Subsystems'
        },
        {
          type: 'docSidebar',
          sidebarId: 'tsDocSidebar',
          position: 'left',
          label: 'TSDoc'
        }
      ]
    }
  }
};

export default config;
