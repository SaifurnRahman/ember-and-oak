import { useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, DollarSign, Inbox, LayoutDashboard, Package, RotateCcw, Sparkles } from 'lucide-react'
import { load, menu, money, newId, save, site, totals } from '../store.jsx'
import { STEPS, stepOf } from './Order.jsx'

const NAMES = ['Olivia Park', 'James Carter', 'Mia Lopez', 'Noah Kim', 'Ava Singh', 'Liam Brown', 'Zara Ahmed', 'Ethan Cole']
const pick = a => a[Math.floor(Math.random() * a.length)]
const day = d => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

function sampleData() {
  const orders = Array.from({ length: 14 }, (_, i) => {
    const lines = Array.from({ length: 1 + (i % 3) }, () => pick(menu.items)).map(({ id, name, price }) => ({ id, name, price, qty: 1 + (i % 2) }))
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
    const mode = i % 3 ? 'delivery' : 'pickup'
    return {
      id: newId('EO-'), createdAt: Date.now() - i * 9 * 3600e3 - 600e3, mode, status: i < 2 ? i : 3,
      customer: { name: pick(NAMES), phone: '+1 555 010 22' + String(i).padStart(2, '0'), email: '', address: `${10 + i} Bergen St, Brooklyn` },
      when: 'As soon as possible', payment: 'Card on delivery', notes: '', lines, subtotal, ...totals(subtotal, { mode }), promo: '',
    }
  })
  const bookings = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return { id: newId('BK-'), createdAt: Date.now(), date: iso(d), time: pick(['18:00', '19:00', '19:30', '20:30']), guests: 2 + (i % 5), name: pick(NAMES), phone: '+1 555 010 3344', email: 'guest@example.com', occasion: pick(['None', 'Birthday', 'Anniversary']), notes: '' }
  })
  const messages = [
    { id: newId('MSG-'), createdAt: Date.now() - 3600e3, name: 'Grace Lee', email: 'grace@example.com', subject: 'Private event', message: 'Hi! Can we book the terrace for 30 people on a Saturday next month?' },
    { id: newId('MSG-'), createdAt: Date.now() - 26 * 3600e3, name: 'Tom Rivera', email: 'tom@example.com', subject: 'Catering', message: 'Do you cater office lunches for 50 people? Looking for a weekly order.' },
  ]
  save('eo-orders', [...load('eo-orders', []), ...orders])
  save('eo-bookings', [...load('eo-bookings', []), ...bookings])
  save('eo-messages', [...load('eo-messages', []), ...messages])
}

export default function Admin() {
  const [, refresh] = useState(0)
  const [tab, setTab] = useState('orders')
  const orders = load('eo-orders', [])
  const bookings = load('eo-bookings', []).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const messages = load('eo-messages', [])
  const rerender = () => refresh(n => n + 1)

  const setStatus = (id, status) => { save('eo-orders', orders.map(o => o.id === id ? { ...o, status } : o)); rerender() }
  const reset = () => { ['eo-orders', 'eo-bookings', 'eo-messages'].forEach(k => save(k, [])); rerender() }

  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const upcoming = bookings.filter(b => b.date >= iso(new Date()))
  const live = orders.filter(o => stepOf(o) < 3)
  const sold = {}
  orders.forEach(o => o.lines.forEach(l => { sold[l.name] = (sold[l.name] || 0) + l.qty }))
  const top = Object.entries(sold).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const kpis = [
    [DollarSign, 'Revenue', money(revenue)],
    [Package, 'Orders', orders.length, `${live.length} in progress`],
    [CalendarDays, 'Upcoming bookings', upcoming.length, `${upcoming.reduce((s, b) => s + b.guests, 0)} guests`],
    [Inbox, 'Messages', messages.length],
  ]
  const empty = !orders.length && !bookings.length && !messages.length

  return (
    <section className="container-x pt-28 pb-20 sm:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-ember"><LayoutDashboard size={16} /> Owner dashboard · Demo</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {site.name}</h1>
          <p className="mt-1 text-sm text-muted">Orders, bookings and messages placed on this site appear here. Demo data is stored in this browser only.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { sampleData(); rerender() }} className="btn-primary !py-2.5"><Sparkles size={16} /> Add sample data</button>
          {!empty && <button onClick={reset} className="btn-ghost !py-2.5"><RotateCcw size={16} /> Clear</button>}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(([Icon, k, v, sub]) => (
          <div key={k} className="card p-5">
            <div className="flex items-center justify-between text-sm text-muted">{k}<Icon size={18} className="text-ember" /></div>
            <p className="mt-2 font-display text-3xl font-semibold">{v}</p>
            {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
          </div>
        ))}
      </div>

      {empty ? (
        <div className="card mt-8 p-12 text-center">
          <p className="font-display text-2xl">No activity yet</p>
          <p className="mt-2 text-muted">Place an order, book a table or send a message, or click “Add sample data”.</p>
          <div className="mt-6 flex justify-center gap-3"><Link to="/menu" className="btn-ghost">Place a test order</Link><Link to="/reservations" className="btn-ghost">Book a test table</Link></div>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="card overflow-hidden">
            <div className="flex gap-1 border-b border-line p-2" role="tablist">
              {[['orders', `Orders (${orders.length})`], ['bookings', `Bookings (${bookings.length})`], ['messages', `Messages (${messages.length})`]].map(([k, label]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === k ? 'bg-surface-2 text-ember' : 'text-muted hover:text-ink'}`}>{label}</button>
              ))}
            </div>
            <div className="overflow-x-auto">
              {tab === 'orders' && (
                <Table head={['Order', 'Customer', 'Items', 'Total', 'Status']}>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td><Link to={`/order/${o.id}`} className="font-semibold hover:text-ember">{o.id}</Link><p className="text-xs text-muted">{day(o.createdAt)} · {o.mode}</p></td>
                      <td>{o.customer.name}<p className="text-xs text-muted">{o.customer.phone}</p></td>
                      <td className="max-w-56 truncate text-muted">{o.lines.map(l => `${l.qty}× ${l.name}`).join(', ')}</td>
                      <td className="font-semibold">{money(o.total)}</td>
                      <td>
                        <label className="sr-only" htmlFor={`st-${o.id}`}>Status for {o.id}</label>
                        <select id={`st-${o.id}`} value={stepOf(o)} onChange={e => setStatus(o.id, +e.target.value)} className={`rounded-lg border border-line bg-bg px-2 py-1.5 text-xs font-medium ${stepOf(o) === 3 ? 'text-green-500' : 'text-ember'}`}>
                          {STEPS[o.mode].map((s, i) => <option key={s} value={i}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
              {tab === 'bookings' && (
                <Table head={['When', 'Guest', 'Party', 'Occasion', 'Ref']}>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td className="font-semibold">{day(b.date + 'T00:00')} · {b.time}</td>
                      <td>{b.name}<p className="text-xs text-muted">{b.phone}</p></td>
                      <td>{b.guests} guests</td>
                      <td className="text-muted">{b.occasion}{b.notes && ` · ${b.notes}`}</td>
                      <td className="text-xs text-muted">{b.id}</td>
                    </tr>
                  ))}
                </Table>
              )}
              {tab === 'messages' && (
                <ul className="divide-y divide-line">
                  {messages.map(m => (
                    <li key={m.id} className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold">{m.name} <span className="ml-2 rounded-full bg-ember/15 px-2.5 py-0.5 text-xs text-ember">{m.subject}</span></p>
                        <span className="text-xs text-muted">{day(m.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted">{m.message}</p>
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="mt-2 inline-block text-sm font-medium text-ember hover:underline">Reply to {m.email}</a>
                    </li>
                  ))}
                  {!messages.length && <li className="p-8 text-center text-muted">No messages yet.</li>}
                </ul>
              )}
            </div>
          </div>

          <div className="card h-fit p-6">
            <h2 className="font-display text-lg font-semibold">Best sellers</h2>
            <ul className="mt-4 space-y-4">
              {top.map(([name, qty]) => (
                <li key={name}>
                  <div className="flex justify-between text-sm"><span className="truncate pr-2">{name}</span><span className="font-semibold">{qty}</span></div>
                  <div className="mt-1.5 h-2 rounded-full bg-surface-2"><div className="h-full rounded-full bg-ember" style={{ width: `${(qty / top[0][1]) * 100}%` }} /></div>
                </li>
              ))}
              {!top.length && <li className="text-sm text-muted">No orders yet.</li>}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

function Table({ head, children }) {
  return (
    <table className="w-full min-w-[640px] text-left text-sm [&_td]:px-5 [&_td]:py-4 [&_tbody_tr]:border-t [&_tbody_tr]:border-line">
      <thead className="text-xs tracking-wider text-muted uppercase"><tr>{head.map(h => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}</tr></thead>
      <tbody>{children}</tbody>
    </table>
  )
}
