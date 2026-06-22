import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const ignoredDirectories = new Set(['.git', '.next', 'node_modules', '.prototype-html']);
const ignoredFiles = new Set(['pnpm-lock.yaml', 'tsconfig.tsbuildinfo']);

function listTrackedFiles() {
  try {
    return execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    const files = [];
    const walk = (directory) => {
      for (const entry of readdirSync(directory)) {
        const absolutePath = join(directory, entry);
        const relativePath = absolutePath.slice(root.length + 1).replaceAll('\\', '/');
        const stats = statSync(absolutePath);

        if (stats.isDirectory()) {
          if (!ignoredDirectories.has(entry)) walk(absolutePath);
          continue;
        }

        if (!ignoredFiles.has(entry)) files.push(relativePath);
      }
    };

    walk(root);
    return files;
  }
}

const secretPatterns = [
  {
    name: 'OpenRouter API key',
    pattern: /sk-or-v1-[A-Za-z0-9_-]{20,}/,
  },
  {
    name: 'Filled OPENROUTER_API_KEY assignment',
    pattern: /^OPENROUTER_API_KEY=(?!(?:\s*|""|''|<.*>|your-.*|test-.*)$).+/m,
  },
];

const violations = [];

for (const file of listTrackedFiles()) {
  if (!existsSync(join(root, file))) continue;
  if (file.endsWith('.zip') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) continue;

  const content = readFileSync(join(root, file), 'utf8');
  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(content)) {
      violations.push(`${file}: ${name}`);
    }
  }
}

if (violations.length > 0) {
  console.error('Secret scan failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Secret scan passed: no OpenRouter secrets found in tracked files.');
