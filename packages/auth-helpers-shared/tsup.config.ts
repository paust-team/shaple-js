import type { Options } from 'tsup';

export const tsup: Options = {
	dts: true,
	entry: ['src/index.ts'],
	external: ['react', 'next', /^@shaple\//],
	format: ['cjs', 'esm'],
	legacyOutput: false,
	sourcemap: true,
	splitting: false,
	bundle: true,
	clean: true
};
