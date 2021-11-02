import { container } from '@sapphire/framework';
import type { GuildResolvable } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class settingsManager {
	/**
	 * Returns the specified guilds' settings.
	 * @param GuildResolvable
	 * @returns GuildSettings
	 *
	 */
	public static fetchGuildSettings = async (guild: GuildResolvable) => {
		const resolved = container.client.guilds.resolveId(guild);
		if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		const result = await container.db.guildSettings.findUnique({
			where: { id: resolved }
		});
		if (!result) {
			return container.db.guildSettings.create({ data: { id: resolved } });
		}
		return result;
	};
}
