#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const manifestArg = args[args.indexOf('--manifest') + 1];
const staged = args.includes('--staged');
if (!manifestArg) {
  console.error('Usage: node tools/bridge-scope-lint.mjs --manifest <path> [--staged]');
  process.exit(2);
}

const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const manifestPath = path.resolve(root, manifestArg);
const manifestRelative = path.relative(root, manifestPath);

if (manifestRelative.startsWith('..') || path.isAbsolute(manifestRelative)) {
  console.error('Manifest must be inside the repository root');
  process.exit(2);
}
if (!fs.existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestArg}`);
  process.exit(2);
}

const manifest = fs.readFileSync(manifestPath, 'utf8');

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Match ## or ### heading (anchored line); body until next ##/### heading. */
function section(title) {
  const headingRe = new RegExp(`^#{2,3}\\s+${escapeRe(title)}\\s*$`, 'im');
  const match = manifest.match(headingRe);
  if (!match) return '';
  const start = match.index + match[0].length;
  const rest = manifest.slice(start);
  const nextHeading = rest.search(/\r?\n#{2,3}\s+/);
  return (nextHeading === -1 ? rest : rest.slice(0, nextHeading)).trim();
}

function isPlaceholder(bullet) {
  if (/^_.+_$/.test(bullet)) return true;
  if (bullet.startsWith('_') || bullet.includes('_ex.:')) return true;
  if (/^ex\.:/i.test(bullet)) return true;
  return false;
}

function bullets(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim())
    .filter(Boolean)
    .filter((b) => !isPlaceholder(b));
}

const allowed = bullets(section('Ficheiros Permitidos'));
const forbidden = bullets(section('Ficheiros Proibidos'));

if (allowed.length === 0) {
  console.error('Manifest has no allowed files. Add bullets under "## Ficheiros Permitidos".');
  process.exit(2);
}

const diffArgs = staged
  ? ['-c', 'core.quotepath=false', 'diff', '--cached', '-z', '--name-only']
  : ['-c', 'core.quotepath=false', 'diff', '-z', '--name-only'];

const changed = execFileSync('git', diffArgs, { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean)
  .map((p) => p.replace(/\\/g, '/'));

function globToRe(glob) {
  const g = glob
    .replace(/\\/g, '/')
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '::DOUBLE_STAR::')
    .replace(/\*/g, '[^/]*')
    .replace(/::DOUBLE_STAR::/g, '.*');
  return new RegExp(`^${g}$`);
}

const allowedRe = allowed.map(globToRe);
const forbiddenRe = forbidden.map(globToRe);
const violations = [];

for (const file of changed) {
  if (forbiddenRe.some((re) => re.test(file))) {
    violations.push(`${file} matches forbidden pattern`);
  }
  if (!allowedRe.some((re) => re.test(file))) {
    violations.push(`${file} is outside allowed scope`);
  }
}

if (violations.length) {
  console.error('SCOPE LINT FAIL');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log(`SCOPE LINT PASS (${changed.length} files checked)`);
