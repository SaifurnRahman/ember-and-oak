import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Bike, ChefHat, CircleCheck, Package, Phone } from 'lucide-react'
import { load, money, site } from '../store.jsx'

export const STEPS = {
  delivery: ['Order received', 'Preparing', 'Out for delivery', 'Delivered'],
  pickup: ['Order received', 'Preparing', 'Ready for pickup', 'Collected'],
}
const ICONS = [Package, ChefHat, Bike, CircleCheck]

// Demo: status advances with time unless the owner dashboard set one.
export function stepOf(order, now = Date.now()) {
  if (order.status != null) return order.status
  const mins = (now - order.createdAt) / 60000
  return mins < 1 ? 0 : mins < 3 ? 1 : mins < 6 ? 2 : 3
}

export default function Order() {
  const { id } = useParams()
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 10000); return () => clearInterval(t) }, [])
  const order = load('eo-orders', []).find(o => o.id === id)

  if (!order) return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-24 text-center">
      <h1 className="font-display text-3xl font-semibold">We couldn't find that order</h1>
      <p className="mt-2 text-muted">Orders are saved on the device they were placed from.</p>
      <Link to="/menu" className="btn-primary mt-6">Back to the menu</Link>
    </section>
  )

  const step = stepOf(order)
  const steps = STEPS[order.mode]

  return (
    <section className="container-x max-w-3xl pt-28 pb-20 sm:pt-32">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/15 text-green-500"><CircleCheck size={34} /></span>
        <h1 className="mt-5 font-display text-4xl font-semibold">Thank you, {order.customer.name.split(' ')[0]}!</h1>
        <p className="mt-2 text-muted">Order <b className="text-ink">{order.id}</b> · {order.when}</p>
      </div>

      <div className="card mt-10 p-6 sm:p-8">
        <ol className="grid grid-cols-4 gap-2" aria-label="Order progress">
          {steps.map((s, i) => {
            const Icon = ICONS[i]
            const done = i <= step
            return (
              <li key={s} className="relative flex flex-col items-center text-center" aria-current={i === step ? 'step' : undefined}>
                {i > 0 && <span className={`absolute top-6 right-1/2 h-1 w-full -translate-y-1/2 rounded ${i <= step ? 'bg-ember' : 'bg-line'}`} />}
                <span className={`relative grid h-12 w-12 place-items-center rounded-full border-2 transition ${done ? 'border-ember bg-ember text-on-ember' : 'border-line bg-surface text-muted'} ${i === step && step < 3 ? 'animate-pulse' : ''}`}><Icon size={20} /></span>
                <span className={`mt-3 text-xs font-medium sm:text-sm ${done ? '' : 'text-muted'}`}>{s}</span>
              </li>
            )
          })}
        </ol>
        <p className="mt-6 rounded-xl bg-surface-2 p-4 text-center text-sm">
          {order.mode === 'delivery' ? `Delivering to ${order.customer.address}` : `Pick up at ${site.address}`}
        </p>
      </div>

      <div className="card mt-6 p-6 sm:p-8">
        <h2 className="mb-4 font-display text-xl font-semibold">Receipt</h2>
        <ul className="space-y-2 text-sm">
          {order.lines.map(l => <li key={l.id} className="flex justify-between"><span>{l.qty} × {l.name}</span><span>{money(l.price * l.qty)}</span></li>)}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-muted">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between text-green-500"><dt>Discount ({order.promo})</dt><dd>−{money(order.discount)}</dd></div>}
          {order.mode === 'delivery' && <div className="flex justify-between"><dt>Delivery</dt><dd>{order.delivery ? money(order.delivery) : 'Free'}</dd></div>}
          <div className="flex justify-between"><dt>Tax</dt><dd>{money(order.tax)}</dd></div>
          <div className="flex justify-between pt-2 text-base font-semibold text-ink"><dt>Total · {order.payment}</dt><dd>{money(order.total)}</dd></div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className="btn-ghost"><Phone size={16} /> Call the restaurant</a>
        <Link to="/menu" className="btn-primary">Order something else</Link>
      </div>
    </section>
  )
}
