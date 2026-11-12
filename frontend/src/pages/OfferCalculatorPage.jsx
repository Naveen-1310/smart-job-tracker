import React, { useState } from 'react'
import { MdAttachMoney, MdCalculate, MdCompareArrows, MdCheckCircle, MdInfoOutline } from 'react-icons/md'

/**
 * OfferCalculatorPage — in-hand salary breakdown & side-by-side offer comparison.
 */
function OfferCalculatorPage() {
  // Offer A
  const [offerA, setOfferA] = useState({
    company: 'Company A (e.g. Tech Corp)',
    ctc: 800000,
    bonus: 50000,
    workMode: 'HYBRID',
  })

  // Offer B
  const [offerB, setOfferB] = useState({
    company: 'Company B (e.g. Startup)',
    ctc: 1200000,
    bonus: 100000,
    workMode: 'REMOTE',
  })

  // Calculate detailed monthly in-hand breakdown
  const calculateSalary = (ctc, bonus) => {
    const fixedCtc = Math.max(0, ctc - (bonus || 0))
    const basicAnnual = fixedCtc * 0.40 // 40% Basic
    const hraAnnual = fixedCtc * 0.20   // 20% HRA
    const specialAllowanceAnnual = fixedCtc - (basicAnnual + hraAnnual)

    // Monthly gross
    const monthlyGross = fixedCtc / 12

    // Deductions
    const pfMonthly = (basicAnnual / 12) * 0.12 // 12% of basic
    const ptMonthly = 200 // Professional Tax

    // Tax estimation (simplified New Regime slab)
    let annualTax = 0
    if (fixedCtc > 700000) {
      if (fixedCtc <= 1000000) {
        annualTax = (fixedCtc - 700000) * 0.10 + 20000
      } else if (fixedCtc <= 1200000) {
        annualTax = (fixedCtc - 1000000) * 0.15 + 50000
      } else {
        annualTax = (fixedCtc - 1200000) * 0.20 + 80000
      }
    }
    const monthlyTax = annualTax / 12

    const monthlyInHand = Math.max(0, monthlyGross - pfMonthly - ptMonthly - monthlyTax)

    return {
      monthlyGross: Math.round(monthlyGross),
      basic: Math.round(basicAnnual / 12),
      hra: Math.round(hraAnnual / 12),
      allowances: Math.round(specialAllowanceAnnual / 12),
      pf: Math.round(pfMonthly),
      pt: Math.round(ptMonthly),
      tax: Math.round(monthlyTax),
      inHand: Math.round(monthlyInHand),
    }
  }

  const calcA = calculateSalary(Number(offerA.ctc), Number(offerA.bonus))
  const calcB = calculateSalary(Number(offerB.ctc), Number(offerB.bonus))

  const inHandDiff = calcB.inHand - calcA.inHand

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Salary & Job Offer Calculator</h2>
          <p>Estimate monthly take-home in-hand salary and compare multiple job offers side-by-side</p>
        </div>
      </div>

      {/* Comparison Summary Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        marginBottom: 24,
        boxShadow: 'var(--shadow-glow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Comparison Result
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 0 0', color: 'var(--text)' }}>
              {inHandDiff > 0 ? (
                <span>🎉 {offerB.company || 'Offer B'} gives you <strong style={{ color: 'var(--primary)' }}>₹{inHandDiff.toLocaleString('en-IN')}/mo more</strong> in-hand!</span>
              ) : inHandDiff < 0 ? (
                <span>🎉 {offerA.company || 'Offer A'} gives you <strong style={{ color: 'var(--primary)' }}>₹{Math.abs(inHandDiff).toLocaleString('en-IN')}/mo more</strong> in-hand!</span>
              ) : (
                <span>Both offers provide the exact same monthly in-hand salary!</span>
              )}
            </h3>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MdInfoOutline size={16} /> Based on New Indian Tax Regime & standard deductions
          </div>
        </div>
      </div>

      {/* Two Offer Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Offer A */}
        <div className="card" style={{ borderTop: '4px solid #3B82F6' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#3B82F6' }}>
              <span>Offer A</span>
            </h3>
            <span className="badge badge-applied">{offerA.workMode}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={offerA.company}
                onChange={e => setOfferA({ ...offerA, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total CTC (₹ / yr)</label>
              <input
                type="number"
                className="form-control"
                value={offerA.ctc}
                step="50000"
                onChange={e => setOfferA({ ...offerA, ctc: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Joining / Variable (₹)</label>
              <input
                type="number"
                className="form-control"
                value={offerA.bonus}
                step="10000"
                onChange={e => setOfferA({ ...offerA, bonus: e.target.value })}
              />
            </div>
          </div>

          {/* In-Hand Highlight */}
          <div style={{
            background: 'var(--bg)',
            padding: 16,
            borderRadius: 10,
            border: '1px solid var(--border)',
            textAlign: 'center',
            marginBottom: 20
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Estimated Monthly Take-Home</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#3B82F6', marginTop: 4 }}>
              ₹{calcA.inHand.toLocaleString('en-IN')} <span style={{ fontSize: 13, fontWeight: 500 }}>/ month</span>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Monthly Gross Pay</span>
              <strong style={{ color: 'var(--text)' }}>₹{calcA.monthlyGross.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Basic Salary (40%)</span>
              <span>₹{calcA.basic.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>House Rent Allowance (HRA)</span>
              <span>₹{calcA.hra.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Special Allowances</span>
              <span>₹{calcA.allowances.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ borderTop: '1px dashed var(--border)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Employee PF Deduction</span>
              <span>- ₹{calcA.pf.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Estimated Income Tax (TDS)</span>
              <span>- ₹{calcA.tax.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Professional Tax</span>
              <span>- ₹{calcA.pt}</span>
            </div>
          </div>
        </div>

        {/* Offer B */}
        <div className="card" style={{ borderTop: '4px solid #10B981' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10B981' }}>
              <span>Offer B</span>
            </h3>
            <span className="badge badge-selected">{offerB.workMode}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                value={offerB.company}
                onChange={e => setOfferB({ ...offerB, company: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total CTC (₹ / yr)</label>
              <input
                type="number"
                className="form-control"
                value={offerB.ctc}
                step="50000"
                onChange={e => setOfferB({ ...offerB, ctc: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Joining / Variable (₹)</label>
              <input
                type="number"
                className="form-control"
                value={offerB.bonus}
                step="10000"
                onChange={e => setOfferB({ ...offerB, bonus: e.target.value })}
              />
            </div>
          </div>

          {/* In-Hand Highlight */}
          <div style={{
            background: 'var(--bg)',
            padding: 16,
            borderRadius: 10,
            border: '1px solid var(--border)',
            textAlign: 'center',
            marginBottom: 20
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Estimated Monthly Take-Home</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#10B981', marginTop: 4 }}>
              ₹{calcB.inHand.toLocaleString('en-IN')} <span style={{ fontSize: 13, fontWeight: 500 }}>/ month</span>
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Monthly Gross Pay</span>
              <strong style={{ color: 'var(--text)' }}>₹{calcB.monthlyGross.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Basic Salary (40%)</span>
              <span>₹{calcB.basic.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>House Rent Allowance (HRA)</span>
              <span>₹{calcB.hra.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Special Allowances</span>
              <span>₹{calcB.allowances.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ borderTop: '1px dashed var(--border)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Employee PF Deduction</span>
              <span>- ₹{calcB.pf.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Estimated Income Tax (TDS)</span>
              <span>- ₹{calcB.tax.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
              <span>Professional Tax</span>
              <span>- ₹{calcB.pt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferCalculatorPage
