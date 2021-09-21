import {
	Command,
	CommandOptions,
	PieceContext,
	Args as SapphireArgs,
	CommandContext,
	PreconditionEntryResolvable,
	UserPermissionsPrecondition
} from '@sapphire/framework';
import type { PermissionResolvable } from 'discord.js';

export abstract class PyneCommand extends Command {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public constructor(context: PieceContext, options: PyneCommand.Options) {
		super(context, PyneCommand.resolvePreConditions(context, options));
		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
	}

	protected static resolvePreConditions(_context: PieceContext, options: PyneCommand.Options): PyneCommand.Options {
		options.generateDashLessAliases ??= true;

		const preconditions = (options.preconditions ??= []) as PreconditionEntryResolvable[];

		if (options.permissions) {
			preconditions.push(new UserPermissionsPrecondition(options.permissions));
		}

		if (options.bucket && options.cooldown) {
			preconditions.push({
				name: 'Cooldown',
				context: { limit: options.bucket, delay: options.cooldown }
			});
		}

		return options;
	}
}

export namespace PyneCommand {
	export type Options = CommandOptions & {
		permissions?: PermissionResolvable;
		guarded?: boolean;
		hidden?: boolean;
		bucket?: number;
		cooldown?: number;
	};
	export type Args = SapphireArgs;
	export type Context = CommandContext;
}
