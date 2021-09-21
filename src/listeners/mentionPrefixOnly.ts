import { Listener, Events } from '@sapphire/framework';
import type { Message } from 'discord.js';
import type { DMMessage, GuildMessage } from '#lib/types';
import { send } from '@sapphire/plugin-editable-commands';

export class UserEvent extends Listener<typeof Events.MentionPrefixOnly> {
	public async run(message: Message) {
		return message.guild ? this.guild(message as GuildMessage) : this.dm(message as DMMessage);
	}

	private async dm(message: DMMessage) {
		return send(message, "You don't need a prefix in dms");
	}

	private async guild(message: GuildMessage) {
		const prefixes = await this.container.client.fetchPrefix(message);
		if(prefixes!.length == 1) {
			return send(message, `The prefix in this server is set to: ${'`'.concat(prefixes!.toString()!.replaceAll(',', '` `')).concat('`')}`);
		} else {
			return send(message, `The prefixes in this server are set to: ${'`'.concat(prefixes!.toString()!.replaceAll(',', '` `')).concat('`')}`);
		}
	}
}
