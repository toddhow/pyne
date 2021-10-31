import type { PrismaClient } from '@prisma/client';
import type { PyneCommand } from '#lib/structures';

declare module '@sapphire/pieces' {
	export interface Container {
		db: PrismaClient;
	}
}

declare module '@sapphire/framework' {
	interface ArgType {
		command: PyneCommand;
		commandMatch: string;
		commandName: PyneCommand;
	}
}

export {};
