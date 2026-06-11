#!/usr/bin/env node
/**
 * Encrypt a blog post so only the ciphertext is committed and published.
 *
 * Usage:
 *   node tools/encrypt-post.mjs _encrypted/2026-06-11-my-secret-post.md
 *
 * The draft must be a normal post file (frontmatter + markdown body) whose
 * filename follows the YYYY-MM-DD-slug.md convention. The password is read
 * from the ENCRYPT_POST_PASSWORD env var, or prompted interactively.
 *
 * Output: _posts/YYYY/MM/YYYY-MM-DD-slug.md containing the original
 * frontmatter plus `encrypted: true`, with the body replaced by an
 * AES-256-GCM payload (base64 of salt[16] + iv[12] + ciphertext+tag).
 * Decryption happens in the browser via _includes/encrypted-post.html,
 * which must use the same PBKDF2 parameters as PBKDF2_ITERATIONS below.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
import { marked } from 'marked';

const PBKDF2_ITERATIONS = 600000;
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function promptPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    let buf = '';
    const onData = (ch) => {
      const c = ch.toString('utf8');
      if (c === '\r' || c === '\n' || c === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(buf);
      } else if (c === '\u0003') {
        process.stdout.write('\n');
        process.exit(130);
      } else if (c === '\u007f' || c === '\b') {
        buf = buf.slice(0, -1);
      } else {
        buf += c;
      }
    };
    stdin.on('data', onData);
  });
}

async function getPassword() {
  if (process.env.ENCRYPT_POST_PASSWORD) {
    return process.env.ENCRYPT_POST_PASSWORD;
  }
  if (!process.stdin.isTTY) {
    fail('no TTY for password prompt; set ENCRYPT_POST_PASSWORD instead');
  }
  const pw = await promptPassword('Password: ');
  if (!pw) fail('empty password');
  const confirm = await promptPassword('Confirm password: ');
  if (pw !== confirm) fail('passwords do not match');
  return pw;
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) fail('draft has no frontmatter block');
  return { frontmatter: m[1], body: m[2] };
}

function encrypt(plaintext, password) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
    cipher.getAuthTag()
  ]);
  return Buffer.concat([salt, iv, ciphertext]).toString('base64');
}

const draftPath = process.argv[2];
if (!draftPath) fail('usage: node tools/encrypt-post.mjs <draft.md>');

const filename = basename(draftPath);
const dateMatch = filename.match(/^(\d{4})-(\d{2})-\d{2}-.+\.md$/);
if (!dateMatch) fail(`filename must be YYYY-MM-DD-slug.md, got: ${filename}`);
const [, year, month] = dateMatch;

const raw = readFileSync(draftPath, 'utf8');
const { frontmatter, body } = parseFrontmatter(raw);
if (!body.trim()) fail('draft body is empty');

const password = await getPassword();

const html = marked.parse(body, { gfm: true, async: false });
const payload = encrypt(html, password);

// Drop keys the encrypted output controls; TOC is disabled because no
// headings exist at build time.
const keptLines = frontmatter
  .split(/\r?\n/)
  .filter((line) => !/^(encrypted|toc):/.test(line));
if (!keptLines.some((line) => /^description:\s*\S/.test(line))) {
  keptLines.push('description: 本文已加密，输入密码后阅读。');
}

const output = `---
${keptLines.join('\n')}
encrypted: true
toc: false
---

<div id="encrypted-blob" data-payload="${payload}" hidden></div>

{% include encrypted-post.html %}
`;

const outDir = join(REPO_ROOT, '_posts', year, month);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, filename);
writeFileSync(outPath, output);
console.log(`Encrypted post written to ${outPath}`);
console.log('The plaintext draft stays out of git; do not commit it.');

// Share link: password travels in the URL fragment, which browsers never
// send to the server. Permalink follows _config.yml's /posts/:title/.
const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
const config = readFileSync(join(REPO_ROOT, '_config.yml'), 'utf8');
const siteUrl = config.match(/^url:\s*["']?([^"'\s#]+)/m)?.[1] ?? '';
console.log(`Share link: ${siteUrl}/posts/${slug}/#pw=${encodeURIComponent(password)}`);
