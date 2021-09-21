import { Precondition, PreconditionResult } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class Staff extends Precondition {
	public run(message: Message): PreconditionResult {
		if (!message.guild) {
			return this.error({ message: 'This cannot be run in dms' });
		}
		return message.member!.roles.cache.some((role) => role.id == '873734280918990888')
			? this.ok()
			: this.error({ message: 'This command can only run by RSD staff memebers!' });
	}
}
