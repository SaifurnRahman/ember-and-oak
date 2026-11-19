import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[85vh] flex-col items-center justify-center pt-24 text-center">
      <p className="font-display text-8xl font-bold text-ember">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This page went up in smoke</h1>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn-primary">Go home</Link>
        <Link to="/menu" className="btn-ghost">See the menu</Link>
      </div>
    </section>
  )
}
