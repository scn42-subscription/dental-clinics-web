/**
 * Working "Request an appointment" module.
 *
 * Flow: pick a service -> pick a day (shadcn Calendar; Sundays, past days and
 * days > 60 ahead disabled) -> live time slots load from the API -> child &
 * parent details -> confirm. The server rejects double bookings (409) and we
 * surface that as a toast and refresh the slots.
 *
 * On success a dialog shows the reference and an "Add to calendar" .ics
 * download. When the API is down the form says "Demo mode" and bookings are
 * saved in this browser only (see lib/api.ts).
 */
import { format } from 'date-fns'
import { CalendarPlus, Check, Clock, Loader2, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { bookingMode, BookingError, createBooking, getSlots, icsFor, type BookingConfirmation, type DaySlots } from '@/lib/api'
import { CLINIC, SERVICES, type ServiceId } from '@/lib/clinic'
import { BOOK_SERVICE_EVENT } from './Sections'

const EMPTY = { child_name: '', child_age: '', parent_name: '', phone: '', email: '', notes: '' }

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2.5 text-sm font-bold text-navy">
      <span className="flex size-6 items-center justify-center rounded-full bg-brand text-xs text-white">{n}</span>
      {children}
    </p>
  )
}

export default function Booking() {
  const [mode, setMode] = useState<'live' | 'demo' | null>(null)
  const [service, setService] = useState<ServiceId>('checkup')
  const [day, setDay] = useState<Date | undefined>()
  const [slots, setSlots] = useState<DaySlots | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [time, setTime] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<BookingConfirmation | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDay = new Date(today)
  maxDay.setDate(maxDay.getDate() + 60)

  useEffect(() => {
    bookingMode().then(setMode)
    // "Book this service" on a service card pre-selects that service.
    const pick = (e: Event) => setService((e as CustomEvent<ServiceId>).detail)
    addEventListener(BOOK_SERVICE_EVENT, pick)
    return () => removeEventListener(BOOK_SERVICE_EVENT, pick)
  }, [])

  const loadSlots = async (d: Date) => {
    setLoadingSlots(true)
    setTime(null)
    try {
      setSlots(await getSlots(format(d, 'yyyy-MM-dd')))
    } catch (e) {
      setSlots(null)
      toast.error(e instanceof BookingError ? e.message : 'Could not load times. Please try again.')
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (day) loadSlots(day)
  }, [day])

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const phoneOk = form.phone.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '').length === 10
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const ageNum = Number(form.child_age)
  const ageOk = form.child_age !== '' && Number.isInteger(ageNum) && ageNum >= 0 && ageNum <= 17
  const ready = !!day && !!time && form.child_name.trim() && form.parent_name.trim().length >= 2 && phoneOk && emailOk && ageOk
  const serviceLabel = SERVICES.find((s) => s.id === service)!.title

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ready || !day || !time) {
      toast.error('Please choose a date and time and complete the required fields.')
      return
    }
    setSubmitting(true)
    try {
      const c = await createBooking(
        {
          date: format(day, 'yyyy-MM-dd'),
          time,
          service,
          child_name: form.child_name.trim(),
          child_age: ageNum,
          parent_name: form.parent_name.trim(),
          phone: form.phone,
          email: form.email.trim(),
          notes: form.notes.trim(),
        },
        serviceLabel,
      )
      setDone(c)
    } catch (err) {
      toast.error(err instanceof BookingError ? err.message : 'Could not reach the clinic. Please call us.')
      loadSlots(day)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setDone(null)
    setForm(EMPTY)
    setTime(null)
    if (day) loadSlots(day)
  }

  const downloadIcs = () => {
    if (!done) return
    const blob = new Blob([icsFor(done, CLINIC.address.join(', '))], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tiny-teeth-${done.reference}.ics`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const chip = (active: boolean) =>
    `rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition ${active ? 'border-brand bg-brand text-white' : 'border-slate-200 bg-white text-ink/80 hover:border-brand hover:text-brand'}`

  return (
    <section id="book" className="section scroll-mt-24 bg-ice">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
        {/* Info column */}
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">Appointments</p>
          <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,2.75rem)] leading-tight font-extrabold text-navy">Request an appointment</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/65">
            Choose a time that suits your family. You will receive a confirmation reference immediately, and our team
            will contact you if anything needs to change.
          </p>
          <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 card-shadow">
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-bold text-navy">Prefer to call?</p>
                <a href={CLINIC.phoneHref} className="text-brand hover:underline">
                  {CLINIC.phone}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand" />
              <div className="text-sm text-ink/70">
                <p className="mb-1 font-bold text-navy">Opening hours</p>
                {CLINIC.hours.map(([d, h]) => (
                  <p key={d} className="flex justify-between gap-6">
                    <span>{d}</span>
                    <span className="tabular-nums">{h}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
              <p className="text-sm text-ink/70">{CLINIC.address.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={submit} noValidate className="reveal rounded-2xl border border-slate-200 bg-white p-5 card-shadow sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <h3 className="text-xl font-bold text-navy">Appointment details</h3>
            {mode && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === 'live' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                title={mode === 'demo' ? 'Booking server offline: saved in this browser only' : 'Connected to the booking server'}
              >
                {mode === 'live' ? '● Online booking' : 'Demo mode'}
              </span>
            )}
          </div>

          <StepLabel n={1}>Reason for visit</StepLabel>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3" role="radiogroup" aria-label="Service">
            {SERVICES.map((s) => (
              <button key={s.id} type="button" role="radio" aria-checked={s.id === service} onClick={() => setService(s.id)} className={chip(s.id === service)}>
                {s.title}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr]">
            <div>
              <StepLabel n={2}>Preferred date</StepLabel>
              <div className="flex justify-center rounded-xl border border-slate-200 md:block">
                <Calendar
                  mode="single"
                  selected={day}
                  onSelect={setDay}
                  disabled={[{ before: today }, { after: maxDay }, { dayOfWeek: [0] }]}
                  startMonth={today}
                  endMonth={maxDay}
                  className="rounded-xl [--cell-size:--spacing(9)] [&_[data-selected-single=true]]:!bg-brand [&_[data-selected-single=true]]:!text-white"
                />
              </div>
            </div>
            <div>
              <StepLabel n={3}>Preferred time</StepLabel>
              {!day && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-ink/50">Please select a date first.</p>}
              {day && loadingSlots && (
                <p className="flex items-center gap-2 p-6 text-sm text-ink/50">
                  <Loader2 className="size-4 animate-spin" /> Checking availability…
                </p>
              )}
              {day && !loadingSlots && slots && (
                <>
                  <p className="mb-2 text-sm text-ink/55">{format(day, 'EEEE, MMMM d')}</p>
                  {slots.closed ? (
                    <p className="text-sm">The practice is closed on this day.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4">
                      {slots.slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          onClick={() => setTime(s.time)}
                          aria-pressed={time === s.time}
                          className={`rounded-lg border py-2 text-sm font-semibold tabular-nums transition ${time === s.time ? 'border-brand bg-brand text-white' : 'border-slate-200 hover:border-brand hover:text-brand'} disabled:cursor-not-allowed disabled:border-transparent disabled:bg-slate-100 disabled:text-slate-400 disabled:line-through`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                  {!slots.closed && slots.slots.every((s) => !s.available) && <p className="mt-3 text-sm">No times left on this day — please choose another.</p>}
                </>
              )}
            </div>
          </div>

          <div className="mt-8">
            <StepLabel n={4}>Patient & contact details</StepLabel>
            <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
              <Field label="Child’s first name *" id="child_name">
                <Input id="child_name" value={form.child_name} onChange={set('child_name')} autoComplete="off" required maxLength={80} />
              </Field>
              <Field label="Age *" id="child_age" error={form.child_age !== '' && !ageOk ? '0–17' : undefined}>
                <Input id="child_age" type="number" inputMode="numeric" min={0} max={17} value={form.child_age} onChange={set('child_age')} required />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Parent / guardian name *" id="parent_name">
                <Input id="parent_name" value={form.parent_name} onChange={set('parent_name')} autoComplete="name" required maxLength={80} />
              </Field>
              <Field label="Mobile number *" id="phone" error={form.phone && !phoneOk ? '10-digit US number' : undefined}>
                <Input id="phone" type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="(713) 555-0100" required />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Email address *" id="email" error={form.email && !emailOk ? 'Please check the email' : undefined}>
                <Input id="email" type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Notes for the team (optional)" id="notes">
                <Textarea id="notes" value={form.notes} onChange={set('notes')} maxLength={500} placeholder="Allergies, medical conditions, or anything that helps us prepare" />
              </Field>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/65">
              {day && time ? (
                <>
                  <b className="text-navy">{serviceLabel}</b> · {format(day, 'EEE, MMM d')} at <b className="text-navy">{time}</b>
                </>
              ) : (
                'No time selected yet'
              )}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-brand px-7 py-3.5 font-semibold text-white transition hover:bg-brand-deep disabled:opacity-60"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />}
              Request appointment
            </button>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            By submitting you agree to our{' '}
            <Link to="/privacy" className="underline">
              privacy policy
            </Link>
            . We never sell your information.
          </p>
        </form>
      </div>

      <Confirmation done={done} onClose={reset} onIcs={downloadIcs} />
    </section>
  )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="flex justify-between text-sm font-semibold text-navy">
        {label}
        {error && <span className="text-xs font-medium text-red-600">{error}</span>}
      </Label>
      <div className="[&_input]:h-11 [&_input]:rounded-lg [&_input]:border-slate-300 [&_input]:focus-visible:border-brand [&_textarea]:rounded-lg [&_textarea]:border-slate-300 [&_textarea]:focus-visible:border-brand">
        {children}
      </div>
    </div>
  )
}

function Confirmation({ done, onClose, onIcs }: { done: BookingConfirmation | null; onClose: () => void; onIcs: () => void }) {
  return (
    <Dialog open={!!done} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-2xl p-8 text-center sm:max-w-md">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Check className="size-7" strokeWidth={3} />
        </div>
        <DialogTitle className="mt-4 text-2xl font-extrabold text-navy">Appointment requested</DialogTitle>
        <DialogDescription asChild>
          <div className="text-base text-ink/65">
            {done && (
              <>
                <p>
                  <b className="text-navy">{done.child_name}</b> · {done.service}
                  <br />
                  {format(new Date(`${done.date}T00:00:00`), 'EEEE, MMMM d')} at <b className="text-navy">{done.time}</b>
                </p>
                <p className="mt-4 text-sm">Your reference</p>
                <p className="mt-1 inline-block rounded-lg bg-ice px-4 py-2 font-mono text-lg font-bold text-navy">{done.reference}</p>
                {done.demo && <p className="mt-3 text-xs">Demo mode: saved in this browser only.</p>}
              </>
            )}
          </div>
        </DialogDescription>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onIcs} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 font-semibold text-navy hover:border-brand hover:text-brand">
            <CalendarPlus className="size-4" /> Add to calendar
          </button>
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white hover:bg-brand-deep">
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
