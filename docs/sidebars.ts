import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { packages } from './utils/packages';
import { generateTSDocSidebarEntry } from '@journeyapps-labs/common-docs';
import * as path from 'path';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  gettingStartedSidebar: [
    'getting-started/introduction',
    'getting-started/local-development',
    'getting-started/exploring-the-sandbox',
    'getting-started/first-module'
  ],
  subsystemsSidebar: [
    'subsystems/application-model',
    'subsystems/modules-and-stores',
    'subsystems/actions-and-validation',
    'subsystems/entity-definitions',
    'subsystems/workspaces-and-panels',
    'subsystems/ui-system',
    'subsystems/logging-and-debugging'
  ],
  tsDocSidebar: packages.map((p) => generateTSDocSidebarEntry(p, path.join(__dirname, './docs')))
};

export default sidebars;
