#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const staged = args.includes('--staged');
const diffArgs = staged ? ['diff', '--cached', '--unified=0'] : ['diff', '--unified=0'];
const diff = execFileSync('git', diffArgs, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const patterns = [
  { name: 'Supabase service role JWT', re: /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/ },
  { name: 'Generic API key assignment', re: /(api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{16,}/i },
  { name: 'Private key', re: /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/ },
  { name: 'Supabase service role var', re: /SUPABASE_SERVICE_ROLE_KEY\s*=/ },
  { name: 'Anthropic/OpenAI key', re: new RegExp(`${'sk'}-(?:${'ant'}-|${'proj'}-)[A-Za-z0-9_-]+|${'sk'}-[A-Za-z0-9]{20,}`) },
];
const hits = [];
for (const line of diff.split(/\r?\n/)) {
  if (!line.startsWith('+') || line.startsWith('+++')) continue;
  for (const p of patterns) {
    if (p.re.test(line)) hits.push(`${p.name}: ${line.slice(0, 160)}`);
  }
}
if (hits.length) {
  console.error('SECRET SCAN FAIL');
  for (const h of hits) console.error(`- ${h}`);
  process.exit(1);
}
console.log('SECRET SCAN PASS');
