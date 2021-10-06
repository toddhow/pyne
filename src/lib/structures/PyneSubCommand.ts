import { PieceContext, Args as SapphireArgs, CommandContext, PreconditionEntryResolvable, UserPermissionsPrecondition } from '@sapphire/framework';
import { SubCommandPluginCommand } from '@sapphire/plugin-subcommands';
import type { PermissionLevels } from '#lib/types/Enums';
import type { PermissionResolvable } from 'discord.js';

export abstract class PyneSubCommand extends SubCommandPluginCommand {
	public readonly guarded: boolean;
	public readonly hidden: boolean;
	public readonly permissionLevel: PermissionLevels;
	public readonly usages: string[];
	public readonly explainedUsage: string[];
	public readonly examples: string[];
	public constructor(context: PieceContext, options: PyneSubCommand.Options) {
		super(context, PyneSubCommand.resolvePreConditions(context, options));
		this.guarded = options.guarded ?? false;
		this.hidden = options.hidden ?? false;
		this.permissionLevel = options.permissionLevel ?? 0;
		this.usages = options.usages ?? [];
		this.explainedUsage = options.explainedUsage ?? [];
		this.examples = options.examples ?? [];
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
		permissionLevel?: PermissionLevels;
		usages?: string[];
		extendedHelp?: string;
		explainedUsage?: string[];
		examples?: string[];
	};
	export type Args = SapphireArgs;
	export type Context = CommandContext;
}
