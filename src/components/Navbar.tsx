/**
 * Site header, in the style of established clinic sites:
 *
 * - Navy utility bar: opening hours, address and phone (hidden on phones).
 * - White sticky navbar: logo, section links, phone and "Book Appointment".
 *   It gains a shadow once the page scrolls.
 * - On phones the links collapse into a simple drop-down panel.
 */
import { Clock, MapPin, Menu, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { CLINIC } from '@/lib/clinic'

export const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Our Dentist' },
  { id: 'first-visit', label: 'First Visit' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'faq', label: 'FAQ' },
  { id: 'visit', label: 'Contact' },
]

/** Scrolls to a home-page section, navigating home first if needed. */
export function useGoTo() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (id: string) => {
    if (pathname === '/') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    else navigate(`/#${id}`)
  }
}

/** Tooth mark + wordmark. `light` for use on navy backgrounds. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`flex size-10 items-center justify-center rounded-xl ${light ? 'bg-white/10' : 'bg-brand'}`}>
        <svg viewBox="30 28 140 190" className="h-6 w-auto" aria-hidden>
          <path
            d="M100 48C82 30 46 32 40 62c-5 26 6 52 14 68 6 14 5 52 15 70 8 13 18 3 20-16 2-18 5-30 11-30s9 12 11 30c2 19 12 29 20 16 10-18 9-56 15-70 8-16 19-42 14-68-6-30-42-32-60-14z"
            fill="none"
            stroke="#fff"
            strokeWidth="13"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>{CLINIC.name}</span>
        <span className={`block text-[11px] font-semibold tracking-[0.12em] uppercase ${light ? 'text-white/60' : 'text-brand'}`}>
          {CLINIC.tagline}
        </span>
      </span>
    </span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const goTo = useGoTo()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    goTo(id)
  }

  return (
    <>
      <div className="hidden bg-navy text-[13px] text-white/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="size-3.5" /> Mon–Fri 9am–5pm · Thu until 7pm · Sat 9am–1pm
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5" /> {CLINIC.address.join(', ')}
            </span>
          </div>
          <a href={CLINIC.phoneHref} className="flex items-center gap-2 font-semibold text-white hover:underline">
            <Phone className="size-3.5" /> {CLINIC.phone}
          </a>
        </div>
      </div>

      <header className={`sticky top-0 z-50 border-b bg-white transition-shadow ${scrolled ? 'border-transparent shadow-[0_6px_24px_-12px_rgb(16_34_58/0.25)]' : 'border-slate-200'}`}>
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
          <Link to="/" aria-label={`${CLINIC.fullName} home`} onClick={() => window.scrollTo({ top: 0 })}>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`/#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    goTo(l.id)
                  }}
                  className="rounded-md px-3 py-2 text-[15px] font-medium text-ink/80 transition hover:text-brand"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href={CLINIC.phoneHref} className="hidden items-center gap-2 text-[15px] font-semibold text-navy lg:flex">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Phone className="size-4" />
              </span>
              {CLINIC.phone}
            </a>
            <button
              type="button"
              onClick={() => goTo('book')}
              className="hidden rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep sm:block"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex size-11 items-center justify-center rounded-lg border border-slate-200 text-navy xl:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-slate-200 bg-white xl:hidden">
            <ul className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button type="button" onClick={() => go(l.id)} className="w-full border-b border-slate-100 py-3 text-left font-medium text-ink">
                    {l.label}
                  </button>
                </li>
              ))}
              <li className="flex flex-col gap-2 pt-4 sm:flex-row">
                <button type="button" onClick={() => go('book')} className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white">
                  Book Appointment
                </button>
                <a href={CLINIC.phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 font-semibold text-navy">
                  <Phone className="size-4" /> {CLINIC.phone}
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  )
}
