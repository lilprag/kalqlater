import assert from 'node:assert/strict';
import { legacyResponseHeaders } from '../lib/legacy-response-headers.js';

const upstream = new Headers({
  'cache-control': 'public, max-age=0',
  'connection': 'keep-alive',
  'content-encoding': 'br',
  'content-length': '5050',
  'content-security-policy': "default-src 'self'",
  'content-type': 'text/html; charset=utf-8',
  'etag': 'stale-after-decoding',
  'last-modified': 'yesterday',
  'location': '/login',
  'transfer-encoding': 'chunked',
  'vary': 'Accept-Encoding',
});
upstream.append('set-cookie', 'session=one; Path=/; HttpOnly');

const headers = legacyResponseHeaders(upstream);
for (const name of ['cache-control', 'content-security-policy', 'content-type', 'location', 'vary']) {
  assert.equal(headers.get(name), upstream.get(name), `${name} should be preserved`);
}
assert.match(headers.get('set-cookie') || '', /session=one/, 'set-cookie should be preserved');
for (const name of ['connection', 'content-encoding', 'content-length', 'etag', 'last-modified', 'transfer-encoding']) {
  assert.equal(headers.get(name), null, `${name} must not describe the reconstructed response`);
}

console.log('Legacy proxy response-header policy checks passed.');
