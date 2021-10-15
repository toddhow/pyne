export interface Ban {
	id: number;
	authorId: string;
	date: string;
	document: string;
	userId: string;
}

export interface BanCancelation {
	id: number;
	authorId: string;
	banId: number;
	reason: string;
}
