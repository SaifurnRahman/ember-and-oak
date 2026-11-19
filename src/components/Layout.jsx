import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Flame, Mail, MapPin, Menu as MenuIcon, MessageCircle, Moon, Phone, ShoppingBag, Sun, X } from 'lucide-react'
import { load, openStatus, save, site, useCart } from '../store.jsx'
import CartDrawer from './CartDrawer.jsx'

const HERO_PAGES = ['/', '/menu', '/reservations', '/about', '/contact']
const LINKS = [['/menu', 'Menu'], ['/reservations', 'Reservations'], ['/about', 'About'], ['/contact', 'Contact']]

export default function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-ember focus:px-4 focus:py-2 focus:text-on-ember">Skip to content</a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <a
        href={`https://wa.me/${site.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-110"
      >
        <MessageCircle size={26} />
      </a>
    </>
  )
}

function useTheme() {
  const [light, setLight] = useState(() => load('eo-theme', 'dark') === 'light')
  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    save('eo-theme', light ? 'light' : 'dark')
  }, [light])
  return [light, () => setLight(l => !l)]
}

function Navbar() {
  const { count, setOpen } = useCart()
  const [light, toggle] = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setMobile(false) }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  // Pages that open on a dark photo hero keep a transparent light-on-dark bar until scrolled.
  const solid = scrolled || mobile || !HERO_PAGES.includes(pathname)
  const iconBtn = 'relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/10'

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'border-b border-line bg-bg/90 py-3 backdrop-blur-xl' : 'py-5 text-white'}`}>
      <div className="container-x flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold whitespace-nowrap sm:text-2xl">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ember text-on-ember"><Flame size={19} /></span>
          {site.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-medium transition hover:text-ember ${isActive ? 'text-ember' : ''}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button className={iconBtn} onClick={toggle} aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}>
            {light ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button className={iconBtn} onClick={() => setOpen(true)} aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={19} />
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold text-on-ember">{count}</span>}
          </button>
          <Link to="/reservations" className="btn-primary ml-2 hidden !px-5 !py-2.5 sm:inline-flex">Book a table</Link>
          <button className={`${iconBtn} md:hidden`} onClick={() => setMobile(m => !m)} aria-label="Toggle menu" aria-expanded={mobile}>
            {mobile ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobile && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden" aria-label="Mobile">
            <div className="container-x flex flex-col gap-1 py-4">
              {[['/', 'Home'], ...LINKS].map(([to, label]) => (
                <NavLink key={to} to={to} end className={({ isActive }) => `rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-surface-2 text-ember' : ''}`}>{label}</NavLink>
              ))}
              <Link to="/reservations" className="btn-primary mt-2">Book a table</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  const [joined, setJoined] = useState(false)
  const status = openStatus()
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-semibold">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ember text-on-ember"><Flame size={19} /></span>
            {site.name}
          </Link>
          <p className="mt-4 text-sm text-muted">{site.tagline}. Seasonal produce, live fire and a warm welcome since 2014.</p>
          <div className="mt-5 flex gap-4 text-sm font-medium">
            <a href={site.social.instagram} target="_blank" rel="noreferrer" className="hover:text-ember">Instagram</a>
            <a href={site.social.facebook} target="_blank" rel="noreferrer" className="hover:text-ember">Facebook</a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-semibold"><Clock size={16} className="text-ember" /> Opening hours</h3>
          <ul className="space-y-1.5 text-sm text-muted">
            {[...site.hours.slice(1), site.hours[0]].map(h => (
              <li key={h.day} className={`flex justify-between gap-4 ${h.day === site.hours[new Date().getDay()].day ? 'font-semibold text-ink' : ''}`}>
                <span>{h.day}</span><span>{h.open ? `${h.open} – ${h.close}` : 'Closed'}</span>
              </li>
            ))}
          </ul>
          <p className={`mt-3 text-sm font-medium ${status.open ? 'text-green-500' : 'text-muted'}`}>● {status.text}</p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Visit & contact</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-ember" />{site.address}</li>
            <li><a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className="flex gap-2 hover:text-ember"><Phone size={16} className="shrink-0 text-ember" />{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="flex gap-2 hover:text-ember"><Mail size={16} className="shrink-0 text-ember" />{site.email}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold">Get 10% off your first order</h3>
          <p className="mb-4 text-sm text-muted">Join our list for new dishes, events and members-only offers.</p>
          {joined ? (
            <p className="rounded-xl bg-surface-2 p-4 text-sm">You're in! Use code <b className="text-ember">WELCOME10</b> at checkout.</p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setJoined(true) }} className="flex gap-2">
              <label htmlFor="news" className="sr-only">Email address</label>
              <input id="news" type="email" required placeholder="you@email.com" className="input !py-2.5" />
              <button className="btn-primary !px-4 !py-2.5">Join</button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/admin" className="hover:text-ember">Owner dashboard</Link>
            <span>{site.credit}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
