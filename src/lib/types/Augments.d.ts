import type { PrismaClient } from '@prisma/client';
import type { PyneCommand } from '#lib/structures';
import type { settingsManager } from '#lib/database';

declare module '@sapphire/pieces' {
	export interface Container {
		db: PrismaClient;
		settingsManager: settingsManager;
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
