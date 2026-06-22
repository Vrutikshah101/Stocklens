import { spawnSync } from 'node:child_process';

const packageManagerCommand = process.env.npm_execpath ? process.execPath : 'pnpm';
const packageManagerBaseArgs = process.env.npm_execpath ? [process.env.npm_execpath] : [];
const useShellFallback = !process.env.npm_execpath && process.platform === 'win32';

const steps = [
  ['harness:secrets'],
  ['lint'],
  ['typecheck'],
  ['test'],
  ['build'],
];

for (const script of steps) {
  const args = [...packageManagerBaseArgs, script];
  const label = `pnpm ${script}`;
  console.log(`\n▶ ${label}`);
  const result = spawnSync(packageManagerCommand, args, {
    stdio: 'inherit',
    shell: useShellFallback,
  });

  if (result.status !== 0) {
    console.error(`\nQuality gate failed at: ${label}`);
    process.exit(result.status || 1);
  }
}

console.log('\nStockLens quality gate passed.');
