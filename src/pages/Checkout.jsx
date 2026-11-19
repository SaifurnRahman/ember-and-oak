import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Bike, Lock, ShoppingBag, Store, Ticket } from 'lucide-react'
import { money, newId, prepend, site, totals, useCart } from '../store.jsx'
import { QtyStepper } from '../components/ui.jsx'

export default function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const nav = useNavigate()
  const [mode, setMode] = useState('delivery')
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromo] = useState('')
  const [promoMsg, setPromoMsg] = useState('')
  const t = totals(subtotal, { mode, promo })

  const applyPromo = () => {
    const ok = site.promoCodes[promoInput.trim().toUpperCase()]
    setPromo(ok ? promoInput.trim() : '')
    setPromoMsg(ok ? `Code applied: ${ok * 100}% off` : 'That code isn’t valid')
  }

  const submit = e => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const order = {
      id: newId('EO-'),
      createdAt: Date.now(),
      mode,
      customer: { name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), address: f.address?.trim() || '' },
      when: f.when, payment: f.payment, notes: f.notes.trim(),
      lines: lines.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
      subtotal, ...t, promo: promo.toUpperCase(),
    }
    prepend('eo-orders', order)
    clear()
    nav(`/order/${order.id}`)
  }

  if (!lines.length) return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-ember"><ShoppingBag size={34} /></span>
      <h1 className="mt-6 font-display text-3xl font-semibold">Your bag is empty</h1>
      <p className="mt-2 text-muted">Pick a few dishes and come back here to check out.</p>
      <Link to="/menu" className="btn-primary mt-6">Browse the menu</Link>
    </section>
  )

  const times = ['As soon as possible', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

  return (
    <section className="container-x pt-28 pb-20 sm:pt-32">
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Checkout</h1>
      <p className="mt-2 text-muted">No account needed. Takes about a minute.</p>

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          <fieldset className="card p-6">
            <legend className="sr-only">Delivery or pickup</legend>
            <div className="grid grid-cols-2 gap-3">
              {[['delivery', Bike, 'Delivery', `${site.delivery.minutes} min`], ['pickup', Store, 'Pickup', 'Ready in ~20 min']].map(([v, Icon, label, sub]) => (
                <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition ${mode === v ? 'border-ember bg-ember/10' : 'border-line hover:border-muted'}`}>
                  <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                  <Icon className="text-ember" />
                  <span><b className="block">{label}</b><span className="text-xs text-muted">{sub}</span></span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="card grid gap-5 p-6 sm:grid-cols-2">
            <legend className="mb-2 font-display text-xl font-semibold">Your details</legend>
            <div><label htmlFor="name" className="label">Full name *</label><input id="name" name="name" required autoComplete="name" className="input" /></div>
            <div><label htmlFor="phone" className="label">Phone *</label><input id="phone" name="phone" type="tel" required pattern="[\d\s\-\+\(\)]{7,}" title="At least 7 digits" autoComplete="tel" className="input" /></div>
            <div className="sm:col-span-2"><label htmlFor="email" className="label">Email (for your receipt)</label><input id="email" name="email" type="email" autoComplete="email" className="input" /></div>
            {mode === 'delivery' && (
              <div className="sm:col-span-2"><label htmlFor="address" className="label">Delivery address *</label><input id="address" name="address" required autoComplete="street-address" placeholder="Street, apartment, floor" className="input" /></div>
            )}
            <div><label htmlFor="when" className="label">{mode === 'delivery' ? 'Delivery time' : 'Pickup time'}</label>
              <select id="when" name="when" className="input">{times.map(x => <option key={x}>{x}</option>)}</select>
            </div>
            <div><label htmlFor="payment" className="label">Payment</label>
              <select id="payment" name="payment" className="input">
                <option>{mode === 'delivery' ? 'Cash on delivery' : 'Pay at pickup'}</option>
                <option>Card on {mode === 'delivery' ? 'delivery' : 'pickup'}</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label htmlFor="notes" className="label">Notes for the kitchen</label><textarea id="notes" name="notes" rows={3} placeholder="Allergies, no onions, ring the bell twice…" className="input" /></div>
          </fieldset>
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-display text-xl font-semibold">Order summary</h2>
          <ul className="max-h-72 divide-y divide-line overflow-y-auto">
            {lines.map(l => (
              <li key={l.id} className="flex items-center gap-3 py-3">
                <img src={l.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1"><p className="text-sm font-medium">{l.name}</p><QtyStepper id={l.id} qty={l.qty} small /></div>
                <span className="text-sm font-semibold">{money(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Ticket size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
              <label htmlFor="promo" className="sr-only">Promo code</label>
              <input id="promo" value={promoInput} onChange={e => setPromoInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyPromo())} placeholder="Promo code" className="input !py-2.5 !pl-9 uppercase" />
            </div>
            <button type="button" onClick={applyPromo} className="btn-ghost !px-4 !py-2.5">Apply</button>
          </div>
          {promoMsg && <p className={`mt-2 text-xs ${promo ? 'text-green-500' : 'text-red-500'}`} role="status">{promoMsg}</p>}

          <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <Row k="Subtotal" v={money(subtotal)} />
            {t.discount > 0 && <Row k={`Discount (${promo.toUpperCase()})`} v={`−${money(t.discount)}`} cls="text-green-500" />}
            {mode === 'delivery' && <Row k="Delivery" v={t.delivery ? money(t.delivery) : 'Free'} />}
            <Row k={`Tax (${site.taxRate * 100}%)`} v={money(t.tax)} />
            <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
          </dl>
          <button className="btn-primary mt-6 w-full !py-4 text-base">Place order · {money(t.total)}</button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted"><Lock size={12} /> Your details are only used for this order</p>
        </aside>
      </form>
    </section>
  )
}

const Row = ({ k, v, cls = '' }) => <div className={`flex justify-between ${cls}`}><dt className="text-muted">{k}</dt><dd>{v}</dd></div>
