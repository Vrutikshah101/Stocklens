import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const hooksDirectory = join(root, '.git', 'hooks');

if (!existsSync(join(root, '.git'))) {
  console.error('Cannot install hooks because .git was not found.');
  process.exit(1);
}

mkdirSync(hooksDirectory, { recursive: true });

const hooks = {
  'pre-commit': `#!/bin/sh
set -e
echo "Running StockLens pre-commit harness..."
pnpm harness:secrets
pnpm lint
pnpm typecheck
`,
  'pre-push': `#!/bin/sh
set -e
echo "Running StockLens pre-push harness..."
pnpm test
pnpm build
`,
};

for (const [name, content] of Object.entries(hooks)) {
  const hookPath = join(hooksDirectory, name);
  writeFileSync(hookPath, content, 'utf8');
  chmodSync(hookPath, 0o755);
  console.log(`Installed ${name}`);
}

console.log('Git hooks installed. They are local to this checkout and are not committed.');
