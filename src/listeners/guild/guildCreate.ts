import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';

export class GuildCreate extends Listener {
	public async run(guild: Guild) {
		await this.container.db.guildSettings.create({
			data: { id: guild.id }
		});
	}
}
