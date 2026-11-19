import { Link } from 'react-router'
import { Award, Flame, Heart, Sprout } from 'lucide-react'
import { site } from '../store.jsx'
import { PageHero, Reveal, SectionTitle } from '../components/ui.jsx'

const VALUES = [
  [Sprout, 'Local first', 'Over 80% of our produce comes from farms within 150 miles. The menu changes when the seasons do.'],
  [Flame, 'Real fire', 'No gas, no shortcuts. Everything on the grill is cooked over seasoned oak and charcoal.'],
  [Heart, 'Warm hospitality', 'Our team is paid fairly and trained well, and you can feel it from the moment you walk in.'],
]
const PRESS = ['Michelin Bib Gourmand 2025', 'NY Eater · Best New Grill', 'Time Out · Top 10 Brooklyn', 'TripAdvisor Travellers’ Choice']

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="A neighbourhood grill with big heart" text="Since 2014 we've been lighting the fire every morning at 7am." image={site.images.interior} />

      <section className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
        <div>
          <SectionTitle eyebrow="Our story" title="It started with one grill and a promise" />
          <Reveal className="space-y-4 text-muted">
            <p>Chef Marco Bellini opened Ember & Oak in a former boat workshop on Harbor Street with a second-hand grill and twelve seats. The idea was simple: cook the food he loved over real fire, and buy it from people he knew by name.</p>
            <p>Today we seat 120 guests, run a busy delivery kitchen and still buy our beef from the same family farm in upstate New York. The grill is bigger, but the promise hasn't changed.</p>
          </Reveal>
        </div>
        <Reveal className="grid grid-cols-2 gap-4">
          <img src={site.images.story} alt="Chef plating a dish" className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
          <img src={site.images.kitchen} alt="Cooking over open flames" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
        </Reveal>
      </section>

      <section className="bg-surface py-20">
        <div className="container-x">
          <SectionTitle eyebrow="What we stand for" title="Three things we never compromise on" center />
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map(([Icon, t, d], i) => (
              <Reveal key={t} delay={i * 0.1} className="card p-8 text-center">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-ember/15 text-ember"><Icon size={24} /></span>
                <h3 className="font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-20">
        <SectionTitle eyebrow="The team" title="The people behind the fire" center />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {site.team.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08} className="group">
              <div className="overflow-hidden rounded-2xl">
                <img src={p.photo} alt={p.name} loading="lazy" className="aspect-[3/4] w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{p.name}</h3>
              <p className="text-sm text-ember">{p.role}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface-2 py-10">
        <div className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PRESS.map(p => <span key={p} className="flex items-center gap-2 text-sm font-semibold text-muted"><Award size={18} className="text-ember" />{p}</span>)}
        </div>
      </section>

      <section className="container-x py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Come and taste it for yourself</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/reservations" className="btn-primary">Book a table</Link>
            <Link to="/menu" className="btn-ghost">See the menu</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
