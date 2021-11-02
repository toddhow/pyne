import type { PyneCommand } from '#lib/structures';
import { PermissionLevels } from '#lib/types/Enums';
import { OWNERS } from '#root/config';
import { FuzzySearch } from '#utils/Parsers/FuzzySearch';
import { Argument, ArgumentContext, Command } from '@sapphire/framework';

export class UserArgument extends Argument<Command> {
	public async run(parameter: string, context: CommandArgumentContext) {
		const commands = this.container.stores.get('commands');
		const found = commands.get(parameter.toLowerCase()) as PyneCommand | undefined;
		if (found) {
			return this.isAllowed(found, context)
				? this.ok(found)
				: this.error({
						parameter,
						identifier: `I could not resolve ${parameter} to a command! Make sure you typed its name or one of its aliases correctly!`,
						context
				  });
		}

		const command = await new FuzzySearch(commands, (command) => command.name, context.filter).run(context.message, parameter, context.minimum);
		if (command) return this.ok(command[1]);

		return this.error({
			parameter,
			identifier: `I could not resolve ${parameter} to a command! Make sure you typed its name or one of its aliases correctly!`,
			context
		});
	}

	private isAllowed(command: PyneCommand, context: CommandArgumentContext): boolean {
		if (command.permissionLevel !== PermissionLevels.BotOwner) return true;
		return context.owners ?? OWNERS.includes(context.message.author.id);
	}
}

interface CommandArgumentContext extends ArgumentContext<Command> {
	filter?: (entry: Command) => boolean;
	owners?: boolean;
}
