'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  return (
    <>
      {/* ── TOP DARK BAR ── */}
      <div className="tm-topbar">
        <div className="tm-topbar-inner">
          <div className="tm-topbar-left">
            <button className="tm-loc-btn" onClick={() => setLocOpen(v => !v)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/navbar/image.png" alt="PH flag" width={20} height={14} style={{ borderRadius: 2 }} />
              <span>PH</span>
            </button>
            <button className="tm-loc-btn">
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.93 16.41c.23-.35.75-1.26.74-1.24.31-.48.85-.7 1.35-.7h6c.3 0 .48-.18.48-.48V7.01c0-.31-.19-.51-.49-.51H6c-.3 0-.49.2-.49.5v7c0 .3.18.47.49.47h1.78c.87 0 1.04.51 1.1 1.8l.02.4v.05c0 .4.01.59.04.73a3 3 0 001-1.04zm-3.94-.94c-.86 0-1.49-.62-1.49-1.48V7.01c0-.86.63-1.51 1.49-1.51H18c.86 0 1.49.65 1.49 1.5v7c0 .85-.63 1.47-1.48 1.47h-6c-.19 0-.41.09-.51.24.03-.05-.5.87-.75 1.26-.65.96-1.28 1.53-2.02 1.53-.46 0-.7-.33-.78-.8a5.38 5.38 0 01-.07-.96v-.05l-.02-.37c-.03-.7-.08-.85-.1-.85H6z" />
              </svg>
              <span>EN</span>
            </button>
          </div>
          <div className="tm-topbar-right">
            <a href="https://help.ticketmaster.ph/" target="_blank" rel="noreferrer">Help</a>
          </div>
        </div>

        {/* Location panel */}
        {locOpen && (
          <div className="tm-loc-panel">
            <div className="tm-loc-panel-inner">
              <div className="tm-loc-header">
                <button onClick={() => setLocOpen(false)} className="tm-loc-close">
                  <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
                <span>Location</span>
              </div>
              <p className="tm-loc-current">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/navbar/image.png" alt="PH" width={20} height={14} style={{ borderRadius: 2, marginRight: 6 }} />
                Philippines — English
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN NAVBAR ── */}
      <nav className="tm-navbar">
        <div className="tm-navbar-inner">
          {/* Logo */}
          <div className="tm-navbar-logo">
            <button
              className="tm-mobile-toggle"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#fff" d="M3 4.5h18v3H3v-3zm0 6h18v3H3v-3zm0 6h18v3H3v-3z" />
              </svg>
            </button>
            <Link href="/" className="tm-logo-link">
              {/* Ticketmaster PH logo from their CDN */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.ticketmaster.ph/images/logo/philippines.svg"
                alt="Ticketmaster Philippines"
                className="tm-logo-img"
              />
            </Link>
            {/* SM Tickets partner logo */}
            <div className="tm-partner-divider" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/navbar/image copy copy.png" alt="SM Tickets" width={72} height={28} className="tm-partner-logo" style={{ objectFit: 'contain' }} />
          </div>

          {/* Nav links + search + account */}
          <div className={`tm-navbar-collapse ${mobileOpen ? 'open' : ''}`}>
            <ul className="tm-nav-links">
              <li>
                <Link href="/" className="tm-nav-link">Events</Link>
              </li>
              <li className="tm-nav-dropdown">
                <button
                  className="tm-nav-link tm-nav-btn"
                  onClick={() => { setCatOpen(v => !v); setMoreOpen(false) }}
                >
                  Categories
                  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.99 9.16a.6.6 0 00-.4-.16.6.6 0 00-.42.16.5.5 0 00-.17.37c0 .14.07.28.17.37l5.45 4.92c.04.06.09.1.15.15.14.05.3.05.44 0a.6.6 0 00.18-.11l5.45-4.92a.5.5 0 00.16-.37.5.5 0 00-.16-.37.6.6 0 00-.41-.16.6.6 0 00-.41.16l-5.03 4.46-5-4.5z" />
                  </svg>
                </button>
                {catOpen && (
                  <div className="tm-dropdown-menu">
                    <Link href="/" className="tm-dropdown-item" onClick={() => setCatOpen(false)}>Concerts</Link>
                    <Link href="/" className="tm-dropdown-item" onClick={() => setCatOpen(false)}>Sports</Link>
                    <Link href="/" className="tm-dropdown-item" onClick={() => setCatOpen(false)}>Family Entertainment</Link>
                  </div>
                )}
              </li>
              <li>
                <Link href="/" className="tm-nav-link">Venues</Link>
              </li>
              <li className="tm-nav-hide-md">
                <a href="https://help.ticketmaster.ph/" target="_blank" rel="noreferrer" className="tm-nav-link">Help</a>
              </li>
              <li className="tm-nav-dropdown">
                <button
                  className="tm-nav-link tm-nav-btn"
                  onClick={() => { setMoreOpen(v => !v); setCatOpen(false) }}
                >
                  More
                  <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6.99 9.16a.6.6 0 00-.4-.16.6.6 0 00-.42.16.5.5 0 00-.17.37c0 .14.07.28.17.37l5.45 4.92c.04.06.09.1.15.15.14.05.3.05.44 0a.6.6 0 00.18-.11l5.45-4.92a.5.5 0 00.16-.37.5.5 0 00-.16-.37.6.6 0 00-.41-.16.6.6 0 00-.41.16l-5.03 4.46-5-4.5z" />
                  </svg>
                </button>
                {moreOpen && (
                  <div className="tm-dropdown-menu tm-dropdown-more">
                    <div className="tm-more-col">
                      <Link href="/" className="tm-dropdown-item tm-dropdown-item-bold" onClick={() => setMoreOpen(false)}>Categories</Link>
                      <Link href="/" className="tm-dropdown-item" onClick={() => setMoreOpen(false)}>Venues</Link>
                      <a href="https://help.ticketmaster.ph/" target="_blank" rel="noreferrer" className="tm-dropdown-item" onClick={() => setMoreOpen(false)}>Help</a>
                    </div>
                    <div className="tm-more-col">
                      <Link href="/" className="tm-dropdown-item" onClick={() => setMoreOpen(false)}>Concerts</Link>
                      <Link href="/" className="tm-dropdown-item" onClick={() => setMoreOpen(false)}>Sports</Link>
                      <Link href="/" className="tm-dropdown-item" onClick={() => setMoreOpen(false)}>Family Entertainment</Link>
                    </div>
                  </div>
                )}
              </li>
            </ul>

            {/* Search */}
            <div className="tm-search-wrap">
              <div className="tm-search-input-row">
                <input
                  type="text"
                  className="tm-search-input"
                  placeholder="Search by Event"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                />
                {searchVal && (
                  <button className="tm-search-clear" onClick={() => setSearchVal('')} type="button" aria-label="Clear">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 1C5.95 1 1 5.95 1 12s4.95 11 11 11 11-4.95 11-11S18.05 1 12 1zm4.8 13.9l-1.9 1.9-2.9-2.88-2.9 2.89-1.9-1.92L10.07 12 7.2 9.1l1.92-1.9L12 10.07l2.9-2.89 1.9 1.92-2.87 2.9 2.89 2.9z" />
                    </svg>
                  </button>
                )}
                <button className="tm-search-btn" type="button" aria-label="Search">
                  <svg width="1.3em" height="1.3em" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15.56 14.35l5.19 5.19a.86.86 0 01-1.21 1.2l-5.2-5.18a7.02 7.02 0 111.22-1.21zm-.23-4.33a5.31 5.31 0 10-10.62 0 5.31 5.31 0 0010.62 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sign in */}
            <div className="tm-account">
              <Link href="/login" className="tm-signin-link">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  <path fill="#fff" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18.7a8.7 8.7 0 01-5.62-2.06l.07-.09c1.19-1.48 2.9-2.12 5.55-2.12s4.38.63 5.58 2.09l.07.09A8.66 8.66 0 0112 20.7zm6.51-2.95l-.05-.06C17 16 14.87 15.16 12 15.16S7 16 5.53 17.69v.06a8.71 8.71 0 1113 0z M12 6a4 4 0 104 4 4 4 0 00-4-4zm0 6.7a2.7 2.7 0 112.7-2.7 2.7 2.7 0 01-2.7 2.7z" />
                </svg>
                <span>Sign In/Register</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile overlay */}
        {(mobileOpen || catOpen || moreOpen) && (
          <div
            className="tm-overlay"
            onClick={() => { setMobileOpen(false); setCatOpen(false); setMoreOpen(false) }}
          />
        )}
      </nav>
    </>
  )
}
