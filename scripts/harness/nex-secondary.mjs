import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadLocalEnvFile(fileName) {
  const envPath = join(process.cwd(), fileName);
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadLocalEnvFile('.env.local');
loadLocalEnvFile('.env');

const userPrompt = process.argv.slice(2).join(' ').replace(/^--\s*/, '').trim();

if (!userPrompt) {
  console.error('Usage: pnpm harness:nex -- "task brief or question"');
  process.exit(1);
}

const apiKey = process.env.OPENROUTER_API_KEY;
const baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const model = process.env.AI_SECONDARY_MODEL || 'nex-agi/nex-n2-pro:free';
const appName = process.env.OPENROUTER_APP_NAME || 'StockLens';
const appUrl = process.env.OPENROUTER_APP_URL || 'http://localhost:3000';

if (!apiKey) {
  console.error('OPENROUTER_API_KEY is required. Add it to .env.local or your shell environment.');
  process.exit(1);
}

const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': appUrl,
    'X-Title': appName,
  },
  body: JSON.stringify({
    model,
    temperature: 0.2,
    max_tokens: 1600,
    messages: [
      {
        role: 'system',
        content:
          'You are the StockLens secondary AI development agent. Provide supporting drafts only. Never claim final authority over architecture, security, financial logic, legal wording, secrets, or deployment decisions. Return concise sections: Draft Approach, Alternative, Tests, Risks.',
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  }),
});

const payload = await response.json().catch(() => null);

if (!response.ok) {
  console.error(`OpenRouter request failed: ${response.status} ${response.statusText}`);
  if (payload) console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

const content = payload?.choices?.[0]?.message?.content;

if (!content) {
  console.error('OpenRouter returned no assistant content.');
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

console.log(content);
