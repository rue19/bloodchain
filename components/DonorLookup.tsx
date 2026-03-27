'use client'

import { useState } from 'react'
import { getDonor, DonorRecord, getContractExplorerLink, CONTRACT_ID } from '@/lib/contract-helper'

export default function DonorLookup() {
  const [address, setAddress] = useState('')
  const [donor, setDonor] = useState<DonorRecord | null | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    if (!address.trim()) return
    setLoading(true)
    setDonor(undefined)
    setError(null)

    const result = await getDonor(address.trim())
    setLoading(false)

    if (result.status === 'ok') {
      setDonor(result.data ?? null)
    } else {
      setError(result.error ?? 'Lookup failed')
    }
  }

  const formatDate = (ts: number) =>
    ts ? new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'

  return (
    <div className="bc-panel bc-panel-full">
      <div className="bc-label">06 · Donor Lookup</div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          className="bc-input"
          type="text"
          placeholder="Stellar address (G...)"
          value={address}
          onChange={e => setAddress(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLookup()}
          style={{ flex: 1 }}
        />
        <button
          className="bc-btn bc-btn-primary"
          onClick={handleLookup}
          disabled={loading || !address.trim()}
          style={{ whiteSpace: 'nowrap', width: 'auto', padding: '0.55rem 1rem' }}
        >
          {loading ? <><span className="bc-spinner" /> …</> : 'Look up'}
        </button>
      </div>

      {donor === null && !loading && (
        <div style={{ marginTop: '0.75rem', color: 'var(--muted)', fontSize: '0.78rem', fontFamily: 'DM Mono, monospace' }}>
          No donor record found for this address.
        </div>
      )}

      {donor && (
        <div className="donor-card">
          <div className="donor-blood-badge">{donor.blood_type}</div>
          <div className="donor-details">
            <div className="donor-detail-row">
              <span>Address</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem' }}>
                {donor.address.slice(0, 8)}…{donor.address.slice(-8)}
              </span>
            </div>
            <div className="donor-detail-row">
              <span>Location</span><span>{donor.location}</span>
            </div>
            <div className="donor-detail-row">
              <span>Registered</span><span>{formatDate(donor.registered_at)}</span>
            </div>
            <div className="donor-detail-row">
              <span>Status</span>
              <span style={{ color: donor.is_available ? 'var(--green)' : 'var(--muted)' }}>
                {donor.is_available ? '● Available' : '○ Unavailable'}
              </span>
            </div>
          </div>
          <a href={getContractExplorerLink(CONTRACT_ID)} target="_blank" rel="noreferrer"
            style={{ fontSize: '0.68rem', color: 'var(--muted)', textDecoration: 'none', marginTop: '0.5rem', display: 'block' }}>
            View contract ↗
          </a>
        </div>
      )}

      {error && <div className="bc-feedback error" style={{ marginTop: '0.75rem' }}>✕ {error}</div>}

    </div>
  )
}
