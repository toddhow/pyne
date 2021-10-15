import { Owners } from '#root/config';
import { createFunctionPrecondition } from '@sapphire/decorators';
import { reply } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

export function StaffOnly(): MethodDecorator {
	return createFunctionPrecondition(async (message: Message) => {
		if (!Owners.includes(message.author.id) || !message.member!.roles.cache.some((role) => role.id === '873734280918990888')) {
			await reply(message, 'This command can only run by RSD staff memebers!');
		}
		return Owners.includes(message.author.id) || message.member!.roles.cache.some((role) => role.id === '873734280918990888');
	});
}
