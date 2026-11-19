import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ChevronDown, CircleCheck, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { newId, openStatus, prepend, site } from '../store.jsx'
import { PageHero, Reveal, SectionTitle } from '../components/ui.jsx'

const SUBJECTS = ['General question', 'Private event', 'Catering', 'Feedback', 'Careers']

export default function Contact() {
  const [params] = useSearchParams()
  const [sent, setSent] = useState(false)
  const status = openStatus()

  const submit = e => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    prepend('eo-messages', { id: newId('MSG-'), createdAt: Date.now(), name: f.name.trim(), email: f.email.trim(), subject: f.subject, message: f.message.trim() })
    setSent(true)
  }

  const cards = [
    [MapPin, 'Visit us', site.address, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`],
    [Phone, 'Call us', site.phone, `tel:${site.phone.replace(/[^\d+]/g, '')}`],
    [Mail, 'Email us', site.email, `mailto:${site.email}`],
    [Clock, 'Right now', status.text, null],
  ]

  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" text="Questions, events, catering or feedback. We reply within one business day." image={site.images.bar} />

      <section className="container-x py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([Icon, k, v, href]) => {
            const body = <><Icon className="mb-3 text-ember" size={22} /><p className="text-sm text-muted">{k}</p><p className="mt-1 font-semibold">{v}</p></>
            return href
              ? <a key={k} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card p-6 transition hover:border-ember">{body}</a>
              : <div key={k} className="card p-6">{body}</div>
          })}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="card p-6 sm:p-8">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CircleCheck className="text-green-500" size={48} />
                <h2 className="mt-4 font-display text-2xl font-semibold">Message received!</h2>
                <p className="mt-2 text-muted">Thanks for reaching out. We'll reply within one business day.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-6">Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
                <h2 className="font-display text-2xl font-semibold sm:col-span-2">Send a message</h2>
                <div><label htmlFor="c-name" className="label">Name *</label><input id="c-name" name="name" required autoComplete="name" className="input" /></div>
                <div><label htmlFor="c-email" className="label">Email *</label><input id="c-email" name="email" type="email" required autoComplete="email" className="input" /></div>
                <div className="sm:col-span-2"><label htmlFor="subject" className="label">Subject</label>
                  <select id="subject" name="subject" defaultValue={SUBJECTS.includes(params.get('subject')) ? params.get('subject') : SUBJECTS[0]} className="input">
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2"><label htmlFor="message" className="label">Message *</label><textarea id="message" name="message" required minLength={10} rows={5} className="input" placeholder="For events, include the date and number of guests." /></div>
                <button className="btn-primary sm:col-span-2">Send message</button>
              </form>
            )}
          </div>
          <iframe
            title={`Map to ${site.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
            className="min-h-96 w-full rounded-2xl border border-line"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className="container-x max-w-3xl pb-24">
        <SectionTitle eyebrow="FAQ" title="Good to know" center />
        <div className="space-y-3">
          {site.faq.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="group card p-5 open:border-ember/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}<ChevronDown size={18} className="shrink-0 text-ember transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
