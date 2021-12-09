import { container } from '@sapphire/framework';
import type { GuildResolvable } from 'discord.js';

/**
 * Returns the specified guilds' settings.
 * @param GuildResolvable
 * @returns GuildSettings
 *
 */
export async function fetch(guild: GuildResolvable) {
	const resolved = container.client.guilds.resolveId(guild);
	if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
	const result = await container.db.guildSettings.findUnique({
		where: { id: resolved }
	});
	if (!result) {
		return container.db.guildSettings.create({ data: { id: resolved } });
	}
	return result;
}
