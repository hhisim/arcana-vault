import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const productPage = readFileSync(new URL('../app/shop/[sku]/page.tsx', import.meta.url), 'utf8');

test('archive product detail pages do not promise a 30-day replacement or refund guarantee', () => {
  for (const phrase of [
    '30-day guarantee',
    'Not the right fit?',
    'replacement or a full refund',
    'no questions asked',
    'Your archive stays yours',
  ]) {
    assert.equal(productPage.toLowerCase().includes(phrase.toLowerCase()), false, `Unexpected guarantee copy: ${phrase}`);
  }
});

test('archive product detail pages retain the existing delivery and lifetime-access notes', () => {
  assert.match(productPage, /Instant digital delivery/);
  assert.match(productPage, /Lifetime access to your archive/);
});
