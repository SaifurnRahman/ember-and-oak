import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { menu, site } from '../store.jsx'
import { DishCard, PageHero, Reveal, TAG_KEYS, Tag } from '../components/ui.jsx'

export default function Menu() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [tags, setTags] = useState([])
  const toggle = t => setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t])

  const term = q.trim().toLowerCase()
  const shown = menu.items.filter(i =>
    (cat === 'All' || i.category === cat) &&
    tags.every(t => i.tags.includes(t)) &&
    (!term || (i.name + ' ' + i.desc).toLowerCase().includes(term))
  )
  const groups = menu.categories.map(c => [c, shown.filter(i => i.category === c)]).filter(([, list]) => list.length)

  return (
    <>
      <PageHero eyebrow="Order online · Pickup or delivery" title="Our Menu" text={`Cooked to order over oak and charcoal. Free delivery on orders over ${site.currency}${site.delivery.freeOver}.`} image={site.images.bar} />

      <div className="sticky top-[65px] z-30 border-b border-line bg-bg/90 backdrop-blur-xl">
        <div className="container-x space-y-3 py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="tablist" aria-label="Categories">
            {['All', ...menu.categories].map(c => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`chip ${cat === c ? 'chip-on' : ''}`}>{c}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-72">
              <Search size={17} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
              <label htmlFor="q" className="sr-only">Search dishes</label>
              <input id="q" value={q} onChange={e => setQ(e.target.value)} placeholder="Search dishes…" className="input !py-2.5 !pl-10" />
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Dietary filters">
              {TAG_KEYS.map(t => (
                <button key={t} aria-pressed={tags.includes(t)} onClick={() => toggle(t)} className={`chip !px-3 !py-1.5 ${tags.includes(t) ? '!border-ember bg-ember/10' : ''}`}><Tag t={t} /></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="container-x py-12 sm:py-16">
        {groups.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl">No dishes match those filters</p>
            <button className="btn-ghost mt-5" onClick={() => { setQ(''); setTags([]); setCat('All') }}><X size={16} /> Clear filters</button>
          </div>
        ) : groups.map(([c, list]) => (
          <div key={c} className="mb-16 last:mb-0">
            <Reveal className="mb-6 flex items-baseline gap-4">
              <h2 className="font-display text-3xl font-semibold">{c}</h2>
              <span className="h-px flex-1 bg-line" />
              <span className="text-sm text-muted">{list.length} dishes</span>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map(item => <DishCard key={item.id} item={item} />)}
            </div>
          </div>
        ))}
        <p className="mt-12 text-center text-sm text-muted">Allergies? Tell us at checkout or call {site.phone}. Prices include service; tax is added at checkout.</p>
      </section>
    </>
  )
}
