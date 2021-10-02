// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-api/register';
import '@sapphire/plugin-editable-commands';
import { config } from 'dotenv-cra';
import { join } from 'path';
import { inspect } from 'util';
import { srcFolder } from './util/constants';

// Read env var
config({ path: join(srcFolder, '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;
