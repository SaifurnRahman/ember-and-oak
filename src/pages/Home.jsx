import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Bike, CalendarDays, Check, Clock, Copy, MapPin, PartyPopper, Phone, Quote, ShoppingBag, Utensils } from 'lucide-react'
import { menu, openStatus, site } from '../store.jsx'
import { DishCard, Reveal, SectionTitle, Stars } from '../components/ui.jsx'

const ICONS = { Utensils, ShoppingBag, Bike, PartyPopper }

export default function Home() {
  const status = openStatus()
  const today = site.hours[new Date().getDay()]
  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pt-32 pb-12 text-white sm:items-center">
        <motion.img
          src={site.images.hero} alt="Grilled steak and fresh salads on a rustic table"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="container-x">
          <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <span className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur ${status.open ? 'border-green-400/40 bg-green-500/15 text-green-300' : 'border-white/20 bg-white/10 text-white/80'}`}>
              <span className={`h-2 w-2 rounded-full ${status.open ? 'animate-pulse bg-green-400' : 'bg-white/60'}`} /> {status.text}
            </span>
            <h1 className="font-display text-5xl leading-[1.05] font-semibold sm:text-7xl">
              Fire, smoke <br />& <em className="text-[#5fd3a3]">honest</em> food.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Wood-fired grills, hand-stretched pizza and craft cocktails in the heart of Brooklyn. Order in two minutes or save your table for tonight.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-primary !px-7 !py-4 text-base"><ShoppingBag size={18} /> Order online</Link>
              <Link to="/reservations" className="btn !border !border-white/30 !px-7 !py-4 text-base backdrop-blur hover:!bg-white hover:text-black"><CalendarDays size={18} /> Book a table</Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/80">
              <div className="flex -space-x-2">
                {site.testimonials.map(t => <img key={t.name} src={t.photo} alt="" className="h-9 w-9 rounded-full border-2 border-black object-cover" />)}
              </div>
              <div><Stars /> <span>4.9 from 2,300+ guest reviews</span></div>
            </div>
          </motion.div>
          <motion.div className="mt-12 grid gap-3 sm:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            {[
              [MapPin, 'Find us', site.address],
              [Clock, 'Today', today.open ? `${today.open} – ${today.close}` : 'Closed today'],
              [Phone, 'Call us', site.phone],
            ].map(([Icon, k, v]) => (
              <div key={k} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <Icon size={20} className="shrink-0 text-[#5fd3a3]" />
                <div className="min-w-0"><p className="text-xs text-white/60">{k}</p><p className="truncate text-sm font-medium">{v}</p></div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="container-x py-20 sm:py-28">
        <SectionTitle eyebrow="However you like it" title="Dine in, pick up, or we'll bring it to you" center />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {site.services.map((s, i) => {
            const Icon = ICONS[s.icon]
            return (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="card h-full p-7 transition hover:border-ember/50">
                  <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-ember/15 text-ember"><Icon size={22} /></span>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted">{s.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Signature dishes */}
      <section className="bg-surface py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Signature dishes" title="What our guests order again and again" />
            <Link to="/menu" className="btn-ghost mb-10">Full menu <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {menu.items.filter(i => i.popular).slice(0, 4).map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08} className="h-full"><DishCard item={item} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="container-x grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
        <Reveal className="relative">
          <img src={site.images.kitchen} alt="Chef cooking over open flames" className="aspect-[4/5] w-full rounded-3xl object-cover" loading="lazy" />
          <div className="absolute -right-2 -bottom-6 rounded-2xl bg-ember p-6 text-on-ember shadow-2xl sm:-right-6">
            <p className="font-display text-4xl font-bold">12</p>
            <p className="text-sm font-medium">years of live-fire<br />cooking</p>
          </div>
        </Reveal>
        <div>
          <SectionTitle eyebrow="Our story" title="Cooked over oak, served with heart" text="We started with one wood-fired grill and a simple promise: buy from farmers we know, cook over real fire, and treat every guest like family. Twelve years later, that promise hasn't changed." />
          <Reveal className="grid grid-cols-2 gap-4">
            {site.stats.map(s => (
              <div key={s.label} className="card p-5">
                <p className="font-display text-3xl font-semibold text-ember">{s.value}{s.suffix}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </Reveal>
          <Reveal><Link to="/about" className="btn-ghost mt-8">Meet the team <ArrowRight size={16} /></Link></Reveal>
        </div>
      </section>

      <PromoBanner />

      {/* Testimonials */}
      <section className="container-x py-20 sm:py-28">
        <SectionTitle eyebrow="Guest reviews" title="Loved by Brooklyn" center />
        <div className="grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1} className="h-full">
              <figure className="card flex h-full flex-col p-7">
                <Quote className="mb-4 text-ember" size={30} />
                <blockquote className="flex-1 text-[15px] leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <img src={t.photo} alt="" className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                  <div><p className="font-semibold">{t.name}</p><p className="text-xs text-muted">{t.role}</p></div>
                  <div className="ml-auto"><Stars n={t.rating} /></div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="relative isolate overflow-hidden py-24 text-white sm:py-32">
        <img src={site.images.events} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 -z-10 bg-black/70" />
        <div className="container-x grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[.25em] text-[#5fd3a3] uppercase">Private dining & events</p>
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">Celebrate with us, from 10 to 120 guests</h2>
            <p className="mt-4 max-w-lg text-white/80">Birthdays, rehearsal dinners, team offsites. Tailored menus, a dedicated host and the whole terrace if you want it.</p>
          </Reveal>
          <Reveal className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-md">
            <ul className="space-y-3">
              {['Custom set menus and open bar packages', 'Private terrace for up to 40 guests', 'Full venue buyout for up to 120', 'Reply from our events team within 24 hours'].map(x => (
                <li key={x} className="flex gap-3"><Check className="shrink-0 text-[#5fd3a3]" size={20} />{x}</li>
              ))}
            </ul>
            <Link to="/contact?subject=Private event" className="btn-primary mt-7 w-full">Plan your event</Link>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-x py-20 sm:py-28">
        <SectionTitle eyebrow="@emberandoak" title="A taste of the atmosphere" center />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {site.gallery.map((src, i) => (
            <Reveal key={src} delay={(i % 4) * 0.06} className={i === 0 || i === 5 ? 'md:col-span-2 md:row-span-2' : ''}>
              <img src={src} alt="" loading="lazy" className="h-full min-h-40 w-full rounded-2xl object-cover transition duration-500 hover:opacity-85" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ember px-6 py-14 text-center text-on-ember sm:px-12">
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">Hungry yet?</h2>
          <p className="mx-auto mt-3 max-w-md opacity-85">Tables for tonight are going fast. Book in under a minute, no account needed.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/reservations" className="btn bg-[#04140d] text-white hover:bg-black">Reserve a table</Link>
            <Link to="/menu" className="btn border border-current hover:bg-white/15">Order online</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}

function PromoBanner() {
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard?.writeText('WELCOME10').then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }, () => {})
  return (
    <section className="border-y border-line bg-surface-2">
      <div className="container-x flex flex-col items-center justify-between gap-5 py-8 text-center sm:flex-row sm:text-left">
        <div>
          <p className="font-display text-2xl font-semibold">10% off your first online order</p>
          <p className="text-sm text-muted">Pickup or delivery. Use this code at checkout.</p>
        </div>
        <button onClick={copy} className="flex items-center gap-3 rounded-full border-2 border-dashed border-ember px-6 py-3 font-mono text-lg font-bold tracking-widest text-ember transition hover:bg-ember/10">
          WELCOME10 {copied ? <Check size={18} /> : <Copy size={18} />}
          <span className="sr-only" aria-live="polite">{copied ? 'Copied' : ''}</span>
        </button>
      </div>
    </section>
  )
}
