import type { PrismaClient } from '@prisma/client';
import type { PyneCommand } from '#lib/structures';

declare module '@sapphire/pieces' {
	interface Container {
		db: PrismaClient;
		api: Function;
	}
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		fetchGuildSettings: Function;
	}

	interface ArgType {
		command: PyneCommand;
		commandMatch: string;
		commandName: PyneCommand;
	}
}

export {};
