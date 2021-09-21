import { PieceContext, Args as SapphireArgs, CommandContext, PreconditionEntryResolvable, UserPermissionsPrecondition } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { PermissionResolvable } from 'discord.js';

export abstract class PyneSubCommand extends SubCommandPluginCommand {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public constructor(context: PieceContext, options: PyneSubCommand.Options) {
		super(context, PyneSubCommand.resolvePreConditions(context, options));
		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
	}

	protected static resolvePreConditions(_context: PieceContext, options: PyneSubCommand.Options): PyneSubCommand.Options {
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

export namespace PyneSubCommand {
	export type Options = SubCommandPluginCommand.Options & {
		permissions?: PermissionResolvable;
		guarded?: boolean;
		hidden?: boolean;
		bucket?: number;
		cooldown?: number;
	};
	export type Args = SapphireArgs;
	export type Context = CommandContext;
}
