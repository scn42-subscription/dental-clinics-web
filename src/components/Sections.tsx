/**
 * Home-page content sections, laid out like established clinic websites:
 *
 * - Highlights    four reasons to choose the practice (icon strip)
 * - Services      photo cards; "Book this service" pre-selects it in the form
 * - About         photo pair + practice story, checklist and key numbers
 * - Team          lead dentist, credentials, team-at-work photo
 * - FirstVisit    what to expect, four numbered steps beside a photo
 * - Testimonials  three written reviews with the overall rating
 * - Faq           accordion of common parent questions
 * - CtaBand       full-width photo banner with a booking call to action
 */
import { ArrowRight, Award, BadgeCheck, CalendarClock, Check, HeartHandshake, Minus, Phone, Plus, ShieldPlus, Star } from 'lucide-react'

import { CLINIC, FAQS, SERVICES, STATS, TESTIMONIALS, type ServiceId } from '@/lib/clinic'
import { useGoTo } from './Navbar'

/** Ask the booking form to pre-select a service (Booking.tsx listens). */
export const BOOK_SERVICE_EVENT = 'tt:book-service'

function SectionHead({ eyebrow, title, intro, center = false }: { eyebrow: string; title: string; intro?: string; center?: boolean }) {
  return (
    <div className={`reveal mb-12 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-tight font-extrabold text-navy">{title}</h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink/65">{intro}</p>}
    </div>
  )
}

// -------------------------------------------------------------- highlights

const HIGHLIGHTS = [
  { Icon: Award, title: 'Board-certified specialists', text: 'Two extra years of training focused only on children.' },
  { Icon: HeartHandshake, title: 'Gentle, child-first approach', text: 'We explain, show, then treat — at your child’s pace.' },
  { Icon: CalendarClock, title: 'Evening & Saturday hours', text: 'Thursday until 7 pm and Saturday mornings.' },
  { Icon: ShieldPlus, title: 'Most insurance accepted', text: 'PPO plans, Texas Medicaid and CHIP.' },
]

export function Highlights() {
  return (
    <section className="border-y border-slate-200 bg-white px-4 py-12 sm:px-6">
      <ul className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map(({ Icon, title, text }) => (
          <li key={title} className="reveal flex gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Icon className="size-6" />
            </span>
            <div>
              <h3 className="font-bold text-navy">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---------------------------------------------------------------- services

export function Services() {
  const goTo = useGoTo()
  const book = (id: ServiceId) => {
    window.dispatchEvent(new CustomEvent(BOOK_SERVICE_EVENT, { detail: id }))
    goTo('book')
  }
  return (
    <section id="services" className="section scroll-mt-24 bg-ice">
      <div className="mx-auto max-w-7xl">
        <SectionHead
          eyebrow="Our services"
          title="Complete dental care from the first tooth to the teenage years"
          intro="Everything your child needs, delivered by a team that works exclusively with young patients."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article key={s.id} className="reveal group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white card-shadow">
              <div className="overflow-hidden">
                <img src={s.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-navy">{s.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-ink/65">{s.blurb}</p>
                <button
                  type="button"
                  onClick={() => book(s.id)}
                  className="mt-5 flex w-fit items-center gap-2 text-sm font-semibold text-brand transition hover:gap-3"
                >
                  Book this service <ArrowRight className="size-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------- about

export function About() {
  return (
    <section id="about" className="section scroll-mt-24 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="reveal grid grid-cols-5 gap-4">
          <img src="/images/clinic.jpg" alt="Bright, modern treatment room" loading="lazy" className="col-span-3 aspect-[3/4] w-full rounded-2xl object-cover card-shadow" />
          <div className="col-span-2 flex flex-col gap-4 pt-10">
            <img src="/images/waiting-room.jpg" alt="Comfortable waiting area" loading="lazy" className="aspect-square w-full rounded-2xl object-cover card-shadow" />
            <img src="/images/treatment-room.jpg" alt="Dental chair with modern equipment" loading="lazy" className="aspect-square w-full rounded-2xl object-cover card-shadow" />
          </div>
        </div>
        <div>
          <SectionHead
            eyebrow="About our practice"
            title="A practice designed around children — and the parents who bring them"
          />
          <div className="reveal space-y-4 text-lg leading-relaxed text-ink/70">
            <p>
              {CLINIC.fullName} was founded on a simple belief: good habits and positive experiences in childhood
              lead to healthy smiles for life. Our office, our schedule and our team are built entirely around
              young patients.
            </p>
          </div>
          <ul className="reveal mt-7 grid gap-3 sm:grid-cols-2">
            {['Digital X-rays with minimal radiation', 'Parents welcome in every room', 'Quiet room for sensory needs', 'Clear pricing before treatment'].map((t) => (
              <li key={t} className="flex items-start gap-3 font-medium text-ink/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <dl className="reveal mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white p-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-navy">{s.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-ink/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// -------------------------------------------------------------------- team

export function Team() {
  const d = CLINIC.doctor
  return (
    <section id="team" className="section scroll-mt-24 bg-navy text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="reveal relative">
          <img
            src="/images/team.jpg"
            alt="One of our dentists treating a young patient"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <p className="absolute bottom-4 left-4 rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-navy">Our team at work</p>
        </div>
        <div>
          <p className="reveal eyebrow !text-sky-300">Meet your dentist</p>
          <h2 className="reveal mt-3 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-tight font-extrabold">{d.name}</h2>
          <p className="reveal mt-2 font-semibold text-sky-200">{d.title}</p>
          <p className="reveal mt-6 text-lg leading-relaxed text-white/75">{d.bio}</p>
          <ul className="reveal mt-8 grid gap-3">
            {d.credentials.map((c) => (
              <li key={c} className="flex items-start gap-3 text-white/85">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-sky-300" /> {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------- first visit

const STEPS = [
  { title: 'Welcome & tour', text: 'We greet your child by name and show them around so the office feels familiar.' },
  { title: 'Gentle examination', text: 'A careful look at teeth, gums and growth, explained in words your child understands.' },
  { title: 'Cleaning & fluoride', text: 'A gentle polish and fluoride varnish, with X-rays only if they are truly needed.' },
  { title: 'Plan & advice', text: 'We walk you through findings, next steps and simple tips for brushing at home.' },
]

export function FirstVisit() {
  return (
    <section id="first-visit" className="section scroll-mt-24 bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="lg:order-2">
          <SectionHead
            eyebrow="Your first visit"
            title="What to expect at your child’s first appointment"
            intro="Most first visits take about 45 minutes. Parents stay with their child throughout."
          />
          <ol className="grid gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="reveal flex gap-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-brand font-bold text-brand">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-navy">{s.title}</h3>
                  <p className="mt-1 leading-relaxed text-ink/65">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <img
          src="/images/first-visit.jpg"
          alt="A dentist and a young girl in a child-friendly treatment room"
          loading="lazy"
          className="reveal aspect-[4/3] w-full rounded-2xl object-cover card-shadow lg:order-1"
        />
      </div>
    </section>
  )
}

// ------------------------------------------------------------ testimonials

export function Testimonials() {
  return (
    <section id="reviews" className="section scroll-mt-24 bg-ice">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Patient reviews" title="Trusted by Houston families" />
          <div className="reveal mb-12 flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 card-shadow">
            <span className="text-4xl font-extrabold text-navy">4.9</span>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-1 text-sm text-ink/60">Based on 380+ Google reviews</p>
            </div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="reveal flex flex-col rounded-2xl border border-slate-200 bg-white p-7 card-shadow">
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink/75">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-soft font-bold text-brand">
                  {t.name[0]}
                </span>
                <span>
                  <span className="block font-bold text-navy">{t.name}</span>
                  <span className="text-sm text-ink/55">{t.detail}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-ink/45">Sample reviews for demonstration purposes.</p>
      </div>
    </section>
  )
}

// --------------------------------------------------------------------- faq

export function Faq() {
  return (
    <section id="faq" className="section scroll-mt-24 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHead eyebrow="FAQ" title="Questions parents often ask" intro="Can’t find what you’re looking for? Our front-desk team is happy to help." />
          <a href={CLINIC.phoneHref} className="reveal inline-flex items-center gap-2 font-semibold text-brand">
            <Phone className="size-4" /> Call {CLINIC.phone}
          </a>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQS.map((f, i) => (
            <details key={f.q} className="reveal group py-5" open={i === 0}>
              <summary className="flex items-center justify-between gap-6 text-lg font-semibold text-navy">
                {f.q}
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Plus className="size-4 group-open:hidden" />
                  <Minus className="hidden size-4 group-open:block" />
                </span>
              </summary>
              <p className="mt-3 pr-12 leading-relaxed text-ink/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----------------------------------------------------------------- cta band

export function CtaBand() {
  const goTo = useGoTo()
  return (
    <section className="relative isolate overflow-hidden">
      <img src="/images/cta.jpg" alt="" loading="lazy" className="absolute inset-0 -z-10 size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/40" />
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="reveal max-w-xl text-white">
          <h2 className="text-[clamp(1.9rem,3.6vw,2.75rem)] leading-tight font-extrabold">New patients are always welcome</h2>
          <p className="mt-4 text-lg text-white/80">
            Book online in under a minute, or call and our team will find a time that works around school and naps.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => goTo('book')} className="rounded-lg bg-white px-7 py-4 font-semibold text-navy transition hover:bg-brand-soft">
              Book an Appointment
            </button>
            <a href={CLINIC.phoneHref} className="flex items-center justify-center gap-2 rounded-lg border border-white/40 px-7 py-4 font-semibold text-white transition hover:bg-white/10">
              <Phone className="size-4" /> {CLINIC.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
