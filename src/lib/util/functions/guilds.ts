import { container } from '@sapphire/framework';

/**
 * Fetchs the amount of guilds the bot is in.
 *
 * @returns The amount of guilds.
 */
export async function fetchGuildCount(): Promise<string> {
	await container.client.guilds.fetch();

	return Promise.resolve(container.client.guilds.cache.size.toString());
}

/**
 * Fetchs the amount of users in every guild the bot is in.
 *
 * @returns The amount of users in every guild.
 */
export function fetchUserCount(): Promise<string> {
	return Promise.resolve(container.client.users.cache.size.toString());
}
