import { SapphireClient, container } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { isGuildMessage } from '#utils/common';
import { CLIENT_OPTIONS } from '../config';

export class PyneClient extends SapphireClient {
	public constructor() {
		super(CLIENT_OPTIONS);
	}

	public fetchPrefix = async (message: Message) => {
		if (!isGuildMessage(message)) return ['*', ''];
		const result = await container.settingsManager.fetch(message.guild);
		return result!.prefixes.length ? result!.prefixes : ['*'];
	};

	public async start() {
		const response = await super.login();
		return response;
	}

	public async destroy() {
		await container.db.$disconnect();
		return super.destroy();
	}
}
