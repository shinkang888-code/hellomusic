const { createRequire } = require('module');
const { mkdirSync, writeFileSync } = require('fs');
const { join, dirname } = require('path');
const { Agent: HttpsAgent } = require('https');

const vercelRoot = 'C:/Users/user/AppData/Roaming/npm/node_modules/vercel/dist';
const requireVercel = createRequire(join(vercelRoot, 'index.js'));
const { Client, readAuthConfigFile, readConfigFile } = requireVercel('./chunks/chunk-C3VH3X5Y.js');

function mapPath(relPath) {
  if (relPath.startsWith('out/')) return null;
  if (!relPath.startsWith('src/')) return null;
  return relPath.slice(4);
}

async function main() {
  const authConfig = readAuthConfigFile();
  const config = readConfigFile();
  config.currentTeam = 'team_iqF07oRNVoofJGj4ypBtucPn';

  const client = new Client({
    agent: new HttpsAgent({ keepAlive: true }),
    apiUrl: 'https://api.vercel.com',
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    config,
    authConfig,
    argv: ['node', 'vercel'],
    nonInteractive: true,
    isAgent: true,
  });

  const deploymentId = 'dpl_DmExEar8tBuAuaJGvztdhBQaWXkS';
  const root = 'c:/cursor/lonex-ai';
  const files = await client.fetch(`/v6/deployments/${deploymentId}/files`);

  async function downloadEntry(entry, base = '') {
    if (entry.type === 'directory') {
      for (const child of entry.children || []) {
        await downloadEntry(child, join(base, entry.name || ''));
      }
      return;
    }

    const relPath = mapPath(join(base, entry.name).replace(/\\/g, '/'));
    if (!relPath) return;

    const target = join(root, relPath);
    mkdirSync(dirname(target), { recursive: true });

    const res = await client.fetch(`/v8/deployments/${deploymentId}/files/${entry.uid}`, { json: false });
    const contentType = res.headers.get('content-type') || '';
    const raw = await res.text();
    const buf = contentType.includes('application/json')
      ? Buffer.from(JSON.parse(raw).data, 'base64')
      : Buffer.from(raw);

    writeFileSync(target, buf);
    console.log('saved', relPath);
  }

  for (const entry of files) {
    await downloadEntry(entry);
  }

  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
