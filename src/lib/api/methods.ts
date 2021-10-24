import axios from 'axios';

export const applicationAdapter = axios.create({
	baseURL: process.env.API_URL,
	headers: {
		Authorization: typeof process.env.TOKEN == undefined ? `Bearer ${process.env.TOKEN}` : ' '
	}
});
