import type { PrismaClient } from '@prisma/client';
import type { PyneCommand } from '#lib/structures';

declare module '@sapphire/pieces' {
	interface Container {
		db: PrismaClient;
		api: any;
	}
}

declare module '@sapphire/framework' {
	interface SapphireClient {
		fetchGuildSettings: any;
	}

	interface ArgType {
		command: PyneCommand;
		commandMatch: string;
		commandName: PyneCommand;
	}
}

export {};
