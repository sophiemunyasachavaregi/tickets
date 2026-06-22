'use client'

import { useState, useEffect, FormEvent, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const TICKET_MAP: Record<string, { name: string; price: number }> = {
  vip:        { name: 'VIP SOUNDCHECK', price: 25000 },
  floor:      { name: 'FLOOR STANDING', price: 20000 },
  bleachers1: { name: 'BLEACHERS 1',    price: 13500 },
  bleachers2: { name: 'BLEACHERS 2',    price:  7500 },
}

const DATES = [
  { value: '13 Mar 2027 (Sat.)', day: 'Saturday' },
  { value: '14 Mar 2027 (Sun.)', day: 'Sunday' },
  { value: '16 Mar 2027 (Tue.)', day: 'Tuesday' },
]

const ONLINE_FEE = 100

type FormData = {
  firstName: string; lastName: string; email: string; phone: string
  address: string; city: string; province: string
  armyMembership: string; eventDate: string; quantity: number
  paymentMethod: 'maya' | 'gcash' | ''; agreeTerms: boolean
}

type FieldErrors = Partial<Record<keyof FormData, string>>

function generateRef() {
  return 'BTS-' + Math.random().toString(36).toUpperCase().slice(2, 10)
}

function CheckoutInner() {
  const params = useSearchParams()
  const router = useRouter()
  const ticketId = params.get('ticketId') ?? 'floor'
  const preDate = params.get('eventDate') ?? ''
  const ticketInfo = TICKET_MAP[ticketId] ?? TICKET_MAP['floor']

  const [avail, setAvail] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', province: '',
    armyMembership: '', eventDate: preDate, quantity: 1,
    paymentMethod: '', agreeTerms: false,
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'success' } | null>(null)

  const unitPrice = ticketInfo.price
  const totalFees = ONLINE_FEE * form.quantity
  const totalAmount = unitPrice * form.quantity + totalFees

  useEffect(() => {
    if (!form.eventDate) { setAvail(null); return }
    supabase
      .from('ticket_inventory')
      .select('total_quantity, sold_quantity')
      .eq('event_date', form.eventDate)
      .eq('ticket_category', ticketInfo.name)
      .maybeSingle()
      .then(({ data }) => {
        setAvail(data ? data.total_quantity - data.sold_quantity : 0)
      })
  }, [form.eventDate, ticketInfo.name])

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: FieldErrors = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim())  e.lastName  = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || !/^[\d\s\-\+\(\)]{7,15}$/.test(form.phone))     e.phone = 'Valid phone number required'
    if (!form.eventDate)     e.eventDate     = 'Select an event date'
    if (!form.paymentMethod) e.paymentMethod = 'Select a payment method'
    if (!form.agreeTerms)    e.agreeTerms    = 'You must agree to the terms'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) { setToast({ msg: 'Please fill in all required fields.', type: 'error' }); return }
    if (avail !== null && form.quantity > avail) {
      setToast({ msg: `Only ${avail} ticket(s) left for this category.`, type: 'error' }); return
    }
    setSubmitting(true)
    try {
      const { error: invErr } = await supabase.rpc('decrement_inventory', {
        p_event_date: form.eventDate,
        p_ticket_category: ticketInfo.name,
        p_quantity: form.quantity,
      })
      if (invErr) throw new Error('Not enough tickets available. Please try again.')

      const ref = generateRef()
      const { error } = await supabase.from('ticket_orders').insert({
        first_name: form.firstName.trim(),
        last_name:  form.lastName.trim(),
        email:      form.email.trim().toLowerCase(),
        phone:      form.phone.trim(),
        address:    form.address.trim()  || null,
        city:       form.city.trim()     || null,
        province:   form.province.trim() || null,
        army_membership_number: form.armyMembership.trim() || null,
        event_date:      form.eventDate,
        ticket_category: ticketInfo.name,
        ticket_quantity: form.quantity,
        unit_price:      unitPrice,
        online_fee:      totalFees,
        total_amount:    totalAmount,
        payment_method:  form.paymentMethod,
        payment_status:  'pending',
        order_reference: ref,
      })
      if (error) throw error

      const qs = new URLSearchParams({
        ref,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        eventDate: form.eventDate,
        ticketName: ticketInfo.name,
        quantity: String(form.quantity),
        total: String(totalAmount),
        paymentMethod: form.paymentMethod,
      })
      router.push(`/confirmation?${qs}`)
    } catch (err: unknown) {
      setToast({ msg: err instanceof Error ? err.message : 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const maxQty = avail !== null ? Math.min(2, avail) : 2

  return (
    <div className="checkout-page">
      <nav className="navbar">
        <div className="navbar-flag">🇵🇭</div>
        <Link href="/" className="navbar-brand">BTS ARIRANG PRESALE</Link>
        <div className="navbar-powered">Powered by <strong>Ticketmaster.ph</strong></div>
      </nav>

      <div className="checkout-header">
        <div className="checkout-header-inner">
          <div className="checkout-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="current">Checkout</span>
          </div>
          <h1 className="checkout-title">COMPLETE YOUR ORDER</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="checkout-body">
          <div className="checkout-form-section">

            {/* BLOCK 1 — DATE */}
            <div className="form-block">
              <div className="form-block-header">
                <div className="form-block-num">1</div>
                <h3>Event Date</h3>
              </div>
              <div className="form-block-body">
                <div className="date-selector">
                  {DATES.map(d => (
                    <label key={d.value} className={`date-option ${form.eventDate === d.value ? 'selected' : ''}`}>
                      <input type="radio" name="eventDate" value={d.value} checked={form.eventDate === d.value} onChange={() => set('eventDate', d.value)} />
                      <div className="do-radio" />
                      <div className="do-info">
                        <div className="do-day">{d.day}</div>
                        <div className="do-date">{d.value}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.eventDate && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--error)' }}>{errors.eventDate}</p>}
              </div>
            </div>

            {/* BLOCK 2 — TICKET & QTY */}
            <div className="form-block">
              <div className="form-block-header">
                <div className="form-block-num">2</div>
                <h3>Ticket &amp; Quantity</h3>
              </div>
              <div className="form-block-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray-400)', marginBottom: 4 }}>
                      {ticketInfo.name}
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--tm-blue)' }}>
                      &#8369;{unitPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="qty-selector">
                    <button type="button" className="qty-btn" disabled={form.quantity <= 1} onClick={() => set('quantity', Math.max(1, form.quantity - 1))}>&#8722;</button>
                    <span className="qty-value">{form.quantity}</span>
                    <button type="button" className="qty-btn" disabled={form.quantity >= maxQty} onClick={() => set('quantity', Math.min(maxQty, form.quantity + 1))}>+</button>
                  </div>
                </div>
                {avail !== null && avail <= 10 && avail > 0 && (
                  <p style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>⚠ Only {avail} ticket(s) remaining!</p>
                )}
                {avail === 0 && (
                  <p style={{ fontSize: 12, color: 'var(--error)', fontWeight: 600 }}>✕ Sold out for selected date.</p>
                )}
                <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8 }}>Maximum 2 tickets per account per order.</p>
              </div>
            </div>

            {/* BLOCK 3 — BUYER INFO */}
            <div className="form-block">
              <div className="form-block-header">
                <div className="form-block-num">3</div>
                <h3>Your Information</h3>
              </div>
              <div className="form-block-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name <span className="required">*</span></label>
                    <input type="text" placeholder="Juan" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name <span className="required">*</span></label>
                    <input type="text" placeholder="Dela Cruz" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email Address <span className="required">*</span></label>
                    <input type="email" placeholder="juan@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone Number <span className="required">*</span></label>
                    <input type="tel" placeholder="+63 912 345 6789" value={form.phone} onChange={e => set('phone', e.target.value)} />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input type="text" placeholder="123 Rizal St., Barangay..." value={form.address} onChange={e => set('address', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>City / Municipality</label>
                    <input type="text" placeholder="Manila" value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Province</label>
                    <input type="text" placeholder="Metro Manila" value={form.province} onChange={e => set('province', e.target.value)} />
                  </div>
                  <div className="form-group full-width">
                    <label>ARMY Membership Number</label>
                    <input type="text" placeholder="BA123456789" value={form.armyMembership} onChange={e => set('armyMembership', e.target.value)} />
                    <span className="form-hint">Required for ARMY Presale (BA + 9 digits). Leave blank if not applicable.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 4 — PAYMENT */}
            <div className="form-block">
              <div className="form-block-header">
                <div className="form-block-num">4</div>
                <h3>Payment Method</h3>
              </div>
              <div className="form-block-body">
                <div className="payment-options">
                  {(['maya', 'gcash'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      className={`payment-option ${form.paymentMethod === method ? 'selected' : ''}`}
                      onClick={() => set('paymentMethod', method)}
                    >
                      <div className={`po-logo ${method}`}>{method === 'maya' ? 'Maya' : 'GCash'}</div>
                      <div className="po-info">
                        <div className="po-name">{method === 'maya' ? 'Maya' : 'GCash'}</div>
                        <div className="po-desc">{method === 'maya' ? 'Pay via Maya e-wallet' : 'Pay via GCash e-wallet'}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.paymentMethod && <p style={{ marginTop: 8, fontSize: 12, color: 'var(--error)' }}>{errors.paymentMethod}</p>}

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 24, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={e => set('agreeTerms', e.target.checked)}
                    style={{ marginTop: 2, width: 16, height: 16, accentColor: 'var(--tm-blue)', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                    I have read and agree to the{' '}
                    <a href="#" style={{ color: 'var(--tm-blue)' }}>Terms &amp; Conditions</a> and{' '}
                    <a href="#" style={{ color: 'var(--tm-blue)' }}>Purchase Policy</a>.
                    Purchasing is treated as fully agreeing to all rules.
                  </span>
                </label>
                {errors.agreeTerms && <p style={{ marginTop: 6, fontSize: 12, color: 'var(--error)' }}>{errors.agreeTerms}</p>}
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <div className="os-header">Order Summary</div>
            <div className="os-event-info">
              <div className="ev-name">BTS WORLD TOUR</div>
              <div className="ev-sub">ARIRANG — IN BULACAN</div>
              <div className="ev-detail">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 3.5V6l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {form.eventDate || 'Select a date'}
              </div>
              <div className="ev-detail">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.73 3.5 6.5 3.5 6.5s3.5-3.77 3.5-6.5C9.5 2.57 7.93 1 6 1z" stroke="currentColor" strokeWidth="1.5"/><circle cx="6" cy="4.5" r="1" fill="currentColor"/></svg>
                Philippine Sports Stadium, Bulacan
              </div>
            </div>
            <div className="os-line-items">
              <div className="os-line">
                <span className="line-label">{ticketInfo.name}</span>
                <span className="line-value">&#8369;{unitPrice.toLocaleString()}</span>
              </div>
              <div className="os-line">
                <span className="line-label">Quantity</span>
                <span className="line-value">× {form.quantity}</span>
              </div>
              <div className="os-line">
                <span className="line-label">Subtotal</span>
                <span className="line-value">&#8369;{(unitPrice * form.quantity).toLocaleString()}</span>
              </div>
              <div className="os-line">
                <span className="line-label">Online fee ({form.quantity} × &#8369;100)</span>
                <span className="line-value">&#8369;{totalFees.toLocaleString()}</span>
              </div>
              <div className="os-line total">
                <span className="line-label">Total</span>
                <span className="line-value">&#8369;{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="os-submit">
              <button type="submit" className="btn-submit" disabled={submitting || avail === 0}>
                {submitting
                  ? <><div className="spinner" />Processing...</>
                  : `Pay ₱${totalAmount.toLocaleString()} via ${form.paymentMethod ? form.paymentMethod.charAt(0).toUpperCase() + form.paymentMethod.slice(1) : '...'}`
                }
              </button>
              <p className="os-disclaimer">
                By clicking, you confirm your order and agree to our{' '}
                <a href="#">Purchase Policy</a> and <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </form>

      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'error' ? '⚠' : '✓'}</span>
          <span className="toast-msg">{toast.msg}</span>
          <button type="button" onClick={() => setToast(null)} style={{ marginLeft: 'auto', background: 'none', color: 'var(--gray-400)', fontSize: 18, border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  )
}
