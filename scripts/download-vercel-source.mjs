import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const authPath = join(process.env.APPDATA, 'com.vercel.cli/Data/auth.json');
const auth = JSON.parse(readFileSync(authPath, 'utf8'));
const teamId = 'team_iqF07oRNVoofJGj4ypBtucPn';
const deploymentId = 'dpl_DmExEar8tBuAuaJGvztdhBQaWXkS';
const root = 'c:/cursor/lonex-ai';
const skipPrefixes = ['out/'];

const discovery = await (await fetch('https://vercel.com/.well-known/openid-configuration')).json();
let token = auth.token;

const probe = await fetch(
  `https://api.vercel.com/v6/deployments/${deploymentId}/files?teamId=${teamId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

if (probe.status === 403) {
  const refreshRes = await fetch(discovery.token_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'user-agent': `${process.env.COMPUTERNAME || 'node'} @ vercel-cli download`,
    },
    body: new URLSearchParams({
      client_id: 'cl_HYyOPBNtFMfHhaUn9L4QPfTZz6TP47bp',
      grant_type: 'refresh_token',
      refresh_token: auth.refreshToken,
    }),
  });

  if (!refreshRes.ok) {
    console.error('Token refresh failed', refreshRes.status, await refreshRes.text());
    process.exit(1);
  }

  ({ access_token: token } = await refreshRes.json());
}

const listRes = await fetch(
  `https://api.vercel.com/v6/deployments/${deploymentId}/files?teamId=${teamId}`,
  { headers: { Authorization: `Bearer ${token}` } }
);

if (!listRes.ok) {
  console.error('List files failed', listRes.status, await listRes.text());
  process.exit(1);
}

const files = await listRes.json();

async function downloadEntry(entry, base = '') {
  if (entry.type === 'directory') {
    for (const child of entry.children || []) {
      await downloadEntry(child, join(base, entry.name || ''));
    }
    return;
  }

  const relPath = join(base, entry.name).replace(/\\/g, '/');
  if (skipPrefixes.some((prefix) => relPath.startsWith(prefix))) {
    return;
  }

  const target = join(root, relPath);
  mkdirSync(dirname(target), { recursive: true });

  const fileRes = await fetch(
    `https://api.vercel.com/v8/deployments/${deploymentId}/files/${entry.uid}?teamId=${teamId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!fileRes.ok) {
    console.error('Download failed', relPath, fileRes.status);
    return;
  }

  const contentType = fileRes.headers.get('content-type') || '';
  const raw = await fileRes.text();
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
