import 'balloon-css';
import 'typeface-source-sans-pro';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);

export enum Fonts {
  PRIMARY = `'Source Sans Pro', sans-serif`,
  MONOSPACED = 'monospace, sans-serif'
}
