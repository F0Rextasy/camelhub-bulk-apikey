#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for camelhub-bulk-apikey.
 *
 *   node src/cli.js mint     create fresh accounts and mint one key each
 *   node src/cli.js verify   re-check keys that are already on disk
 *   node src/cli.js 9router  register the keys in keys.txt with a 9Router instance
 *   node src/cli.js help
 *
 * Every task spawns the matching module in this folder, so a crash in one run
 * never leaves state behind in this process.
 */

const path = require('path');
const { spawnSync } = require('child_process');

const TASKS = {
  mint: { file: 'mint.js', note: 'create fresh accounts and mint one key each' },
  verify: { file: 'verify.js', note: 're-check keys that are already on disk' },
  '9router': { file: 'connect-9router.js', note: 'register the keys in keys.txt with a 9Router instance' },
};

function help() {
  console.log('camelhub-bulk-apikey — One CaMeL AI account per API key — 469 models, $1.00 on sign-up plus a daily check-in, every key live-verified\n');
  console.log('usage: node src/cli.js <task> [options]\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node src/mint.js --help');
  console.log('  --preset turbo|balanced|safe  run shape for the task (5/4/2 workers, 3/6/8 s apart)');
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node src/launcher.js');
}

const args = process.argv.slice(2);
// `--preset` may sit before the task name (node src/cli.js --preset=turbo mint):
// hold it here and hand it to the task, which is where the run-shape logic lives.
const presetFlag = args.find((a) => a.startsWith('--preset='));
const argv = args.filter((a) => a !== presetFlag);
const task = argv[0] === '--connect-9router' ? '9router' : argv[0];
if (!task || task === 'help' || task === '--help' || task === '-h') {
  help();
  process.exit(0);
}
const entry = TASKS[task];
if (!entry) {
  console.error('unknown task: ' + task + '\n');
  help();
  process.exit(1);
}
const child = spawnSync(process.execPath, [path.join(__dirname, entry.file), ...argv.slice(1), ...(presetFlag ? [presetFlag] : [])], {
  windowsHide: true,
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  env: process.env,
});
process.exit(child.status === null ? 1 : child.status);
