import type { AxiosPromise, Method } from 'axios';
import axios from 'axios';

export async function applicationAdapter(method: Method, pathname: string, data?: any): Promise<AxiosPromise> {
	return await axios({
		url: `https://api.toddhub.xyz/${pathname}`,
		method,
		data,
		headers: {
			Authorization: typeof process.env.TOKEN !== 'undefined' ? `Bearer ${process.env.TOKEN}` : undefined
		}
	});
}
