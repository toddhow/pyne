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
		const result = await this.fetchGuildSettings(message.guild)
		return result!.prefixes.length ? result!.prefixes : ['*'];
	};

	public fetchGuildSettings = async (guild: GuildResolvable) => {
		const resolved = container.client.guilds.resolveId(guild);
		if (resolved === null) throw new TypeError(`Cannot resolve "guild" to a Guild instance.`);
		return await container.db.guildSettings.findUnique({
			where: { id: resolved }
		});
	}

	public async start() {
		const response = await super.login();
		return response;
	}

	public async destroy() {
		await container.db.$disconnect();
		return super.destroy();
	}
}
