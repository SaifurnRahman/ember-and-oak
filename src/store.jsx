import { createContext, useContext, useEffect, useState } from 'react'
import site from './data/site.json'
import menu from './data/menu.json'
import { totals as calc } from './pricing.js'

export { site, menu }
export const byId = Object.fromEntries(menu.items.map(i => [i.id, i]))
export const money = n => site.currency + n.toFixed(2)
export const totals = (subtotal, opts) => calc(subtotal, opts, site)
export const newId = prefix => prefix + Math.random().toString(36).slice(2, 7).toUpperCase()

// shortcut: orders, bookings and messages live in this browser's localStorage only; swap these two for API calls when a backend exists.
export function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
export function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode: demo still works for this visit */ }
}
export const prepend = (key, item) => save(key, [item, ...load(key, [])])

const toMin = t => +t.slice(0, 2) * 60 + +t.slice(3)
export function openStatus(now = new Date()) {
  const h = site.hours[now.getDay()]
  const mins = now.getHours() * 60 + now.getMinutes()
  if (!h.open) return { open: false, text: 'Closed today' }
  if (mins < toMin(h.open)) return { open: false, text: `Opens today at ${h.open}` }
  if (mins >= toMin(h.close)) return { open: false, text: 'Closed for tonight' }
  return { open: true, text: `Open now · until ${h.close}` }
}

// 30-minute booking slots; last seating 90 minutes before close.
export function slotsFor(dateStr) {
  const h = site.hours[new Date(dateStr + 'T00:00').getDay()]
  if (!h?.open) return []
  const out = []
  for (let m = toMin(h.open); m <= toMin(h.close) - 90; m += 30)
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`)
  return out
}

const CartCtx = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => load('eo-cart', {}))
  const [open, setOpen] = useState(false)
  useEffect(() => { save('eo-cart', items) }, [items])

  const add = (id, n = 1) => setItems(c => {
    const next = { ...c, [id]: (c[id] || 0) + n }
    if (next[id] <= 0) delete next[id]
    return next
  })
  const lines = Object.entries(items).filter(([id]) => byId[id]).map(([id, qty]) => ({ ...byId[id], qty }))
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)

  return (
    <CartCtx.Provider value={{ items, lines, subtotal, count, add, clear: () => setItems({}), open, setOpen }}>
      {children}
    </CartCtx.Provider>
  )
}

export const useCart = () => useContext(CartCtx)
