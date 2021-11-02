export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;

export type EnvAny = keyof PyneEnv;
export type EnvString = { [K in EnvAny]: PyneEnv[K] extends BooleanString | IntegerString ? never : K }[EnvAny];
export type EnvBoolean = { [K in EnvAny]: PyneEnv[K] extends BooleanString ? K : never }[EnvAny];
export type EnvInteger = { [K in EnvAny]: PyneEnv[K] extends IntegerString ? K : never }[EnvAny];

export interface PyneEnv {
	NODE_ENV: 'test' | 'development' | 'production';

	CLIENT_OWNERS: string;

	API_ENABLED: BooleanString;
	API_ORIGIN: string;
	API_PORT: IntegerString;
	API_PREFIX: string;

	DATABASE_URL: string;

	DISCORD_TOKEN: string;
}
