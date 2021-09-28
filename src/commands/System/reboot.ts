import { BotOwnerOnly } from '#lib/decorators/index';
import { PyneCommand } from '#structures/PyneCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<PyneCommand.Options>({
	description: 'Reboots the bot.',
	detailedDescription: 'The bot goes boom, then the bot goes revive.'
})
export class UserCommand extends PyneCommand {
	@BotOwnerOnly()
	public async run(message: Message) {
		await send(message, 'Rebooting...').catch((error) => this.container.logger.fatal(error));

		process.exit(0);
	}
}
