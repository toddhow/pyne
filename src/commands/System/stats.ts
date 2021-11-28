import { BotOwnerOnly } from '#lib/decorators';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { PyneCommand } from '#lib/structures';
import { DurationFormatAssetsTime, friendlyDuration, TimeTypes } from '#utils/FriendlyDuration';
import { Message, MessageEmbed, version } from 'discord.js';
import { reply } from '@sapphire/plugin-editable-commands';
import dayjs from 'dayjs';
import { cpus, uptime, hostname } from 'os';

@ApplyOptions<PyneCommand.Options>({
	aliases: ['stats', 'sts'],
	description: 'Provides some details about the bot and stats.',
	detailedDescription: 'This should be very obvious...'
})
export default class UserCommand extends PyneCommand {
	@BotOwnerOnly()
	public async messageRun(message: Message) {
		// eslint-disable-next-line prettier/prettier

		const embed = new MessageEmbed()
			.setAuthor(message.author.username, message.author.displayAvatarURL())
			.setColor(0xfcac42)
			.addField('Ready Timestamp', `<t:${dayjs(container.client.readyTimestamp).unix()}>`, true)
			.addField('Statistics', this.generalStatistics, true)
			.addField('Uptime', this.uptimeStatistics, true)
			.addField('Server Usage', this.usageStatistics, true)
			.setFooter(`Process ID: ${process.pid} | ${hostname()}`);

		return reply(message, { embeds: [embed] });
	}

	private get generalStatistics(): string {
		return [
			this.format('Users', container.client.guilds.cache.reduce((a: any, b: { memberCount: any }) => a + b.memberCount, 0).toLocaleString()),
			this.format('Guilds', container.client.guilds.cache.size.toLocaleString()),
			this.format('Channels', container.client.channels.cache.size.toLocaleString()),
			this.format('Discord.js', `v${version}`),
			this.format('Node.js', process.version),
			this.format('Sapphire', 'v1.0.0')
		].join('\n');
	}

	private get uptimeStatistics(): string {
		return [
			this.format('Host', this.formatDuration(uptime() * 1000)),
			this.format('Total', this.formatDuration(process.uptime() * 1000)),
			this.format('Client', this.formatDuration(container.client.uptime!))
		].join('\n');
	}

	private get usageStatistics(): string {
		const usage = process.memoryUsage();
		const ramUsed = `${Math.round(100 * (usage.heapUsed / 1048576)) / 100}MB`;
		const ramTotal = `${Math.round(100 * (usage.heapTotal / 1048576)) / 100}MB`;
		const cpu = cpus()
			.map(({ times }) => `${Math.round(((times.user + times.nice + times.sys + times.irq) / times.idle) * 10000) / 100}%`)
			.join(' | ');

		return [this.format('CPU Load', cpu), this.format('Heap', `${ramUsed} (${ramTotal})`)].join('\n');
	}

	private format(name: string, value: string): string {
		return `• **${name}**: ${value}`;
	}

	private formatDuration(value: number): string {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		return friendlyDuration(value, TIMES, 2);
	}
}

const TIMES: DurationFormatAssetsTime = {
	[TimeTypes.Year]: {
		1: 'year',
		DEFAULT: 'years'
	},
	[TimeTypes.Month]: {
		1: 'month',
		DEFAULT: 'months'
	},
	[TimeTypes.Week]: {
		1: 'week',
		DEFAULT: 'weeks'
	},
	[TimeTypes.Day]: {
		1: 'day',
		DEFAULT: 'days'
	},
	[TimeTypes.Hour]: {
		1: 'hour',
		DEFAULT: 'hours'
	},
	[TimeTypes.Minute]: {
		1: 'minute',
		DEFAULT: 'minutes'
	},
	[TimeTypes.Second]: {
		1: 'second',
		DEFAULT: 'seconds'
	}
};
