import { container } from '@sapphire/framework';
import type { GuildResolvable } from 'discord.js';
import type { GuildSettings } from '#lib/types';

export class settingsManager {
	/**
	 * Creates new guild in database
	 * @param GuildResolvable
	 */
	public async create(guild: GuildResolvable) {
		const resolved = container.client.guilds.resolveId(guild);
		if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		return container.db.guildSettings.create({ data: { id: resolved } });
	}

	/**
	 * Returns the specified guilds' settings.
	 * @param GuildResolvable
	 * @returns GuildSettings
	 *
	 */
	public async fetch(guild: GuildResolvable): Promise<GuildSettings | null> {
		const resolved = container.client.guilds.resolveId(guild);
		if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		const result = await container.db.guildSettings.findUnique({
			where: { id: resolved }
		});
		if (!result) {
			await this.create(guild);
		}
		return result;
	}
}
