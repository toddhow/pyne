import { Listener, Events } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import type { Guild } from 'discord.js';

export class GuildCreate extends Listener<typeof Events.GuildCreate> {
	public async run(guild: Guild) {
		await container.db.guildSettings.create({
			data: { id: guild.id }
		});
	}
}
