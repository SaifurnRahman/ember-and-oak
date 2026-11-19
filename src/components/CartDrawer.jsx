import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import { money, site, useCart } from '../store.jsx'
import { QtyStepper } from './ui.jsx'

export default function CartDrawer() {
  const { open, setOpen, lines, subtotal, add } = useCart()
  const nav = useNavigate()
  const left = site.delivery.freeOver - subtotal

  useEffect(() => {
    if (!open) return
    const esc = e => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [open, setOpen])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog" aria-modal="true" aria-label="Your order"
            className="fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-line bg-bg"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-line p-5">
              <h2 className="font-display text-2xl font-semibold">Your order</h2>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-2" aria-label="Close cart"><X size={20} /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-ember"><ShoppingBag size={34} /></span>
                <p className="font-display text-xl">Your bag is empty</p>
                <p className="text-sm text-muted">Add a few favourites from the menu to get started.</p>
                <Link to="/menu" onClick={() => setOpen(false)} className="btn-primary">Browse the menu</Link>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-5 py-4">
                  <p className="mb-2 text-sm">
                    {left > 0 ? <>Add <b className="text-ember">{money(left)}</b> more for free delivery</> : <>🎉 You've unlocked <b className="text-ember">free delivery</b></>}
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-ember transition-all" style={{ width: `${Math.min(100, (subtotal / site.delivery.freeOver) * 100)}%` }} />
                  </div>
                </div>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
                  {lines.map(l => (
                    <li key={l.id} className="flex gap-4 py-4">
                      <img src={l.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="leading-snug font-semibold">{l.name}</p>
                          <button onClick={() => add(l.id, -l.qty)} className="text-muted hover:text-red-500" aria-label={`Remove ${l.name}`}><Trash2 size={16} /></button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper id={l.id} qty={l.qty} small />
                          <span className="font-semibold">{money(l.price * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line p-5">
                  <div className="mb-1 flex justify-between text-lg font-semibold"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                  <p className="mb-4 text-xs text-muted">Delivery, tax and promo codes are applied at checkout.</p>
                  <button className="btn-primary w-full !py-4" onClick={() => { setOpen(false); nav('/checkout') }}>Go to checkout · {money(subtotal)}</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
