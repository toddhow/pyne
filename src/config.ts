import type { ClientOptions } from 'discord.js';

export const Owners = ['362007555670671370', '141377956621582338'];

export const CLIENT_OPTIONS: ClientOptions = {
	allowedMentions: { users: [], roles: [] },
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
