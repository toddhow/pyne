import { Listener, Events, container } from '@sapphire/framework';
import type { Guild } from 'discord.js';

export class GuildCreate extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild) {
		await container.settingsManager.fetch(guild);
	}
}
