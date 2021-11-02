import { StaffOnly } from '#lib/decorators';
import { PyneSubCommand } from '#lib/structures';
import { ApplyOptions } from '@sapphire/decorators';
import { Args } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Message, MessageEmbed } from 'discord.js';
import { get, add, remove } from '#lib/api/managers/ban';
import dayjs from 'dayjs';
import type { Ban } from '#lib/types';

@ApplyOptions<PyneSubCommand.Options>({
	aliases: ['database'],
	subCommands: ['profile', 'add', 'remove'],
	description: '',
	runIn: ['GUILD_ANY']
})
export class UserCommand extends PyneSubCommand {
	public async profile(message: Message, args: Args) {
		let ban: Ban;
		try {
			ban = await get(await args.pick('string'));
		} catch (error: any) {
			switch (error) {
				case error.status === 404:
					return reply(message, 'The specifed user was not found');
			}
		}

		const userData = await this.container.client.users.fetch(ban!.userId);

		const date = dayjs(ban!.date).unix();

		const embed = new MessageEmbed()
			.setTitle('Roblox Scammer Database')
			.setDescription(`${userData.tag}'s record`)
			.setAuthor(message.author.tag, message.author.displayAvatarURL())
			.setColor('#0091fc')
			.addField('Document', `[**Link**](${ban!.document})`, true)
			.addField('Author:', `<@${ban!.authorId}>`, true)
			.addField('Date of creation', `<t:${date}>`, true)
			.setTimestamp(new Date())
			.setFooter('RSD | </>');

		return reply(message, { embeds: [embed] });
	}

	@StaffOnly()
	public async add(message: Message, args: Args) {
		const user = await args.pick('string');
		const document = await args.pick('string');

		await add(user, message, document).catch((error) => {
			return reply(message, error);
		});

		return reply(message, `Successfully added <@${user}> to the database.`);
	}

	@StaffOnly()
	public async remove(message: Message, args: Args) {
		const user = await this.container.client.users.fetch(await args.pick('string'));
		const reason = await args.pick('string');

		await remove(user.id, message, reason).catch((error) => {
			return reply(message, error);
		});

		return reply(message, `Successfully removed <@${user.id}> to the database.`);
	}
}
