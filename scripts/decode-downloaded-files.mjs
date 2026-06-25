import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      walk(path);
      continue;
    }
    const raw = readFileSync(path, 'utf8');
    if (!raw.startsWith('{')) continue;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.data !== 'string') continue;
      writeFileSync(path, Buffer.from(parsed.data, 'base64'));
      console.log('decoded', path);
    } catch {
      // keep original
    }
  }
}

walk('c:/cursor/lonex-ai/src');
