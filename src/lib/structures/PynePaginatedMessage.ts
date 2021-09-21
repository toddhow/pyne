import { PaginatedMessage, PaginatedMessageOptions } from '@sapphire/discord.js-utilities';

export class PynePaginatedMessage extends PaginatedMessage {
	public constructor(options: PaginatedMessageOptions = {}, idle = 60000 * 5) {
		super(options);
		this.setIdle(idle);
	}
}
