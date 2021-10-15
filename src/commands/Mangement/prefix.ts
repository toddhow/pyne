import { AdministatorOnly } from '#lib/decorators/index';
import { PyneSubCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<PyneSubCommand.Options>({
	subCommands: ['add', 'remove', 'show', { input: 'view', output: 'show' }],
	description: "Set RSD's prefix",
	runIn: ['GUILD_ANY'],
	usages: ['add', 'remove', 'show'],
	extendedHelp:
		"This command helps you setting up RSD's prefix. A prefix is an affix that is added in front of the word, in this case, the message.\nIt allows bots to distinguish between a regular message and a command. By nature, the prefix between should be different to avoid conflicts.\nIf you forget RSD's prefix, simply mention her with nothing else and she will tell you the current prefix.\nAlternatively, you can prefix the commands with her name and a comma (for example `RSD, ping`).",
	examples: ['add $', 'add %', 'remove $', 'remove %', 'show']
})
export class UserCommand extends PyneSubCommand {
	@AdministatorOnly()
	public async add(message: Message, args: Args) {
		const result = await container.db.guildSettings.findUnique({
			where: { id: message.guild!.id }
		});
		const prefix = await args.pick('string');
		if (result!.prefixes.includes(prefix)) return reply(message, 'This prefix already exists!');
		await container.db.guildSettings.update({
			where: { id: message.guild!.id },
			data: {
				prefixes: {
					push: prefix
				}
			}
		});
		return reply(message, `Added ${prefix} as a prefix for this server!`);
	}

	@AdministatorOnly()
	public async remove(message: Message, args: Args) {
		const prefix = await args.pick('string');
		const guild = await container.db.guildSettings.findUnique({
			where: { id: message.guild!.id }
		});
		if (!guild?.prefixes.includes(prefix)) return reply(message, `The prefix ${prefix} does not exist`);
		if (!guild.prefixes.length) return reply(message, 'This server does not have any custom prefix');
		if (guild.prefixes.length === 1) {
			await container.db.$executeRaw`UPDATE "GuildSettings" SET prefixes = array[]::varchar[] WHERE id = ${message.guild!.id}`;
			return reply(message, 'Successfully removed that prefix');
		}
		const index = guild.prefixes.indexOf(prefix);
		guild.prefixes.splice(index, 1);
		await container.db.$executeRaw`UPDATE "GuildSettings" SET prefixes = ${guild.prefixes} WHERE id = ${message.guild!.id}`;
		return reply(message, `Succefully removed that prefix!`);
	}

	public async show(message: Message) {
		const result = await container.db.guildSettings.findUnique({ where: { id: message.guild!.id } });
		const prefixes = result!.prefixes.toString();
		const embed = new MessageEmbed()
			.setAuthor(`${message.guild!.name}'s prefixes (${result?.prefixes.length})`, message.guild!.iconURL() as string)
			.setDescription('`'.concat(prefixes.replaceAll(',', '` `')).concat('`'))
			.setColor('WHITE')
			.setFooter(`Requested by ${message.member?.displayName}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return reply(message, { embeds: [embed] });
	}
}
