import fs from 'fs';
import path from 'path';
import { defineConfig, env } from 'prisma/config';

// Load environment variables from repository root .env so Prisma CLI picks up DATABASE_URL
const rootEnv = path.resolve(__dirname, '../../.env');
if (fs.existsSync(rootEnv)) {
  const content = fs.readFileSync(rootEnv, { encoding: 'utf8' });
  // Parse into a map first so we can expand variables like ${VAR}
  const map: Record<string, string> = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }
    map[key] = val;
  }

  // Expand variables using previously parsed map and existing process.env
  const expand = (v: string) =>
    v.replace(/\$\{([A-Za-z0-9_]+)\}/g, (_, n) => {
      if (map[n] !== undefined) return map[n];
      if (process.env[n] !== undefined) return process.env[n];
      return '';
    });

  for (const [k, raw] of Object.entries(map)) {
    const val = expand(raw);
    if (!(k in process.env)) process.env[k] = val;
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
