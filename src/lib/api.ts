/**
 * Booking API client.
 *
 * Live mode talks to the FastAPI server (`server/app.py`) through the Vite
 * `/api` proxy. If that server is not running - e.g. the site was deployed as
 * static files for a sales demo - it falls back to DEMO mode: the same slot
 * rules run in the browser and bookings are kept in localStorage, and the UI
 * says so honestly.
 */
import type { ServiceId } from './clinic'

export type Slot = { time: string; available: boolean }
export type DaySlots = { date: string; closed: boolean; slots: Slot[] }

export type BookingRequest = {
  date: string
  time: string
  service: ServiceId
  child_name: string
  child_age: number
  parent_name: string
  phone: string
  email: string
  notes: string
}

export type BookingConfirmation = {
  reference: string
  date: string
  time: string
  service: string
  child_name: string
  demo?: boolean
}

export class BookingError extends Error {}

// ------------------------------------------------------------------ mode

let modePromise: Promise<'live' | 'demo'> | null = null

/** Checks once whether the booking server answers; cached for the session. */
export function bookingMode(): Promise<'live' | 'demo'> {
  modePromise ??= fetch('/api/health', { signal: AbortSignal.timeout(2500) })
    .then(async (r) => (r.ok && (await r.json()).ok ? 'live' : 'demo'))
    .catch(() => 'demo' as const)
  return modePromise
}

// ------------------------------------------------------------- demo rules
// Mirror of OPENING_HOURS in server/app.py (weekday Mon=0 -> [open, close] hours).

const HOURS: Record<number, [number, number]> = {
  0: [9, 17],
  1: [9, 17],
  2: [9, 17],
  3: [9, 19],
  4: [9, 17],
  5: [9, 13],
}
const DEMO_KEY = 'tinyteeth-demo-bookings'

const jsWeekdayToMon0 = (d: Date) => (d.getDay() + 6) % 7

function demoSlots(date: string): DaySlots {
  const day = new Date(`${date}T00:00:00`)
  const hours = HOURS[jsWeekdayToMon0(day)]
  if (!hours) return { date, closed: true, slots: [] }
  const taken = new Set(readDemo().filter((b) => b.date === date).map((b) => b.time))
  const slots: Slot[] = []
  for (let m = hours[0] * 60; m + 30 <= hours[1] * 60; m += 30) {
    const time = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
    const past = new Date(`${date}T${time}:00`) <= new Date()
    slots.push({ time, available: !taken.has(time) && !past })
  }
  return { date, closed: false, slots }
}

function readDemo(): BookingRequest[] {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) ?? '[]')
  } catch {
    return []
  }
}

// ------------------------------------------------------------------ calls

async function errorText(r: Response): Promise<string> {
  try {
    const body = await r.json()
    if (typeof body.detail === 'string') return body.detail
    if (Array.isArray(body.detail)) {
      const field = body.detail[0]?.loc?.at(-1)
      return `Please check the ${String(field).replace('_', ' ')} field.`
    }
  } catch {
    /* fall through */
  }
  return 'Something went wrong. Please call us instead.'
}

/** Slots for one day (YYYY-MM-DD). */
export async function getSlots(date: string): Promise<DaySlots> {
  if ((await bookingMode()) === 'demo') return demoSlots(date)
  const r = await fetch(`/api/slots?date=${date}`)
  if (!r.ok) throw new BookingError(await errorText(r))
  return r.json()
}

/** Books a slot; throws BookingError with a friendly message on failure. */
export async function createBooking(b: BookingRequest, serviceLabel: string): Promise<BookingConfirmation> {
  if ((await bookingMode()) === 'demo') {
    const slot = demoSlots(b.date).slots.find((s) => s.time === b.time)
    if (!slot?.available) throw new BookingError('Sorry, that slot was just taken. Please pick another.')
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify([...readDemo(), b]))
    } catch {
      /* private mode: still confirm, nothing persisted */
    }
    const reference = `TT-${Math.random().toString(16).slice(2, 8).toUpperCase()}`
    return { reference, date: b.date, time: b.time, service: serviceLabel, child_name: b.child_name, demo: true }
  }
  const r = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(b),
  })
  if (!r.ok) throw new BookingError(await errorText(r))
  return r.json()
}

/** Builds an .ics calendar file for the confirmed visit. */
export function icsFor(c: BookingConfirmation, address: string): string {
  const start = `${c.date.replaceAll('-', '')}T${c.time.replace(':', '')}00`
  const [h, m] = c.time.split(':').map(Number)
  const endMin = h * 60 + m + 30
  const end = `${c.date.replaceAll('-', '')}T${String(Math.floor(endMin / 60)).padStart(2, '0')}${String(endMin % 60).padStart(2, '0')}00`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Tiny Teeth//Booking//EN',
    'BEGIN:VEVENT',
    `UID:${c.reference}@tinyteeth.example`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${c.child_name} – ${c.service} (Tiny Teeth)`,
    `LOCATION:${address}`,
    `DESCRIPTION:Booking reference ${c.reference}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
