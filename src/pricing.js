// Pure money math, kept free of JSON/React imports so `npm test` can run it in Node.
export function totals(subtotal, { mode = 'delivery', promo = '' } = {}, cfg) {
  const rate = cfg.promoCodes[promo.trim().toUpperCase()] || 0
  const discount = round(subtotal * rate)
  const delivery = mode === 'delivery' && subtotal > 0 && subtotal < cfg.delivery.freeOver ? cfg.delivery.fee : 0
  const tax = round((subtotal - discount) * cfg.taxRate)
  return { rate, discount, delivery, tax, total: round(subtotal - discount + delivery + tax) }
}

const round = n => Math.round(n * 100) / 100
