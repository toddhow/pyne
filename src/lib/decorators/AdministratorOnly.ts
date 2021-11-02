import { OWNERS } from '#root/config';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

export function AdministatorOnly(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		if (!message.member!.permissions.has('ADMINISTRATOR') || !OWNERS.includes(message.author.id)) {
			await reply(message, 'This command can only be used by bot owners!');
		}
		return message.member!.permissions.has('ADMINISTRATOR') || OWNERS.includes(message.author.id);
	});
}
