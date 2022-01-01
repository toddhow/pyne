import './lib/setup';
import { container } from '@sapphire/framework';
import { PrismaClient } from '@prisma/client';
import { PyneClient } from './lib/PyneClient';
import { settingsManager } from '#lib/database';

const client = new PyneClient();

async function main() {
	// Add managers to container
	container.settingsManager = new settingsManager();

	try {
		// Connect to the Database
		container.db = new PrismaClient();

		// Login to the Discord gateway
		await client.start().then(() => {
			client.logger.info('Logged in');
		});
	} catch (error) {
		container.logger.error(error);
		await client.destroy();
		process.exit(1);
	}
}

main().catch(container.logger.error.bind(container.logger));
