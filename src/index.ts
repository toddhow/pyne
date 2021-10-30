import './lib/setup';
import { container } from '@sapphire/framework';
import { PyneClient } from './lib/PyneClient';
import { PrismaClient } from '@prisma/client';

const client = new PyneClient();

async function main() {
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
