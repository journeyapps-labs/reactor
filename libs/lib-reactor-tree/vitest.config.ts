import { configDefaults, UserConfig } from 'vitest/config';
const BaseVitestConfig: UserConfig = {
  resolve: {
    preserveSymlinks: true
  },
  test: {
    ...configDefaults,
    include: ['./**/*.test.ts'],
    reporters: 'verbose'
  }
};
export default BaseVitestConfig;
