import './lib/setup';
import { container } from '@sapphire/framework';
import { PyneClient } from './lib/PyneClient';
import { PrismaClient } from '@prisma/client';

const client = new PyneClient();

async function main() {
	container.db = new PrismaClient();

	client.logger.info('Logging in');
	await client.start();
	client.logger.info('logged in');
}

main().catch(container.logger.error.bind(container.logger));
