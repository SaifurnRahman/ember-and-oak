import { motion } from 'framer-motion'
import { Flame, Leaf, Minus, Plus, Sprout, Star, WheatOff } from 'lucide-react'
import { money, useCart } from '../store.jsx'

export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ eyebrow, title, text, center }) {
  return (
    <Reveal className={`mb-10 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[.25em] text-ember uppercase">{eyebrow}</p>}
      <h2 className="font-display text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-muted sm:text-lg">{text}</p>}
    </Reveal>
  )
}

export function PageHero({ eyebrow, title, text, image }) {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/60 to-bg" />
      <div className="container-x text-center text-white">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[.25em] text-[#5fd3a3] uppercase">{eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold sm:text-6xl">{title}</h1>
          {text && <p className="mx-auto mt-4 max-w-xl text-white/80 sm:text-lg">{text}</p>}
        </Reveal>
      </div>
    </section>
  )
}

export function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
    </div>
  )
}

const TAGS = {
  vegetarian: { icon: Leaf, label: 'Vegetarian', cls: 'text-green-500' },
  vegan: { icon: Sprout, label: 'Vegan', cls: 'text-emerald-500' },
  'gluten-free': { icon: WheatOff, label: 'Gluten-free', cls: 'text-amber-500' },
  spicy: { icon: Flame, label: 'Spicy', cls: 'text-red-500' },
}
export const TAG_KEYS = Object.keys(TAGS)
export function Tag({ t }) {
  const { icon: Icon, label, cls } = TAGS[t]
  return <span className={`inline-flex items-center gap-1 text-xs font-medium ${cls}`}><Icon size={13} />{label}</span>
}
export const tagLabel = t => TAGS[t].label

export function QtyStepper({ id, qty, small }) {
  const { add } = useCart()
  const s = small ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-bg">
      <button className={`${s} grid place-items-center rounded-full hover:text-ember`} onClick={() => add(id, -1)} aria-label="Remove one"><Minus size={15} /></button>
      <span className="min-w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
      <button className={`${s} grid place-items-center rounded-full hover:text-ember`} onClick={() => add(id, 1)} aria-label="Add one"><Plus size={15} /></button>
    </div>
  )
}

export function DishCard({ item }) {
  const { items, add, setOpen } = useCart()
  const qty = items[item.id] || 0
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-ember/50 hover:shadow-2xl hover:shadow-black/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        {item.popular && <span className="absolute top-3 left-3 rounded-full bg-ember px-3 py-1 text-xs font-semibold text-on-ember">★ Guest favourite</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg leading-snug font-semibold">{item.name}</h3>
          <span className="font-semibold text-ember">{money(item.price)}</span>
        </div>
        <p className="mt-1.5 flex-1 text-sm text-muted">{item.desc}</p>
        {item.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-3">{item.tags.map(t => <Tag key={t} t={t} />)}</div>}
        <div className="mt-4">
          {qty ? <QtyStepper id={item.id} qty={qty} /> : (
            <button className="btn-ghost w-full" onClick={() => { add(item.id); setOpen(true) }}>
              <Plus size={16} /> Add to order
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
