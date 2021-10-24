import type { AxiosResponse } from 'axios';
import type { ApiStatus } from '#lib/types';
import { applicationAdapter } from '../';

export async function get(): Promise<ApiStatus> {
	let result: AxiosResponse<any>;
	try {
		result = await applicationAdapter.get(`v1/status`);
	} catch (error: any) {
		return Promise.reject(error);
	}
	return Promise.resolve(result!.data);
}
