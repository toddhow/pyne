export class CommandHelp {
	public display(name: string, aliases: string | null, options: CommandHelpDisplayOptions, prefixUsed: string) {
		const { usages = [], extendedHelp, explainedUsage = [], examples = [] } = options;
		const output: string[] = [];
		
		// Usages
		if (usages.length) {
			output.push('📝 | **Command Usage**', ...usages.map((usage) => `→ ${prefixUsed}${name}${usage.length === 0 ? '' : ` *${usage}*`}`), '');
		}

		// Aliases
		if (aliases !== null) {
			output.push(`🖇️ | **Aliases**: ${aliases}`, '');
		}

		// Extended help
		if (extendedHelp) {
			output.push('🔍 | **Extended Help**', extendedHelp, '');
		}

		// Explained usage
		if (explainedUsage.length) {
			output.push('⚙ | **Explained usage**', ...explainedUsage.map(([arg, desc]) => `→ **${arg}**: ${desc}`), '');
		}

		// Examples
		if (examples.length) {
			output.push('🔗 | **Examples**', ...examples.map((example) => `→ ${prefixUsed}${name}${example ? ` *${example}*` : ''}`), '');
		} else {
			output.push('🔗 | **Examples**', `→ ${prefixUsed}${name}`, '');
		}

		return output.join('\n');
	}
}

export interface CommandHelpDisplayOptions {
	usages?: string[];
	extendedHelp?: string;
	explainedUsage?: [string, string][];
	examples?: (null | string)[];
}