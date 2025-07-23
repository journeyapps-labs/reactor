import './commands/build-module';
import './commands/sync-packages';
import { hideBin } from 'yargs/helpers';
import { args } from './yargs';

args.help().parse(hideBin(process.argv));
