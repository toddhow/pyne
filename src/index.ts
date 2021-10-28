import './lib/setup';
import { container } from '@sapphire/framework';
import { PyneClient } from './lib/PyneClient';
import { PrismaClient } from '@prisma/client';

const client = new PyneClient();

async function start() {
	container.db = new PrismaClient();

	client.logger.info('Logging in');
	await client.start();
	client.logger.info('logged in');
}

start().catch((error) => {
	client.logger.info(error);
});
