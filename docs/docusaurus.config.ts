import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { packages } from './utils/packages';
import { generateTSDocPlugin } from './utils/packageUtils';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
const PROJECT_NAME = process.env.GH_PROJECT_NAME;

const config: Config = {
  title: 'Reactor Docs',
  tagline: 'Ambitious app building framework',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: process.env.GH_URL,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: `/${PROJECT_NAME}/`,
  trailingSlash: false,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: process.env.GH_ORG,
  projectName: PROJECT_NAME,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          path: 'docs'
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],
  plugins: packages.map((p) => generateTSDocPlugin(p)),
  themeConfig: {
    // Replace with your project's social card
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
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Getting started'
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'TSDoc'
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/journeyapps-labs/reactor',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Journey Mobile, Inc.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    },
    future: {
      experimental_faster: true
    }
  } satisfies Preset.ThemeConfig
};

export default config;
