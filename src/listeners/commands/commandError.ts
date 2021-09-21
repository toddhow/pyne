import type { PyneCommand } from '#structures/PyneCommand';
import { sendTemporaryMessage } from '#utils/functions';
import { Args, ArgumentError, Command, CommandErrorPayload, Events, Listener, UserError, Identifiers } from '@sapphire/framework';
import { RESTJSONErrorCodes } from 'discord-api-types/v9';
import { DiscordAPIError, HTTPError, Message } from 'discord.js';

const ignoredCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export class UserEvent extends Listener<typeof Events.CommandError> {
	public async run(error: Error, { message, piece, args }: CommandErrorPayload) {
		// If the error was a string or an UserError, send it to the user:
		if (typeof error === 'string') return this.stringError(message, error);
		if (error instanceof ArgumentError) return this.argumentError(message, error, piece);
		if (error instanceof UserError) return this.userError(message, error, piece);

		const { client, logger } = this.container;
		// If the error was an AbortError or an Internal Server Error, tell the user to re-try:
		if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
			logger.warn(`${this.getWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
			return sendTemporaryMessage(message, 'I had a small network error when messaging Discord, please run this command again!');
		}

		// Extract useful information about the DiscordAPIError
		if (error instanceof DiscordAPIError || error instanceof HTTPError) {
			if (this.isSilencedError(args, error)) return;
			client.emit(Events.Error, error);
		} else {
			logger.warn(`${this.getWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
		}

		const command = piece as PyneCommand;

		// Emit where the error was emitted
		logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);

		return undefined;
	}

	private isSilencedError(args: Args, error: DiscordAPIError | HTTPError) {
		return (
			// If it's an unknown channel or an unknown message, ignore:
			ignoredCodes.includes(error.code) ||
			// If it's a DM message reply after a block, ignore:
			this.isDirectMessageReplyAfterBlock(args, error)
		);
	}

	private isDirectMessageReplyAfterBlock(args: Args, error: DiscordAPIError | HTTPError) {
		// When sending a message to a user who has blocked the bot, Discord replies with 50007 "Cannot send messages to this user":
		if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

		// If it's not a Direct Message, return false:
		if (args.message.guild !== null) return false;

		// If the query was made to the message's channel, then it was a DM response:
		return error.path === `/channels/${args.message.channel.id}/messages`;
	}

	private stringError(message: Message, error: string) {
		return this.alert(message, `Dear ${message.author.toString()}, ${error}`);
	}

	private async argumentError(message: Message, error: ArgumentError<unknown>, piece: Command) {
		const prefix = await this.container.client.fetchPrefix(message);
		const identifier = error.identifier;
		switch (identifier) {
			case Identifiers.ArgsUnavailable:
				return this.alert(message, `Whoops! It seems I couldn't find a parser for a parameter, please contact my developers about it!`);
			case Identifiers.ArgsMissing:
				return this.alert(
					message,
					'You need to write another parameter!\n\n> **Tip**: You can do `' +
						prefix +
						'help ' +
						piece.name +
						'` to find out how to use this command.'
				);
			default:
				return this.alert(message, 'pensive');
		}
	}

	private async userError(message: Message, error: UserError, piece: Command) {
		const prefix = await this.container.client.fetchPrefix(message);
		const identifier = error.identifier;
		switch (identifier) {
			case Identifiers.ArgsUnavailable:
				return this.alert(message, `Whoops! It seems I couldn't find a parser for a parameter, please contact my developers about it!`);
			case Identifiers.ArgsMissing:
				return this.alert(
					message,
					'You need to write another parameter!\n\n> **Tip**: You can do `' +
						prefix +
						'help ' +
						piece.name +
						'` to find out how to use this command.'
				);
			default:
		}		return this.alert(message, 'pensive');
	}

	private alert(message: Message, content: string) {
		return sendTemporaryMessage(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}

	private getWarnError(message: Message) {
		return `ERROR: /${message.guild ? `${message.guild.id}/${message.channel.id}` : `DM/${message.author.id}`}/${message.id}`;
	}
}
