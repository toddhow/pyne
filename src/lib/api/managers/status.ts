import type { AxiosResponse } from 'axios';
import { applicationAdapter } from '../';

export async function get(): Promise<any> {
	let result: AxiosResponse<any>;
	try {
		result = await applicationAdapter.get(`v1/status`);
	} catch (error: any) {
		return Promise.reject(error);
	}
	return Promise.resolve(result!.data);
}
