import { describe, test, expect, beforeAll } from 'vitest';
import eslint from 'eslint';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const configs = [
	'fixtures/eslintrc.test.json',
	'fixtures/eslint.config.test.mjs'
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.resolve(__dirname, 'fixtures');
const FIXTURE_FILES = fs.readdirSync(FIXTURES, {withFileTypes: true}).filter((dir) =>
	dir.name[0] !== '.' && dir.isDirectory()
).map((dir) => dir.name);

async function lint (file, cli) {
	const lintResults = await cli.lintFiles(file);
	const formatter = await cli.loadFormatter('tap');
	const text = formatter.format(lintResults).replace(/^TAP.+\n.+\n.+\n/g, '');
	return Object.assign({text}, lintResults[0]);
}

for (const config of configs) {
	describe(`Config: ${config}`, () => {
		let ESLint;

		beforeAll(async () => {
			const useFlatConfig = !config.includes('eslintrc');
			ESLint = await eslint.loadESLint({ useFlatConfig });
		});

		for (const dir of FIXTURE_FILES) {
			const p = f => path.resolve(FIXTURES, dir, f);
			let cli;

			beforeAll(() => {
				cli = new ESLint({
					cwd: path.join(FIXTURES, dir),
					ignore: false,
					fix: false,
					cache: false,
					errorOnUnmatchedPattern: true,
					overrideConfigFile: path.resolve(__dirname, config)
				});
			});

			describe(`Fixture: ${dir}`, () => {
				test('valid', async () => {
					const report = await lint(p('valid.js'), cli);
					expect(report.text).not.toBeTruthy();
					expect(report).toHaveProperty('errorCount', 0);
					expect(report).toHaveProperty('warningCount', 0);
					expect(report.text).toMatchSnapshot(`fixtures/${dir}/valid.js`);
				});
				test('invalid', async () => {
					const report = await lint(p('invalid.js'), cli);
					expect(report.text).toBeTruthy();
					expect(report.errorCount + report.warningCount).toBeGreaterThan(0);
					expect(report.text).toMatchSnapshot(`fixtures/${dir}/invalid.js`);
				});
			});
		}
	});
}
