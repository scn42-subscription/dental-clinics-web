/**
 * Hero: clear value proposition, two calls to action and trust signals on the
 * left; a real clinic photograph on the right with a small "next available"
 * card, as on established practice websites.
 */
import { CalendarCheck, Phone, ShieldCheck, Star } from 'lucide-react'

import { CLINIC } from '@/lib/clinic'
import { useGoTo } from './Navbar'

export default function Hero() {
  const goTo = useGoTo()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ice to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:pt-20 lg:pb-28">
        <div>
          <p className="reveal eyebrow">Pediatric Dentistry · Houston, TX</p>
          <h1 className="reveal mt-4 text-[clamp(2.4rem,5.2vw,3.9rem)] leading-[1.08] font-extrabold text-navy">
            Gentle, expert dental care for <span className="text-brand">growing smiles.</span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Board-certified pediatric dentists caring for infants, children and teens in a calm, child-friendly
            practice. Preventive care, treatment and same-day emergencies — all under one roof.
          </p>

          <div className="reveal mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => goTo('book')}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand px-7 py-4 font-semibold text-white shadow-[0_10px_24px_-10px_rgb(30_91_215/0.7)] transition hover:bg-brand-deep"
            >
              <CalendarCheck className="size-5" /> Book an Appointment
            </button>
            <a
              href={CLINIC.phoneHref}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-7 py-4 font-semibold text-navy transition hover:border-brand hover:text-brand"
            >
              <Phone className="size-5" /> {CLINIC.phone}
            </a>
          </div>

          <dl className="reveal mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-8">
            <div>
              <dt className="sr-only">Google rating</dt>
              <dd className="flex items-center gap-1.5 text-2xl font-extrabold text-navy">
                4.9 <Star className="size-5 fill-amber-400 text-amber-400" />
              </dd>
              <dd className="mt-1 text-sm text-ink/60">380+ Google reviews</dd>
            </div>
            <div>
              <dt className="sr-only">Experience</dt>
              <dd className="text-2xl font-extrabold text-navy">12+ yrs</dd>
              <dd className="mt-1 text-sm text-ink/60">Pediatric-only care</dd>
            </div>
            <div>
              <dt className="sr-only">Insurance</dt>
              <dd className="text-2xl font-extrabold text-navy">PPO</dd>
              <dd className="mt-1 text-sm text-ink/60">Medicaid & CHIP accepted</dd>
            </div>
          </dl>
        </div>

        <div className="reveal relative">
          <div className="overflow-hidden rounded-2xl card-shadow">
            <img
              src="/images/hero.jpg"
              alt="A smiling boy giving a thumbs-up from a dental chair"
              className="aspect-[5/4] w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-xl bg-white p-4 pr-6 card-shadow sm:-left-6">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
              <CalendarCheck className="size-6" />
            </span>
            <div>
              <p className="text-sm text-ink/60">Now welcoming new patients</p>
              <p className="font-bold text-navy">Appointments this week</p>
            </div>
          </div>
          <div className="absolute top-5 right-4 hidden items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-navy card-shadow sm:flex">
            <ShieldCheck className="size-4 text-brand" /> Board-certified
          </div>
        </div>
      </div>
    </section>
  )
}
