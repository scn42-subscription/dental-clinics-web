/**
 * Sample privacy policy for the demo clinic. Written in plain English and
 * structured the way a US pediatric practice would need (HIPAA, COPPA,
 * Texas). It is SAMPLE text - a real clinic must have it reviewed by counsel.
 */
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { CLINIC } from '@/lib/clinic'

const UPDATED = 'September 26, 2026'

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'who',
    title: '1. Who we are',
    body: (
      <p>
        {CLINIC.fullName} (“we”, “us”) is a pediatric dental practice located at {CLINIC.address.join(', ')}. This
        policy explains what information we collect through this website and at our clinic, why we collect it, and
        the choices you have.
      </p>
    ),
  },
  {
    id: 'collect',
    title: '2. Information we collect',
    body: (
      <>
        <p>When you book an appointment or contact us we collect:</p>
        <ul>
          <li>Parent or guardian name, phone number and email address;</li>
          <li>Your child’s first name, age and the reason for the visit;</li>
          <li>Anything you choose to tell us in the notes field (for example allergies or anxieties).</li>
        </ul>
        <p>
          When you browse the site we collect basic technical data (browser type, pages visited, approximate location
          from IP address) through server logs. We do not use advertising trackers.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    title: '3. How we use it',
    body: (
      <ul>
        <li>To schedule, confirm and remind you about appointments;</li>
        <li>To prepare for your child’s visit and provide safe care;</li>
        <li>To process insurance and billing;</li>
        <li>To answer questions you send us, including through the chat assistant;</li>
        <li>To meet legal and regulatory obligations.</li>
      </ul>
    ),
  },
  {
    id: 'hipaa',
    title: '4. Health information & HIPAA',
    body: (
      <p>
        Information about your child’s dental health is Protected Health Information under the Health Insurance
        Portability and Accountability Act (HIPAA). We use and disclose it only for treatment, payment and health-care
        operations, or with your written authorization. Our full Notice of Privacy Practices is available at the front
        desk and on request. You have the right to access, copy and request corrections to your child’s records.
      </p>
    ),
  },
  {
    id: 'children',
    title: '5. Children’s privacy (COPPA)',
    body: (
      <p>
        This website is intended for parents and guardians. We do not knowingly collect personal information online
        directly from children under 13. Bookings must be made by a parent or legal guardian. If you believe a child has
        sent us information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: 'sharing',
    title: '6. Who we share it with',
    body: (
      <>
        <p>We never sell or rent your information. We share it only with:</p>
        <ul>
          <li>Your dental insurer, to process claims;</li>
          <li>Service providers who help us run the practice (scheduling, reminders, hosting) under confidentiality agreements;</li>
          <li>Other health-care providers involved in your child’s care, with your consent;</li>
          <li>Authorities, where the law requires it.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'cookies',
    title: '7. Cookies & local storage',
    body: (
      <p>
        We use only essential browser storage needed to make the site work (for example, remembering a booking in
        progress). No advertising or cross-site tracking cookies are used. Map tiles are loaded from OpenStreetMap and
        avatar illustrations from DiceBear; those services may receive your IP address.
      </p>
    ),
  },
  {
    id: 'security',
    title: '8. Security & retention',
    body: (
      <p>
        Data is encrypted in transit (HTTPS) and access is limited to staff who need it. Appointment requests are kept
        for up to 24 months; clinical records are kept for the period required by the Texas State Board of Dental
        Examiners (at least five years after the last treatment, or until a minor turns 23, whichever is longer).
      </p>
    ),
  },
  {
    id: 'rights',
    title: '9. Your choices & rights',
    body: (
      <ul>
        <li>Ask for a copy of the information we hold about you or your child;</li>
        <li>Ask us to correct or delete information (subject to legal record-keeping duties);</li>
        <li>Opt out of appointment reminders or marketing messages at any time by replying STOP or contacting us;</li>
        <li>File a complaint with us or with the U.S. Department of Health &amp; Human Services, Office for Civil Rights.</li>
      </ul>
    ),
  },
  {
    id: 'accessibility',
    title: '10. Accessibility',
    body: (
      <p>
        We aim to meet WCAG 2.1 AA. The site respects your device’s “reduce motion” setting. If anything is hard to use,
        call {CLINIC.phone} and we will help you book by phone.
      </p>
    ),
  },
  {
    id: 'contact',
    title: '11. Contact & changes',
    body: (
      <p>
        Privacy Officer, {CLINIC.fullName}, {CLINIC.address.join(', ')} · {CLINIC.phone} · {CLINIC.email}. If we change
        this policy we will update the date at the top of this page.
      </p>
    ),
  },
]

export default function Privacy() {
  const { hash } = useLocation()
  useLayoutEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <main className="bg-ice px-4 pt-14 pb-24 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-[clamp(2.2rem,5vw,3.2rem)] leading-tight font-extrabold text-navy">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">Last updated {UPDATED}</p>
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <b>Sample document.</b> This policy belongs to a fictional clinic on a demo website. It is a realistic template,
          not legal advice — have a real practice’s policy reviewed by a qualified attorney.
        </p>

        <nav aria-label="On this page" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-3 text-sm font-bold text-navy">On this page</p>
          <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-brand underline-offset-4 hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-8 space-y-10 rounded-2xl border border-slate-200 bg-white p-6 leading-relaxed text-ink/75 sm:p-10 [&_li]:mt-1.5 [&_p+p]:mt-3 [&_p+ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul+p]:mt-3">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="mb-3 text-xl font-bold text-navy sm:text-2xl">{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}
