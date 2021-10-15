import './lib/setup';
import { container } from '@sapphire/pieces';
import { PyneClient } from './lib/PyneClient';
import { PrismaClient } from '@prisma/client';

const client = new PyneClient();

async () => {
	container.db = new PrismaClient();

	client.logger.info('Logging in');
	await client.start();
	client.logger.info('logged in');
};
