import axios, { AxiosResponse } from 'axios';
import type { Message } from 'discord.js';
import type { Ban, BanCancelation } from '#lib/types';

const applicationAdapter = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		Authorization: typeof process.env.TOKEN == undefined ? `Bearer ${process.env.TOKEN}` : ' '
	}
});

/*
async function applicationAdapter(method: Method, pathname: string, data?: any): Promise<AxiosPromise> {
	return await axios({
		url: `https://api.toddhub.xyz/${pathname}`,
		method,
		data,
		headers: {
			Authorization: typeof process.env.TOKEN !== 'undefined' ? `Bearer ${process.env.TOKEN}` : undefined
		}
	})
}
*/

export async function get(userId: string): Promise<Ban> {
	if (!userId) {
		return Promise.reject(new Error('Missing userId, please specify the parameter and try again'));
	}

	let result: AxiosResponse<any>;
	try {
		result = await applicationAdapter.get(`v1/bans/${userId}`);
	} catch (error: any) {
		return Promise.reject(error);
	}
	return Promise.resolve(result!.data);
}

export async function add(userId: string, message: Message, document: string): Promise<Ban> {
	if (userId === undefined) {
		return Promise.reject(new Error('Missing userId, please specify the parameter and try again'));
	}

	let result: AxiosResponse<any>;
	try {
		result = await applicationAdapter.post(`v1/bans`, {
			userId,
			authorId: message.author.id,
			document
		});
	} catch (error: any) {
		switch (error) {
			case error.statusCode === 409:
				return Promise.reject(error.Message || '');
			case error.statusCode === 403:
				return Promise.reject(error.Message || 'The user you are attempting to add is imune to being added to the database!');
		}
	}
	return Promise.resolve(result!.data);
}

export async function remove(userId: string, message: Message, reason: string): Promise<BanCancelation> {
	if (userId === undefined) {
		return Promise.reject(new Error('Missing userId, please specify the parameter and try again'));
	}

	let result: AxiosResponse<any>;
	try {
		result = await applicationAdapter.post(`v1/bans/${userId}/cancel`, {
			authorId: message.author.id,
			reason
		});
	} catch (error: any) {
		switch (error) {
			case error.statusCode === 404:
				return Promise.reject(new Error('The user you attempting to remove was not found in the database!'));
		}
	}
	return Promise.resolve(result!.data);
}
