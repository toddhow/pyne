import { SapphireClient, container } from '@sapphire/framework';
import type { Message, GuildResolvable } from 'discord.js';
import { isGuildMessage } from '#utils/common';
import { CLIENT_OPTIONS } from '../config';

export class PyneClient extends SapphireClient {
	public constructor() {
		super(CLIENT_OPTIONS);
	}

	public fetchPrefix = async (message: Message) => {
		if (!isGuildMessage(message)) return ['*', ''];
		const result = await this.fetchGuildSettings(message.guild);
		return result!.prefixes.length ? result!.prefixes : ['*'];
	};

	/**
	 * Returns the specified guilds' settings.
	 * @param GuildResolvable
	 * @returns GuildSettings
	 *
	 */
	public fetchGuildSettings = async (guild: GuildResolvable) => {
		const resolved = container.client.guilds.resolveId(guild);
		if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		const result = await container.db.guildSettings.findUnique({
			where: { id: resolved }
		});
		if (!result) {
			return await container.db.guildSettings.create({ data: { id: resolved } });
		} else {
			return result;
		}
	};

	public start = async () => {
		const response = await super.login();
		return response;
	};

	public destroy = async () => {
		await container.db.$disconnect();
		return super.destroy();
	};
}
