import { test } from 'node:test'
import assert from 'node:assert/strict'
import { totals } from './src/pricing.js'

const cfg = { promoCodes: { SAVE10: 0.1 }, delivery: { fee: 4, freeOver: 40 }, taxRate: 0.08 }

test('delivery fee under threshold, tax on subtotal', () => {
  assert.deepEqual(totals(20, { mode: 'delivery' }, cfg), { rate: 0, discount: 0, delivery: 4, tax: 1.6, total: 25.6 })
})
test('free delivery over threshold, none for pickup or empty cart', () => {
  assert.equal(totals(40, { mode: 'delivery' }, cfg).delivery, 0)
  assert.equal(totals(20, { mode: 'pickup' }, cfg).delivery, 0)
  assert.equal(totals(0, { mode: 'delivery' }, cfg).total, 0)
})
test('promo is case-insensitive and taxed after discount; bad code ignored', () => {
  assert.deepEqual(totals(50, { mode: 'pickup', promo: ' save10 ' }, cfg), { rate: 0.1, discount: 5, delivery: 0, tax: 3.6, total: 48.6 })
  assert.equal(totals(50, { mode: 'pickup', promo: 'NOPE' }, cfg).discount, 0)
})
