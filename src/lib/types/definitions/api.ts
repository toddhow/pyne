export type Ban = {
	id: number;
	authorId: string;
	date: string;
	document: string;
	userId: string;
};

export type BanCancelation = {
	id: number;
	authorId: string;
	banId: number;
	reason: string;
};
