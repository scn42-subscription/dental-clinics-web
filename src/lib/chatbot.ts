/**
 * Rule-based FAQ brain for the sample chat assistant (display only).
 *
 * No AI, no network: each intent has keywords; the message is scored against
 * every intent and the best match answers. Intents can attach an action
 * (e.g. open the booking section) and suggested follow-up chips.
 *
 * Example: "do you take insurance?" -> hits "insurance" -> insurance answer.
 */
import { CLINIC } from './clinic'

export type BotAction = 'book' | 'call' | 'map'
export type BotReply = { text: string; action?: BotAction; chips?: string[] }

type Intent = { keywords: string[]; reply: BotReply }

const DEFAULT_CHIPS = ['Book a visit', 'Opening hours', 'Insurance', 'My child is scared']

const INTENTS: Intent[] = [
  {
    keywords: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good afternoon'],
    reply: {
      text: 'Hello! I can help with appointments, opening hours, insurance and what to expect at a visit. How can I help?',
      chips: DEFAULT_CHIPS,
    },
  },
  {
    keywords: ['book', 'appointment', 'schedule', 'slot', 'visit', 'reserve', 'available'],
    reply: {
      text: "Of course. I'll take you to the appointment form, where you can choose a service, date and time. It takes about a minute.",
      action: 'book',
    },
  },
  {
    keywords: ['hour', 'open', 'close', 'time', 'saturday', 'sunday', 'weekend', 'evening', 'thursday'],
    reply: {
      text: `We're open ${CLINIC.hours.map(([d, h]) => `${d}: ${h}`).join(' · ')}. Thursday evenings are great for after-school visits.`,
      chips: ['Book a visit', 'Where are you?'],
    },
  },
  {
    keywords: ['where', 'address', 'location', 'direction', 'parking', 'map', 'find you'],
    reply: {
      text: `We're at ${CLINIC.address.join(', ')}. Free parking right out front, and the entrance is stroller-friendly.`,
      action: 'map',
      chips: ['Opening hours', 'Book a visit'],
    },
  },
  {
    keywords: ['insurance', 'medicaid', 'chip', 'ppo', 'delta', 'cigna', 'aetna', 'covered', 'coverage'],
    reply: {
      text: 'We accept most PPO plans, Texas Medicaid and CHIP. Bring your card and we handle the paperwork. No insurance? Ask about our Tiny Teeth membership plan.',
      chips: ['Prices', 'Book a visit'],
    },
  },
  {
    keywords: ['price', 'cost', 'how much', 'fee', 'expensive', 'cheap', 'pay', 'membership'],
    reply: {
      text: 'Sample fees without insurance: check-up and cleaning $95, sealants $40 per tooth, infant first visit $65. We always provide a written estimate before treatment.',
      chips: ['Insurance', 'Book a visit'],
    },
  },
  {
    keywords: ['scared', 'afraid', 'nervous', 'anxious', 'fear', 'cry', 'autism', 'sensory', 'special needs'],
    reply: {
      text: "That's very common. We use a 'tell-show-do' approach: we explain each step, show the instruments, then begin at your child's pace. We also have a quiet room and noise-cancelling headphones, and parents are always welcome to stay.",
      chips: ['First visit', 'Book a visit'],
    },
  },
  {
    keywords: ['first', 'baby', 'toddler', 'age', 'when should', 'how old', 'infant'],
    reply: {
      text: 'The first visit should be by the 1st birthday or when the first tooth appears. It\'s a short, gentle exam, usually done with your child on your lap.',
      chips: ['Book a visit', 'Prices'],
    },
  },
  {
    keywords: ['emergency', 'pain', 'hurt', 'broke', 'broken', 'chipped', 'knocked', 'bleeding', 'swollen', 'toothache', 'urgent'],
    reply: {
      text: `Please call us now on ${CLINIC.phone} — we hold same-day emergency slots every morning. If a permanent tooth was knocked out, keep it in milk and come straight in.`,
      action: 'call',
      chips: ['Where are you?'],
    },
  },
  {
    keywords: ['brace', 'orthodont', 'crooked', 'bite', 'aligner', 'invisalign'],
    reply: {
      text: 'We do early bite checks from age 7. Most kids just need monitoring; if treatment helps, we explain every option in plain English.',
      chips: ['Book a visit'],
    },
  },
  {
    keywords: ['sealant', 'fluoride', 'cavity', 'cavities', 'filling', 'decay', 'sugar'],
    reply: {
      text: 'Sealants are a thin protective coating on the chewing surfaces of back teeth that prevents most cavities. Fluoride varnish takes seconds, and all our fillings are tooth-coloured.',
      chips: ['Prices', 'Book a visit'],
    },
  },
  {
    keywords: ['cancel', 'reschedule', 'change my', 'move my'],
    reply: {
      text: `Of course — please call ${CLINIC.phone} or reply to your confirmation email at least 24 hours ahead and we'll move it.`,
      action: 'call',
    },
  },
  {
    keywords: ['thank', 'thanks', 'cool', 'great', 'awesome', 'bye'],
    reply: { text: "You're welcome. Remember: brush twice a day for two minutes with a fluoride toothpaste.", chips: ['Book a visit'] },
  },
]

const CHIP_ALIASES: Record<string, string> = {
  'Where are you?': 'where address',
  'First visit': 'first visit age',
  'My child is scared': 'scared',
  Prices: 'price',
  'Opening hours': 'hours',
}

/** Picks the best reply for a user message. */
export function reply(message: string): BotReply {
  const text = ` ${(CHIP_ALIASES[message] ?? message).toLowerCase()} `
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((n, k) => {
      // Short keywords must match a whole word ("hi" should not match "child").
      const hit = k.length <= 3 ? new RegExp(`\\b${k}\\b`).test(text) : text.includes(k)
      return n + (hit ? k.length : 0)
    }, 0)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return (
    best?.reply ?? {
      text: `I'm not able to answer that one. Please call our team on ${CLINIC.phone}, or try one of these:`,
      chips: DEFAULT_CHIPS,
    }
  )
}

export const GREETING: BotReply = {
  text: "Hello, welcome to Tiny Teeth Pediatric Dentistry. I'm a sample assistant — ask about appointments, hours or insurance, or choose a question below.",
  chips: DEFAULT_CHIPS,
}
