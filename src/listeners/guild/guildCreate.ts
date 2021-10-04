import { Listener, Events } from '@sapphire/framework';
import type { Guild } from 'discord.js';

export class GuildCreate extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild) {
		await this.container.db.guildSettings.create({
			data: { id: guild.id }
		});
	}
}
