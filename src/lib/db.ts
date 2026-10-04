import { createClient, Client } from '@libsql/client';
import path from 'path';

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), 'sage_cafe.db')}`;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    client = createClient({
      url,
      authToken,
    });
  }
  return client;
}

export default getDb;
