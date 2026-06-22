'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const PAYMENT_DETAILS: Record<string, { number: string; color: string }> = {
  maya:  { number: '09XX XXX XXXX', color: '#00c472' },
  gcash: { number: '09XX XXX XXXX', color: '#007dff' },
}

function ConfirmationInner() {
  const params = useSearchParams()
  const ref           = params.get('ref') ?? ''
  const name          = params.get('name') ?? ''
  const email         = params.get('email') ?? ''
  const eventDate     = params.get('eventDate') ?? ''
  const ticketName    = params.get('ticketName') ?? ''
  const quantity      = Number(params.get('quantity') ?? 1)
  const total         = Number(params.get('total') ?? 0)
  const paymentMethod = (params.get('paymentMethod') ?? 'gcash') as 'maya' | 'gcash'

  if (!ref) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-500)', marginBottom: 16 }}>No order found. Please go back and complete your order.</p>
          <Link href="/" style={{ background: 'var(--tm-blue)', color: 'white', padding: '12px 32px', borderRadius: 'var(--radius-xs)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' as const, display: 'inline-block' }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const pay = PAYMENT_DETAILS[paymentMethod]
  const methodLabel = paymentMethod === 'maya' ? 'Maya' : 'GCash'
  const firstName = name.split(' ')[0]

  return (
    <>
      <nav className="navbar">
        <div className="navbar-flag">🇵🇭</div>
        <Link href="/" className="navbar-brand">BTS ARIRANG PRESALE</Link>
        <div className="navbar-powered">Powered by <strong>Ticketmaster.ph</strong></div>
      </nav>

      <div className="confirm-page">
        <div className="confirm-card">
          <div className="confirm-top">
            <div className="confirm-check">✓</div>
            <h1>ORDER RECEIVED</h1>
            <p>
              Thank you, {firstName}! Your order has been submitted.<br />
              Complete your payment below to confirm your tickets.
            </p>
            <div className="confirm-ref">
              Order Reference
              <strong>{ref}</strong>
            </div>
          </div>

          <div className="confirm-details">
            <h3>Order Details</h3>
            <div className="confirm-row">
              <span className="cr-label">Name</span>
              <span className="cr-value">{name}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Email</span>
              <span className="cr-value">{email}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Event</span>
              <span className="cr-value">BTS WORLD TOUR &apos;ARIRANG&apos;<br />{eventDate}<br />Philippine Sports Stadium</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Ticket</span>
              <span className="cr-value">{ticketName} × {quantity}</span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Total Amount</span>
              <span className="cr-value" style={{ color: 'var(--tm-blue)', fontWeight: 800, fontSize: 18 }}>
                &#8369;{total.toLocaleString()}
              </span>
            </div>
            <div className="confirm-row">
              <span className="cr-label">Payment</span>
              <span className="cr-value" style={{ color: pay.color, fontWeight: 700 }}>{methodLabel}</span>
            </div>
          </div>

          <div className="confirm-footer">
            <div className="confirm-payment-info">
              <h4>How to pay via {methodLabel}</h4>
              {[
                <>Open your <strong style={{ color: 'var(--gray-700)' }}>{methodLabel}</strong> app.</>,
                <>Tap <strong style={{ color: 'var(--gray-700)' }}>Send Money</strong> → enter number: <strong style={{ color: 'var(--gray-800)' }}>{pay.number}</strong></>,
                <>Enter amount: <strong style={{ color: 'var(--gray-800)' }}>&#8369;{total.toLocaleString()}</strong></>,
                <>In the Note field, enter reference: <strong style={{ color: 'var(--gray-800)' }}>{ref}</strong></>,
                <>Screenshot the confirmation and email it to us for verification.</>,
              ].map((step, i) => (
                <div key={i} className="payment-step">
                  <div className="step-num">{i + 1}</div>
                  <div>{step}</div>
                </div>
              ))}
            </div>
            <p>
              A confirmation email will be sent to <strong style={{ color: 'var(--gray-700)' }}>{email}</strong> once your payment is verified. Tickets are issued within 24–48 hours.
            </p>
            <Link
              href="/"
              style={{ display: 'inline-block', background: 'var(--tm-blue)', color: 'white', padding: '13px 36px', borderRadius: 'var(--radius-xs)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' as const }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <ConfirmationInner />
    </Suspense>
  )
}
