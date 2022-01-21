import lumbermill from '@lumbermill/node';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { config } from 'dotenv';
import { LOG_PREFIX, ENV_VAR_PREFIX } from './constants.mjs';

config();

const argv = yargs(hideBin(process.argv))
    .env(ENV_VAR_PREFIX)
    .options({
        'raindrop-test-token': {
            descrine: 'test token for you raindrop app at https://app.raindrop.io/settings/integrations',
            type: 'string',
            demandOption: true
        },
        'raindrop-search': {
            type: 'string',
            default: '#on_remarkable',
            describe: 'items on raindrop.io that match this search will be put on remarkable. See examples here: https://help.raindrop.io/using-search/#operators',
        },
        'log-level': {
            describe: 'Log verbosity',
            choices: ['error', 'warn', 'info', 'debug', 'trace'],
            default: 'info',
        },
        'remarkable-device-token': {
            describe: 'Go to https://my.remarkable.com/#desktop to get your device token',
            demandOption: true,
            type: 'string',
        },
        'remarkable-directory': {
            describe: 'The name of the directory on the remarkable device to put downloaded articles into.',
            type: 'string',
            default: 'raindrop.io',
        },
        
    })
    .parse()

const cfg = {
    raindropTestToken: argv['raindrop-test-token'],
    raindropSearch: argv['raindrop-search'],
    logLevel: argv['log-level'],
    remarkableDeviceToken: argv['remarkable-device-token'],
    remarkableDirectory: argv['remarkable-directory'],
};
process.env.DEBUG = `${LOG_PREFIX}:*`;

if (cfg.logLevel) {
    lumbermill.setGlobalLogLevel(cfg.logLevel);
}
lumbermill.refreshPrefixFilters();

export default cfg;
