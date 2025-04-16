import assert from 'node:assert';
import test from 'node:test';
import { GitObjectStore } from '../dist/object-store.js';

test('GitObjectStore hashes, compresses and retrieves commits intact', () => {
  const store = new GitObjectStore();
  const blobSha = store.hashAndStore('blob', Buffer.from('hello world\n'));
  const commitSha = store.commit({
    tree: blobSha,
    author: 'Dev <dev@test.local>',
    message: 'Initial test commit',
    timestamp: 1740000000
  });

  const obj = store.readObject(commitSha);
  assert.strictEqual(obj.type, 'commit');
  assert.ok(obj.data.toString().includes('Initial test commit'));
});
