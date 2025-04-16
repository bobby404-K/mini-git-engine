import crypto from 'crypto';
import zlib from 'zlib';
import { GitObject, GitObjectType, CommitMeta } from './types.js';

export class GitObjectStore {
  private db = new Map<string, Buffer>();

  hashAndStore(type: GitObjectType, content: Buffer): string {
    const header = Buffer.from(`${type} ${content.length}\0`);
    const store = Buffer.concat([header, content]);
    const sha = crypto.createHash('sha1').update(store).digest('hex');
    const compressed = zlib.deflateSync(store);
    this.db.set(sha, compressed);
    return sha;
  }

  readObject(sha: string): GitObject {
    const raw = this.db.get(sha);
    if (!raw) throw new Error(`Object ${sha} not found`);
    const decompressed = zlib.inflateSync(raw);
    const nullIdx = decompressed.indexOf(0);
    const [type] = decompressed.subarray(0, nullIdx).toString().split(' ');
    const data = decompressed.subarray(nullIdx + 1);
    return { type: type as GitObjectType, sha, data };
  }

  commit(meta: CommitMeta): string {
    const lines = [
      `tree ${meta.tree}`,
      ...(meta.parent ? [`parent ${meta.parent}`] : []),
      `author ${meta.author} ${meta.timestamp} +0000`,
      `committer ${meta.author} ${meta.timestamp} +0000`,
      '',
      meta.message
    ];
    return this.hashAndStore('commit', Buffer.from(lines.join('\n')));
  }
}
