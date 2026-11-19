import { useState } from 'react'
import { CalendarPlus, CircleCheck, Clock, Minus, Plus, ShieldCheck, Users } from 'lucide-react'
import { newId, prepend, site, slotsFor } from '../store.jsx'
import { PageHero, Reveal } from '../components/ui.jsx'

const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const pretty = s => new Date(s + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

// Today's slots less than 30 minutes away are hidden.
function openSlots(date) {
  const now = new Date()
  const soon = now.getHours() * 60 + now.getMinutes() + 30
  return slotsFor(date).filter(s => date !== iso(now) || +s.slice(0, 2) * 60 + +s.slice(3) > soon)
}

function firstOpenDay() {
  const d = new Date()
  for (let i = 0; i < 8; i++, d.setDate(d.getDate() + 1)) if (openSlots(iso(d)).length) return iso(d)
  return iso(new Date())
}

export default function Reserve() {
  const [date, setDate] = useState(firstOpenDay)
  const [guests, setGuests] = useState(2)
  const [time, setTime] = useState('')
  const [done, setDone] = useState(null)
  const today = iso(new Date())
  const slots = openSlots(date)

  const submit = e => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const booking = { id: newId('BK-'), createdAt: Date.now(), date, time, guests, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), occasion: f.occasion, notes: f.notes.trim() }
    prepend('eo-bookings', booking)
    setDone(booking)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHero eyebrow="Reservations" title="Book your table" text="Instant confirmation, no account needed. For groups over 12, send us a message." image={site.images.dining} />
      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1fr_380px]">
        {done ? <Confirmation b={done} onNew={() => { setDone(null); setTime('') }} /> : (
          <form onSubmit={submit} className="card space-y-8 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="label">Date</label>
                <input id="date" type="date" required min={today} value={date} onChange={e => { setDate(e.target.value); setTime('') }} className="input" />
              </div>
              <div>
                <span className="label" id="guests-label">Guests</span>
                <div className="flex items-center justify-between rounded-xl border border-line bg-bg p-1.5" role="group" aria-labelledby="guests-label">
                  <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-2" aria-label="Fewer guests"><Minus size={16} /></button>
                  <span className="flex items-center gap-2 font-semibold" aria-live="polite"><Users size={16} className="text-ember" />{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                  <button type="button" onClick={() => setGuests(g => Math.min(12, g + 1))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-surface-2" aria-label="More guests"><Plus size={16} /></button>
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="label">Available times · {pretty(date)}</legend>
              {slots.length ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {slots.map(s => (
                    <label key={s} className={`cursor-pointer rounded-xl border py-2.5 text-center text-sm font-medium transition ${time === s ? 'border-ember bg-ember text-on-ember' : 'border-line hover:border-ember'}`}>
                      <input type="radio" name="time" value={s} required checked={time === s} onChange={() => setTime(s)} className="sr-only" />{s}
                    </label>
                  ))}
                </div>
              ) : <p className="rounded-xl bg-surface-2 p-4 text-sm text-muted">We're closed or fully booked on this day. Please pick another date.</p>}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div><label htmlFor="r-name" className="label">Full name *</label><input id="r-name" name="name" required autoComplete="name" className="input" /></div>
              <div><label htmlFor="r-phone" className="label">Phone *</label><input id="r-phone" name="phone" type="tel" required pattern="[\d\s\-\+\(\)]{7,}" title="At least 7 digits" autoComplete="tel" className="input" /></div>
              <div><label htmlFor="r-email" className="label">Email *</label><input id="r-email" name="email" type="email" required autoComplete="email" className="input" /></div>
              <div><label htmlFor="occasion" className="label">Occasion</label>
                <select id="occasion" name="occasion" className="input">{['None', 'Birthday', 'Anniversary', 'Date night', 'Business meal'].map(o => <option key={o}>{o}</option>)}</select>
              </div>
              <div className="sm:col-span-2"><label htmlFor="r-notes" className="label">Special requests</label><textarea id="r-notes" name="notes" rows={3} placeholder="High chair, terrace seat, allergies…" className="input" /></div>
            </div>
            <button disabled={!slots.length} className="btn-primary w-full !py-4 text-base">{time ? `Confirm table for ${guests} at ${time}` : 'Choose a time to continue'}</button>
          </form>
        )}

        <Reveal className="space-y-6">
          <img src={site.images.interior} alt="Our dining room" className="aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
          <div className="card space-y-4 p-6 text-sm">
            <p className="flex gap-3"><Clock className="shrink-0 text-ember" size={18} />Tables are held for 15 minutes past your booking time.</p>
            <p className="flex gap-3"><ShieldCheck className="shrink-0 text-ember" size={18} />Free cancellation up to 2 hours before. Just call or reply to your confirmation.</p>
            <p className="flex gap-3"><Users className="shrink-0 text-ember" size={18} />Larger party? Our terrace hosts up to 40 guests.</p>
          </div>
        </Reveal>
      </section>
    </>
  )
}

function Confirmation({ b, onNew }) {
  const start = b.date.replaceAll('-', '') + 'T' + b.time.replace(':', '') + '00'
  const end = b.date.replaceAll('-', '') + 'T' + String(Math.min(23, +b.time.slice(0, 2) + 2)).padStart(2, '0') + b.time.slice(3) + '00'
  const ics = `data:text/calendar;charset=utf8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nUID:${b.id}\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Dinner at ${site.name} (${b.guests} guests)\nLOCATION:${site.address}\nEND:VEVENT\nEND:VCALENDAR`)}`
  return (
    <div className="card p-8 text-center sm:p-12">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-500/15 text-green-500"><CircleCheck size={34} /></span>
      <h2 className="mt-5 font-display text-3xl font-semibold">You're booked, {b.name.split(' ')[0]}!</h2>
      <p className="mt-2 text-muted">A confirmation has been sent to {b.email}.</p>
      <dl className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3 text-sm">
        {[['Date', pretty(b.date)], ['Time', b.time], ['Guests', b.guests]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-surface-2 p-4"><dt className="text-muted">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>
        ))}
      </dl>
      <p className="mt-6 text-sm">Booking reference <b className="text-ember">{b.id}</b></p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <a href={ics} download={`${b.id}.ics`} className="btn-primary"><CalendarPlus size={17} /> Add to calendar</a>
        <button onClick={onNew} className="btn-ghost">Make another booking</button>
      </div>
    </div>
  )
}
