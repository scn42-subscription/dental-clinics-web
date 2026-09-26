/**
 * "Tiny Teeth Assistant" chat widget - a DISPLAY-ONLY sample bot: no AI
 * service, no API keys, no data sent anywhere. Answers come from the fixed
 * keyword rules in lib/chatbot.ts. Panel with typing indicator, quick-reply
 * chips and actions (open booking, call, show the contact section).
 */
import { Headset, MessageCircle, Phone, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { GREETING, reply, type BotReply } from '@/lib/chatbot'
import { CLINIC } from '@/lib/clinic'
import { useGoTo } from './Navbar'

type Msg = { from: 'bot' | 'me'; text: string; chips?: string[]; call?: boolean }

function Avatar({ size = 'size-9' }: { size?: string }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-white/15`}>
      <Headset className="size-5" />
    </span>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', ...GREETING }])
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState('')
  const [nudge, setNudge] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const goTo = useGoTo()

  // "Need help?" bubble after a few seconds, once per visit.
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 9000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    setNudge(false)
    const t = setTimeout(() => input.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  const runAction = (r: BotReply) => {
    if (r.action === 'book') {
      setTimeout(() => {
        setOpen(false)
        goTo('book')
      }, 1100)
    }
    if (r.action === 'map') setTimeout(() => goTo('visit'), 1400)
  }

  const send = (raw: string) => {
    const message = raw.trim()
    if (!message || typing) return
    setText('')
    setMsgs((m) => [...m, { from: 'me', text: message }])
    setTyping(true)
    const r = reply(message)
    setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'bot', text: r.text, chips: r.chips, call: r.action === 'call' }])
      runAction(r)
    }, 550 + Math.min(r.text.length * 8, 900))
  }

  const lastChips = msgs.at(-1)?.from === 'bot' ? msgs.at(-1)?.chips : undefined

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      <div
        className={`${open ? 'flex' : 'hidden'} animate-in fade-in slide-in-from-bottom-2 h-[min(560px,calc(100svh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-18px_rgb(16_34_58/0.4)]`}
        role="dialog"
        aria-label="Chat with the Tiny Teeth assistant"
      >
        <div className="flex items-center gap-3 bg-navy px-4 py-3.5 text-white">
          <Avatar />
          <div className="flex-1 leading-tight">
            <p className="font-bold">Tiny Teeth Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-white/80">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Sample assistant · demo answers only
            </p>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="flex size-9 items-center justify-center rounded-full hover:bg-white/15" aria-label="Close chat">
            <X className="size-5" />
          </button>
        </div>

        <div ref={list} className="flex-1 space-y-3 overflow-y-auto bg-ice p-4" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === 'me' ? 'rounded-br-sm bg-brand text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-ink'}`}
              >
                {m.text}
                {m.call && (
                  <a href={CLINIC.phoneHref} className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-brand py-2 font-semibold text-white">
                    <Phone className="size-3.5" /> Call {CLINIC.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex w-fit gap-1 rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3" aria-label="Assistant is typing">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1.5 rounded-full bg-brand" style={{ animation: `typing-dot 1s ${d * 0.15}s infinite` }} />
              ))}
            </div>
          )}
          {lastChips && !typing && (
            <div className="flex flex-wrap gap-2 pt-1">
              {lastChips.map((c) => (
                <button key={c} type="button" onClick={() => send(c)} className="rounded-full border border-brand/40 bg-white px-3 py-1 text-xs font-semibold text-brand transition hover:bg-brand hover:text-white">
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(text)
          }}
          className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
        >
          <input
            ref={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about hours, insurance, booking…"
            className="h-11 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand"
            aria-label="Your message"
            maxLength={300}
          />
          <button type="submit" className="flex size-11 items-center justify-center rounded-lg bg-brand text-white disabled:opacity-40" disabled={!text.trim() || typing} aria-label="Send">
            <Send className="size-4" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        {nudge && !open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="animate-in fade-in slide-in-from-right-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy shadow-[0_10px_30px_-12px_rgb(16_34_58/0.35)]"
          >
            Questions? We’re here to help
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative flex size-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_12px_30px_-8px_rgb(30_91_215/0.7)] transition hover:bg-brand-deep"
          aria-label={open ? 'Close chat' : 'Open chat'}
          aria-expanded={open}
        >
          {open ? <X className="size-6" /> : <MessageCircle className="size-7" />}
          {!open && nudge && <span className="absolute top-0 right-0 size-3.5 rounded-full border-2 border-white bg-emerald-400" />}
        </button>
      </div>
    </div>
  )
}
