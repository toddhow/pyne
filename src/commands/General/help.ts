import { BrandingColors } from '#lib/util/constants';
import { PyneCommand, PynePaginatedMessage } from '#lib/structures';
import { isGuildMessage } from '#utils/common';
import { ApplyOptions } from '@sapphire/decorators';
import { UserOrMemberMentionRegex } from '@sapphire/discord.js-utilities';
import { Args, container } from '@sapphire/framework';
import { reply, send } from '@sapphire/plugin-editable-commands';
import { CommandHelp, CommandHelpDisplayOptions } from '#lib/CommandHelp';
import { Collection, Message, MessageEmbed, Permissions } from 'discord.js';

const PERMISSIONS_PAGINATED_MESSAGE = new Permissions([
	Permissions.FLAGS.MANAGE_MESSAGES,
	Permissions.FLAGS.ADD_REACTIONS,
	Permissions.FLAGS.EMBED_LINKS,
	Permissions.FLAGS.READ_MESSAGE_HISTORY
]);

function sortCommandsAlphabetically(_: PyneCommand[], __: PyneCommand[], firstCategory: string, secondCategory: string): 1 | -1 | 0 {
	if (firstCategory > secondCategory) return 1;
	if (secondCategory > firstCategory) return -1;
	return 0;
}

@ApplyOptions<PyneCommand.Options>({
	aliases: ['commands', 'cmd', 'cmds'],
	description: 'Displays all commands or the description of one.',
	flags: ['cat', 'categories', 'all'],
	usages: ['--cat/--categories', '--all', 'CategoryName', 'Page', 'CommandName'],
	extendedHelp:
		'The help command shows a paginated list of all commands by their categories, or the extended information of a command if specified.\n\nIf you use `--categories` or `--cat`, you can get the list of all categories and the amount of commands each one of them have.',
	examples: ['--cat', '--all', 'General', '2', 'help']
})
export class UserCommand extends PyneCommand {
	public async messageRun(message: Message, args: PyneCommand.Args, context: PyneCommand.Context) {
		if (args.finished) {
			if (args.getFlags('cat', 'categories')) return this.helpCategories(message, args);
			if (args.getFlags('all')) return this.all(message, context);
		}

		const category = await args.pickResult(UserCommand.categories);
		if (category.success) return this.display(message, args, category.value - 1, context);

		const page = await args.pickResult('integer', { minimum: 0 });
		if (page.success) return this.display(message, args, page.value - 1, context);

		// Handle case for a single command
		const command = await args.pickResult('commandName');
		if (command.success) {
			const embed = await this.buildCommandHelp(command.value, this.getCommandPrefix(context));
			return send(message, { embeds: [embed] });
		}

		return this.canRunPaginatedMessage(message) ? this.display(message, args, null, context) : this.all(message, context);
	}

	private async buildHelp(message: Message, prefix: string) {
		const commands = await UserCommand.fetchCommands(message);

		const helpMessage: string[] = [];
		for (const [category, list] of commands) {
			helpMessage.push(`**${category} Commands**:\n`, list.map(this.formatCommand.bind(this, prefix, false)).join('\n'), '');
		}

		return helpMessage.join('\n');
	}

	private async helpCategories(message: Message, _args: PyneCommand.Args) {
		const commandsByCategory = await UserCommand.fetchCommands(message);
		let i = 0;
		const commandCategories: string[] = [];
		for (const [category, commands] of commandsByCategory) {
			const line = String(++i).padStart(2, '0');
			commandCategories.push(`\`${line}.\` **${category}**: ${commands.length} command`);
		}

		const content = commandCategories.join('\n');
		return reply(message, content);
	}

	private async all(message: Message, context: PyneCommand.Context) {
		const content = await this.buildHelp(message, context.commandPrefix);
		return reply(message, { embeds: [new MessageEmbed().setDescription(content).setColor(BrandingColors.Primary)] });
	}

	private async display(message: Message, _args: PyneCommand.Args, index: number | null, context: PyneCommand.Context) {
		const prefix = this.getCommandPrefix(context);

		const content = `Displaying one category per page. Have issues with the embed? Run \`${prefix}help --all\` for a full list in DMs`;

		const display = await this.buildDisplay(message, prefix);
		if (index !== null) display.setIndex(index);

		const response = await reply(message, content);
		await display.run(response, message.author);
		return response;
	}

	private async buildCommandHelp(command: PyneCommand, prefixUsed: string) {
		const builder = new CommandHelp();

		const extendedHelpData: CommandHelpDisplayOptions = { usages: command.usages };
		const extendedHelp = builder.display(command.name, this.formatAliases(command.aliases), extendedHelpData, prefixUsed);

		const user = this.container.client.user!;
		return new MessageEmbed()
			.setColor('AQUA')
			.setAuthor(user.username, user.displayAvatarURL({ size: 128, format: 'png' }))
			.setTimestamp()
			.setFooter(`Command help for ${command.name}`)
			.setTitle(command.description)
			.setDescription(extendedHelp);
	}

	private async buildDisplay(message: Message, prefix: string) {
		const commandsByCategory = await UserCommand.fetchCommands(message);

		const display = new PynePaginatedMessage(
			{
				template: new MessageEmbed().setColor(BrandingColors.Primary)
			},
			10 * 6000
		);

		for (const [category, commands] of commandsByCategory) {
			display.addPageEmbed((embed) =>
				embed.setTitle(`${category} Commands`).setDescription(commands.map(this.formatCommand.bind(this, prefix, true)).join('\n'))
			);
		}

		return display;
	}

	private canRunPaginatedMessage(message: Message) {
		return isGuildMessage(message) && message.channel.permissionsFor(container.client.user!)!.has(PERMISSIONS_PAGINATED_MESSAGE);
	}

	private getCommandPrefix(context: PyneCommand.Context): string {
		return (context.prefix instanceof RegExp && !context.commandPrefix.endsWith(' ')) || UserOrMemberMentionRegex.test(context.commandPrefix)
			? `${context.commandPrefix} `
			: context.commandPrefix;
	}

	private formatAliases(aliases: readonly string[]): string | null {
		if (aliases.length === 0) return null;
		return aliases.map((alias) => `\`${alias}\``).toString();
	}

	private formatCommand(prefix: string, paginatedMessage: boolean, command: PyneCommand) {
		const { description } = command;
		return paginatedMessage ? `• ${prefix}${command.name}: ${description}` : `• **${prefix}${command.name}**: ${description}`;
	}

	private static categories = Args.make<number>(async (parameter, { argument, message }) => {
		const lowerCasedParameter = parameter.toLowerCase();
		const commandsByCategory = await UserCommand.fetchCommands(message);
		for (const [page, category] of [...commandsByCategory.keys()].entries()) {
			if (category.toLowerCase() === lowerCasedParameter) return Args.ok(page + 1);
		}

		return Args.error({ argument, parameter });
	});

	private static async fetchCommands(message: Message) {
		const commands = container.stores.get('commands');
		const filtered = new Collection<string, PyneCommand[]>();
		await Promise.all(
			commands.map(async (cmd) => {
				const command = cmd as PyneCommand;
				if (command.hidden) return;
				if (!command.category) return;

				const result = await cmd.preconditions.run(message, command, { command: null! });
				if (!result.success) return;

				const category = filtered.get(command.fullCategory!.join(': '));
				if (category) category.push(command);
				else filtered.set(command.fullCategory!.join(': '), [command as PyneCommand]);
			})
		);

		return filtered.sort(sortCommandsAlphabetically);
	}
}
