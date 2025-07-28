import { TypeDocOptionMap } from 'typedoc';
import * as path from 'path';
import { SidebarsConfig } from '@docusaurus/plugin-content-docs';
import { PluginOptions } from '@docusaurus/types';

export interface Package {
  dir: string;
  id: string;
  name: string;
}

export const generateTSDocPlugin = (options: Package) => {
  return [
    'docusaurus-plugin-typedoc',
    {
      id: options.id,
      excludeExternals: true,
      entryPoints: [path.join(options.dir, 'src')],
      tsconfig: path.join(options.dir, 'tsconfig.json'),
      out: `docs/generated/${options.id}`,
      parametersFormat: 'table',
      propertiesFormat: 'table',
      enumMembersFormat: 'table',
      excludeProtected: true,
      excludePrivate: true,
      indexFormat: 'table',
      disableSources: true,
      expandObjects: true,
      useCodeBlocks: true,
      typeDeclarationFormat: 'table',
      membersWithOwnFile: ['Class', 'Enum', 'Function'],
      textContentMappings: {
        'title.memberPage': '{name}'
      } as any
    } as Partial<PluginOptions | TypeDocOptionMap>
  ];
};

export const generateTSDocSidebarEntry = (options: Package) => {
  return {
    type: 'category',
    label: options.name,
    link: {
      type: 'doc',
      id: `generated/${options.id}/index`
    },
    items: require(`../docs/generated/${options.id}/typedoc-sidebar.cjs`)
  } as unknown as SidebarsConfig;
};
