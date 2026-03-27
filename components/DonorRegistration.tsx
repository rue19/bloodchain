'use client'

import { useState } from 'react'
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit'
import { registerDonor, TxStatus, getTxExplorerLink } from '@/lib/contract-helper'

interface DonorRegistrationProps {
  publicKey: string | null
  walletKit: StellarWalletsKit | null
  onRegistered?: () => void
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function DonorRegistration({ publicKey, walletKit, onRegistered }: DonorRegistrationProps) {
  const [bloodType, setBloodType] = useState('O+')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState<TxStatus>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleRegister = async () => {
    if (!publicKey || !walletKit) return
    if (!location.trim()) {
      setError('Please enter your city / region.')
      return
    }

    setStatus('pending')
    setError(null)
    setErrorType(null)
    setTxHash(null)
    setProgress(10)

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 5, 85))
    }, 800)

    try {
      const result = await registerDonor(
        publicKey,
        bloodType,
        location.trim(),
        async (xdr, opts) => await walletKit.signTransaction(xdr, opts)
      )

      clearInterval(progressInterval)
      setProgress(100)

      if (result.status === 'ok') {
        setTxHash(result.txHash ?? null)
        setStatus('success')
        if (onRegistered) onRegistered()
      } else {
        setError(result.error ?? 'Registration failed.')
        setErrorType(result.errorType ?? null)
        setStatus('error')
      }
    } catch (err: any) {
      clearInterval(progressInterval)
      setError(err.message ?? 'Unexpected error')
      setStatus('error')
    }

    setTimeout(() => setProgress(0), 1500)
  }

  return (
    <div className="bc-panel bc-panel-full">
      <div className="bc-label">05 · Donor Registration</div>

      {status === 'pending' && (
        <div className="bc-progress-track">
          <div className="bc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {!publicKey ? (
        <p style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>
          Connect wallet to register as a donor.
        </p>
      ) : (
        <div>
          <div className="form-row">
            <label className="bc-field-label">Blood Type</label>
            <div className="blood-type-grid">
              {BLOOD_TYPES.map((bt) => (
                <button
                  key={bt}
                  className={bt === bloodType ? 'blood-type-btn selected' : 'blood-type-btn'}
                  onClick={() => setBloodType(bt)}
                  disabled={status === 'pending'}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row" style={{ marginTop: '1rem' }}>
            <label className="bc-field-label">Location (City / Region)</label>
            <input
              className="bc-input"
              type="text"
              placeholder="e.g. Kolkata, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={status === 'pending'}
              maxLength={64}
            />
          </div>

          <button
            className="bc-btn bc-btn-primary"
            style={{ marginTop: '1.25rem' }}
            onClick={handleRegister}
            disabled={status === 'pending' || !location.trim()}
          >
            {status === 'pending' ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <span className="bc-spinner" />
                Registering on-chain…
              </span>
            ) : (
              '🩸 Register as Donor'
            )}
          </button>

          {status === 'success' && txHash && (
            <div className="bc-feedback success" style={{ marginTop: '1rem' }}>
              ✓ Registered on Soroban testnet!{' '}
              <a
                href={getTxExplorerLink(txHash)}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--green)', textDecoration: 'underline' }}
              >
                View tx ↗
              </a>
            </div>
          )}

          {status === 'error' && error && (
            <div className="bc-feedback error" style={{ marginTop: '1rem' }} data-error-type={errorType}>
              {errorType === 'wallet_not_found' && '🔌 '}
              {errorType === 'user_rejected' && '✋ '}
              {errorType === 'insufficient_balance' && '💸 '}
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}