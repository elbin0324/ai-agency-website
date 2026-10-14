#!/usr/bin/env node
// Publishes the built site (dist/) to the gh-pages branch of the origin remote, which
// GitHub Pages serves. Run through `npm run deploy`, which builds first.
//
// dist/ gets a throwaway git repository with a single commit that is force-pushed,
// so the gh-pages branch always holds exactly the current build.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const dist = path.join(root, 'dist');
const git = (args, cwd = root) => execFileSync('git', args, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('dist/ is missing. Run `npm run build` first (or use `npm run deploy`).');
  process.exit(1);
}

const remote = git(['remote', 'get-url', 'origin']);
const source = git(['rev-parse', '--short', 'HEAD']);
const name = git(['config', 'user.name']);
const email = git(['config', 'user.email']);
fs.writeFileSync(path.join(dist, '.nojekyll'), ''); // serve the _astro/ folder as-is

fs.rmSync(path.join(dist, '.git'), { recursive: true, force: true });
try {
  git(['init', '-q', '-b', 'gh-pages'], dist);
  git(['add', '-A'], dist);
  git(['-c', `user.name=${name}`, '-c', `user.email=${email}`, 'commit', '-q', '-m', `Deploy ${source}`], dist);
  git(['push', '-q', '--force', remote, 'gh-pages'], dist);
  console.log(`Published ${source} to the gh-pages branch of ${remote}`);
} finally {
  fs.rmSync(path.join(dist, '.git'), { recursive: true, force: true });
}
