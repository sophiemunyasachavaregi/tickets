'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type InventoryMap = Record<string, Record<string, { total: number; sold: number }>>

const EVENTS = [
  { value: '13 Mar 2027 (Sat.)', day: 'Saturday', label: '13 Mar 2027' },
  { value: '14 Mar 2027 (Sun.)', day: 'Sunday',   label: '14 Mar 2027' },
  { value: '16 Mar 2027 (Tue.)', day: 'Tuesday',  label: '16 Mar 2027' },
]

const TICKET_DEFS = [
  {
    id: 'vip', name: 'VIP SOUNDCHECK', price: 25000, isVip: true,
    perks: ['Floor Standing access', 'Pre-Show Soundcheck Party', 'VIP Laminate & Lanyard', 'Early Merchandise Access', 'Exclusive VIP gift item'],
  },
  {
    id: 'floor', name: 'FLOOR STANDING', price: 20000, isVip: false,
    perks: ['General Floor Standing area', 'Closest to the stage', 'Best view of the show'],
  },
  {
    id: 'bleachers1', name: 'BLEACHERS 1', price: 13500, isVip: false,
    perks: ['Premium bleacher seating', 'Great sightlines'],
  },
  {
    id: 'bleachers2', name: 'BLEACHERS 2', price: 7500, isVip: false,
    perks: ['Standard bleacher seating', 'Full stadium view'],
  },
]

function availText(avail: number, total: number) {
  if (avail <= 0) return { text: 'Sold Out', cls: 'out' }
  if (avail <= Math.ceil(total * 0.15)) return { text: `${avail} left — almost gone!`, cls: 'low' }
  return { text: `${avail} available`, cls: 'ok' }
}

export default function HomeClient({ inventory }: { inventory: InventoryMap }) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  function getDateStatus(date: string) {
    const cats = inventory[date]
    if (!cats) return 'sold-out'
    return Object.values(cats).some(v => v.total - v.sold > 0) ? 'available' : 'sold-out'
  }

  function ticketsForDate(date: string) {
    if (!date) return []
    return TICKET_DEFS.filter(t => inventory[date]?.[t.name] !== undefined)
  }

  function getAvail(date: string, category: string) {
    const e = inventory[date]?.[category]
    return e ? { avail: e.total - e.sold, total: e.total } : null
  }

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    setSelectedTicket(null)
    setTimeout(() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function handleBuyNow() {
    if (!selectedTicket || !selectedDate) return
    router.push(`/checkout?ticketId=${selectedTicket}&eventDate=${encodeURIComponent(selectedDate)}`)
  }

  const selectedTicketDef = TICKET_DEFS.find(t => t.id === selectedTicket)
  const ticketsToShow = ticketsForDate(selectedDate)

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-flag" aria-label="Philippines flag">🇵🇭</div>
        <div className="navbar-brand">BTS ARIRANG PRESALE</div>
        <div className="navbar-powered">
          Powered by <strong>Ticketmaster.ph</strong>
        </div>
        <div className="navbar-partners">
          <span>Also via</span>
          Live Nation &bull; SMTickets
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-img-wrap">
          <Image
            src="/image.png"
            alt="BTS WORLD TOUR ARIRANG — Bulacan, Philippine Sports Stadium"
            width={1400}
            height={560}
            priority
            style={{ width: '100%', height: 'auto', maxWidth: 1400 }}
          />
        </div>
        <div className="hero-info-bar">
          <div className="hero-info-inner">
            <div className="hero-info-item">
              <span className="hi-label">Artist</span>
              <span className="hi-value">BTS</span>
            </div>
            <div className="hero-info-item">
              <span className="hi-label">Tour</span>
              <span className="hi-value">World Tour &lsquo;ARIRANG&rsquo;</span>
            </div>
            <div className="hero-info-item">
              <span className="hi-label">Venue</span>
              <span className="hi-value">Philippine Sports Stadium, Bulacan</span>
            </div>
            <div className="hero-info-item">
              <span className="hi-label">Dates</span>
              <span className="hi-value">Mar 13, 14 &amp; 16, 2027</span>
            </div>
            <div className="hero-info-item">
              <span className="hi-label">ARMY Presale</span>
              <span className="hi-value">June 19 &bull; 9:00 AM PHT</span>
            </div>
          </div>
        </div>
      </section>

      <div className="page-content">

        {/* EVENT TABLE */}
        <div className="section-header">
          <h2>SELECT AN EVENT</h2>
          <p>BTS WORLD TOUR &lsquo;ARIRANG&rsquo; — Philippine Sports Stadium, Bulacan</p>
        </div>

        <div className="event-table-wrap">
          <table className="event-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Event Name</th>
                <th>Venue</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {EVENTS.map(ev => {
                const status = getDateStatus(ev.value)
                const isAvail = status === 'available'
                return (
                  <tr key={ev.value}>
                    <td><strong>{ev.label}</strong> ({ev.day})</td>
                    <td className="td-name">BTS WORLD TOUR &lsquo;ARIRANG&rsquo; IN BULACAN</td>
                    <td className="td-venue">Philippine Sports Stadium</td>
                    <td>
                      <span className={`status-pill ${status}`}>
                        <span className="dot" />
                        {status === 'sold-out' ? 'Sold Out' : 'Available'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-get-tickets"
                        disabled={!isAvail}
                        onClick={() => handleSelectDate(ev.value)}
                      >
                        {selectedDate === ev.value ? 'Selected ✓' : 'Get Tickets'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* TICKETS */}
        <div className="tickets-section" id="tickets">
          <div className="section-header" style={{ paddingTop: 0 }}>
            <h2>TICKET PRICING</h2>
            <p>
              {selectedDate
                ? `Showing tickets for ${selectedDate} — select a category to proceed.`
                : 'Click "Get Tickets" on an event date above to see available categories.'}
            </p>
          </div>

          {!selectedDate ? (
            <div style={{ background: 'var(--white)', border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-md)', padding: 32, textAlign: 'center', color: 'var(--gray-400)', fontSize: 14 }}>
              Please select an event date above to view available tickets.
            </div>
          ) : (
            <div className="tickets-grid">
              {ticketsToShow.map(t => {
                const inv = getAvail(selectedDate, t.name)
                const avail = inv ? inv.avail : 0
                const isUnavail = avail <= 0
                const { text: availLabel, cls: availCls } = inv ? availText(avail, inv.total) : { text: 'N/A', cls: 'out' }
                return (
                  <div
                    key={t.id}
                    className={`ticket-card ${t.isVip ? 'vip' : ''} ${selectedTicket === t.id ? 'selected' : ''} ${isUnavail ? 'unavailable' : ''}`}
                    onClick={() => !isUnavail && setSelectedTicket(t.id)}
                  >
                    <div className="select-check">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className={`tc-badge ${t.isVip ? 'vip' : ''} ${isUnavail ? 'unavailable' : ''}`}>
                      {isUnavail ? 'Sold Out' : t.isVip ? 'VIP Package' : 'General'}
                    </div>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-price">&#8369;{t.price.toLocaleString()}</div>
                    <div className="tc-fee">+ &#8369;100 online fee per ticket</div>
                    {inv && (
                      <div className="tc-avail">
                        <span className={`avail-dot ${availCls}`} />
                        {availLabel}
                      </div>
                    )}
                    <ul className="tc-perks">
                      {t.perks.map(p => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}

          {selectedTicket && selectedTicketDef && (
            <div className="proceed-bar" style={{ marginTop: 20 }}>
              <div className="pb-info">
                <div className="pb-ticket">{selectedDate} — {selectedTicketDef.name}</div>
                <div className="pb-price">&#8369;{selectedTicketDef.price.toLocaleString()} per ticket</div>
              </div>
              <button className="btn-proceed" onClick={handleBuyNow}>
                Proceed to Checkout →
              </button>
            </div>
          )}
        </div>

        {/* PRESALE INFO */}
        <div className="section-header" id="presale-info">
          <h2>PRESALE INFORMATION</h2>
          <p>Eligibility details for all sale windows.</p>
        </div>
        <div className="presale-grid">
          {[
            { icon: '🎫', title: 'ARMY Membership Presale', body: <><strong>June 19, 2027 · 9AM–10PM PHT</strong><br /><br />Requires <strong>ARMY MEMBERSHIP (GLOBAL)</strong>. Register on Weverse by <strong>May 27 at 10PM PHT</strong>. Your membership number (BA + 9 digits) unlocks the tickets.</> },
            { icon: '🎶', title: 'Live Nation Presale', body: <>For <strong>Live Nation members only</strong>. Log into your account on livenation.ph to access. Sign up at <strong>livenation.ph</strong> to become a member.</> },
            { icon: '🌐', title: 'General Onsale', body: <><strong>June 20, 2027 · 9AM PHT</strong><br /><br />Open to the general public. No presale code required. First-come, first-served.</> },
            { icon: '⚠️', title: 'Ticket Limit', body: <>Maximum <strong>2 tickets per account per order</strong>, maximum <strong>4 tickets per show</strong>. Orders exceeding the limit may be cancelled without notice.</> },
            { icon: '💳', title: 'Pricing & Fees', body: <>Tickets resold at the <strong>same price</strong> as official partners. A <strong>P100 online fee</strong> is added per ticket. Payment via <strong>Maya</strong> or <strong>GCash</strong>.</> },
            { icon: '🔑', title: 'Find Your ARMY Number', body: <>Weverse → BTS → Membership icon → View Membership Details. Starts with <strong>BA</strong> + 9 digits. Only <strong>GLOBAL Membership</strong> valid for Asia-Pacific shows.</> },
          ].map(card => (
            <div key={card.title} className="info-card">
              <span className="ic-icon">{card.icon}</span>
              <div className="ic-title">{card.title}</div>
              <div className="ic-body">{card.body}</div>
            </div>
          ))}
        </div>

        {/* ABOUT */}
        <div className="about-section" style={{ margin: '0 -40px', padding: '0 40px' }}>
          <div className="about-grid">
            <div className="about-text">
              <div className="section-header" style={{ paddingTop: 0 }}>
                <h2>ABOUT BTS</h2>
              </div>
              <p>BTS, an acronym of Bangtan Sonyeondan or &ldquo;Beyond the Scene,&rdquo; are a GRAMMY-nominated South Korean boyband that has been capturing the hearts of millions of fans globally since their debut in June 2013. The members of BTS are RM, Jin, SUGA, j-hope, Jimin, V, and Jung Kook.</p>
              <p>Gaining recognition for their authentic and self-produced music, top-notch performances, and the way they interact with their fans, the band has established themselves as 21st century pop icons breaking countless world records.</p>
              <p>BTS will release their fifth studio album <strong>ARIRANG</strong> on March 20, 2026 with a massive world tour to follow — a return set to be etched in pop culture history. They are 5-time GRAMMY nominees and TIME&apos;s Entertainer of the Year 2020.</p>
              <div className="partners-row">
                {['Ticketmaster', 'Live Nation', 'SMTickets', 'HYBE'].map(p => (
                  <span key={p} className="partner-chip">{p}</span>
                ))}
              </div>
            </div>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.pexels.com/photos/1763067/pexels-photo-1763067.jpeg?auto=compress&cs=tinysrgb&w=700"
                alt="Concert atmosphere"
                style={{ width: '100%', borderRadius: 'var(--radius-md)', aspectRatio: '4/3', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="fn">BTS ARIRANG</div>
              <p>Official presale partner for BTS WORLD TOUR &lsquo;ARIRANG&rsquo; IN BULACAN. Powered by Ticketmaster.ph.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Tickets</h4>
                <ul>
                  <li><Link href="#tickets">Buy Tickets</Link></li>
                  <li><Link href="#presale-info">Presale Info</Link></li>
                  <li><Link href="#tickets">VIP Packages</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Shows</h4>
                <ul>
                  <li><Link href="#tickets">Mar 13 · Sat</Link></li>
                  <li><Link href="#tickets">Mar 14 · Sun</Link></li>
                  <li><Link href="#tickets">Mar 16 · Tue</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h4>Partners</h4>
                <ul>
                  <li><a href="https://www.ticketmaster.ph" target="_blank" rel="noreferrer">Ticketmaster.ph</a></li>
                  <li><a href="https://www.livenation.ph" target="_blank" rel="noreferrer">Live Nation</a></li>
                  <li><a href="https://smtickets.com" target="_blank" rel="noreferrer">SMTickets</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 BTS ARIRANG Presale · Powered by Ticketmaster.ph. All rights reserved.</p>
            <p>
              <Link href="#">Terms of Use</Link> &bull; <Link href="#">Privacy Policy</Link> &bull; <Link href="#">Purchase Policy</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
