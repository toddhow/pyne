import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class UserListener extends Listener {
	public async run(message: Message) {
		// If the message was sent by a webhook, return:
		if (message.webhookId !== null) return;

		// If the message was sent by the system, return:
		if (message.system) return;

		// If the message was sent by a bot, return:
		if (message.author.bot) return;

        if (message.guild) await this.container.client.fetchPrefix(message)
	}
}