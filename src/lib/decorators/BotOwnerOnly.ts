import { Owners } from '#root/config';
import { createFunctionPrecondition } from '@sapphire/decorators';
import type { Message } from 'discord.js';

export function BotOwnerOnly(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		if (!Owners.includes(message.author.id)) {
			await message.reply('This command can only be used by bot owner!');
		}
		return Owners.includes(message.author.id);
	});
}
