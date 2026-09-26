/**
 * Navy footer in the style of established clinic sites: practice summary,
 * quick links, services, contact details with opening hours, a map, and the
 * legal bar.
 */
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CLINIC, SERVICES } from '@/lib/clinic'
import { Logo, NAV_LINKS, useGoTo } from './Navbar'

export default function Footer() {
  const goTo = useGoTo()
  const heading = 'mb-5 text-sm font-bold tracking-[0.12em] text-white uppercase'
  const link = 'text-white/70 transition hover:text-white'
  return (
    <footer id="visit" className="scroll-mt-24 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs leading-relaxed text-white/70">
            Specialist dental care for infants, children and teens in Houston — preventive, restorative and emergency
            care in one welcoming practice.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
            <iframe title="Map showing the practice location" src={CLINIC.mapEmbed} className="h-40 w-full" loading="lazy" />
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className={heading}>Quick links</h3>
          <ul className="space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => goTo(l.id)} className={link}>
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={() => goTo('book')} className={link}>
                Book Appointment
              </button>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className={heading}>Services</h3>
          <ul className="space-y-3">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => goTo('services')} className={`${link} text-left`}>
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={heading}>Contact</h3>
          <ul className="space-y-4 text-white/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-sky-300" />
              <a href={CLINIC.mapLink} target="_blank" rel="noreferrer" className="hover:text-white">
                {CLINIC.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </a>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-sky-300" />
              <a href={CLINIC.phoneHref} className="font-semibold text-white hover:underline">
                {CLINIC.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-5 shrink-0 text-sky-300" />
              <a href={`mailto:${CLINIC.email}`} className="hover:text-white">
                {CLINIC.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-sky-300" />
              <dl className="w-full space-y-1 text-sm">
                {CLINIC.hours.map(([d, h]) => (
                  <div key={d} className="flex justify-between gap-4">
                    <dt>{d}</dt>
                    <dd className="tabular-nums text-white">{h}</dd>
                  </div>
                ))}
              </dl>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-white/55 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.fullName}. Sample website — fictional practice.
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Legal">
            <Link to="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/privacy#hipaa" className="hover:text-white">
              HIPAA Notice
            </Link>
            <Link to="/privacy#accessibility" className="hover:text-white">
              Accessibility
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
