import type { ClientOptions } from 'discord.js';
import type { ServerOptions } from '@sapphire/plugin-api';
import { envParseArray, envParseInteger, envParseString } from '#lib/env';

export const OWNERS = envParseArray('CLIENT_OWNERS');

function parseApi(): ServerOptions | undefined {
	return {
		prefix: envParseString('API_PREFIX', '/'),
		origin: envParseString('API_ORIGIN'),
		listenOptions: { port: envParseInteger('API_PORT') }
	};
}

export const CLIENT_OPTIONS: ClientOptions = {
	allowedMentions: { users: [], roles: [] },
	api: parseApi(),
	caseInsensitiveCommands: true,
	caseInsensitivePrefixes: true,
	defaultPrefix: '*',
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_BANS',
		'GUILD_EMOJIS_AND_STICKERS',
		'GUILD_VOICE_STATES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
		'DIRECT_MESSAGE_REACTIONS'
	],
	loadDefaultErrorListeners: false,
	partials: ['CHANNEL'],
	regexPrefix: /^(hey +)?(rsd|pyne)[,! ]/i,
	restTimeOffset: 0
};
