import { Listener, Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { settingsManager } from '#lib/database';

export class GuildCreate extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild) {
		await settingsManager.fetchGuildSettings(guild);
	}
}
