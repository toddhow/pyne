import { StaffOnly } from '#lib/decorators/index';
import { PyneSubCommand } from '#structures/PyneSubCommand';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed, User } from 'discord.js';
import { applicationAdapter } from '#lib/api';
import dayjs from 'dayjs';

@ApplyOptions<PyneSubCommand.Options>({
	subCommands: ['profile', 'add', 'remove'],
	description: 'prefix configuration for your server',
	runIn: ['GUILD_ANY']
})
export class UserCommand extends PyneSubCommand {
	public async profile(message: Message, args: Args) {
		const ban = (await applicationAdapter('GET', `v1/bans/${await args.pick('string')}`)).data

		const userData = await this.container.client.users.fetch(ban.userId);

		const date = dayjs(ban.date).unix();

		const embed = new MessageEmbed()
			.setTitle('Roblox Scammer Database')
			.setDescription(`${userData.tag}'s record`)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setColor('#0091fc')
			.addField('Document', this.getLinkLine(ban.document), true)
			.addField('Author:', `<@${ban.authorId}>`, true)
			.addField('Date of creation', `<t:${date}>`, true)
			.setTimestamp(new Date())
			.setFooter('RSD | </>');

		reply(message, { embeds: [embed] });
	}
	@StaffOnly()
	public async add(message: Message, args: Args) {
		if ((await args.pick('string')) == typeof User) {
			return reply(message, 'Argument user cannot be a ping!');
		}

		const user = await this.container.client.users.fetch(await args.pick('string'));
		const document = await args.pick('string');

		if (!user) {
			return reply(message, 'Missing argument userId!');
		}

		if (!document) {
			return reply(message, 'Missing argument document!');
		}

		await applicationAdapter('POST', `v1/bans`, {
				userId: user.id,
				authorId: message.author.id,
				document
			})
			.catch(() => {
				message.reply('User already exist in the database!');
			});

		return message.reply(`Successfully added <@${user.id}> to the database.`);
	}
	@StaffOnly()
	public async remove(message: Message, args: Args) {
		const user = await this.container.client.users.fetch(await args.pick('string'));
		const reason = await args.pick('string');

		await applicationAdapter('POST', `v1/bans/${user.id}/cancel`, {
				userId: user.id,
				authorId: message.author.id,
				reason
			})
			.catch(() => {
				return reply(message, 'Unable to find user');
			});

		return reply(message, `Successfully removed <@${user.id}> to the database.`);
	}

	/**
	 * Formats a message url line.
	 * @param url The url to format.
	 */
	 private getLinkLine(url: string): string {
		return `[**Jump to document!**](${url})`;
	}
	
}
