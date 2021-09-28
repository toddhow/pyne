import type { ListenerOptions, PieceContext } from '@sapphire/framework';
import type { PresenceData } from 'discord.js';
import { Listener, Store } from '@sapphire/framework';
import { blue, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { CLIENT_OPTIONS } from '../config';
import { fetchGuildCount, fetchUserCount } from '#utils/functions';

const dev = process.env.NODE_ENV !== 'production';

export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public constructor(context: PieceContext, options?: ListenerOptions) {
		super(context, {
			...options,
			once: true
		});
	}

	public run() {
		this.printBanner();
		this.printStoreDebugInformation();
		this.startActivityDisplay();
	}

	private printBanner() {
		const success = green('+');

		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		const line01 = llc('');
		const line02 = llc('');
		const line03 = llc('');

		// Offset Pad
		const pad = ' '.repeat(7);

		console.log(
			String.raw`
${line01} ${pad}${blc('1.0.0')}
${line02} ${pad}[${success}] Gateway
${line03}${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<any>, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private async startActivityDisplay() {
		const activites: PresenceData['activities'] = [
			{
				name: `commands in ${await fetchGuildCount()} servers | Prefix ${CLIENT_OPTIONS.defaultPrefix}`,
				type: 2
			},
			{
				name: `${await fetchUserCount()} users | Prefix ${CLIENT_OPTIONS.defaultPrefix}`,
				type: 3
			},
			{
				name: `a deathmatch with Todd | Prefix ${CLIENT_OPTIONS.defaultPrefix}`,
				type: 5
			},
			{
				name: `The scammer hunt | Prefix ${CLIENT_OPTIONS.defaultPrefix}`,
				type: 0
			}
		];

		setInterval(async () => {
			let activity = activites![Math.floor(Math.random() * activites!.length)];

			this.container.client.user?.setActivity(activity);
		}, 20000);
	}
}
