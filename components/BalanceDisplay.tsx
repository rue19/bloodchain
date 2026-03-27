'use client'

import { useEffect, useState } from 'react'
import { stellar } from '@/lib/stellar-helper'

interface BalanceDisplayProps {
  publicKey: string | null
  refreshTrigger: number
}

export default function BalanceDisplay({ publicKey, refreshTrigger }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setBalance(null)
      setError(null)
      return
    }
    fetchBalance()
  }, [publicKey, refreshTrigger])

  const fetchBalance = async () => {
    if (!publicKey) return
    setLoading(true)
    setError(null)
    try {
      const { xlm } = await stellar.getBalance(publicKey)
      setBalance(parseFloat(xlm).toFixed(4))
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balance')
      setBalance(null)
    } finally {
      setLoading(false)
    }
  }

  const displayValue = loading ? '...' : (balance ?? '—')
  const isLoaded = balance !== null && !loading

  return (
    <div className="bc-panel">
      <div className="bc-label">02 · Balance</div>

      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div className={`balance-num ${isLoaded ? 'loaded' : ''}`}>
          {displayValue}
        </div>
        <div className="balance-unit">XLM · TESTNET</div>
      </div>

      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--red-dim), transparent)', margin: '1.25rem 0' }} />

      <button
        className="bc-btn bc-btn-ghost"
        onClick={fetchBalance}
        disabled={!publicKey || loading}
      >
        {loading ? <><span className="bc-spinner" /> Fetching...</> : '↻ Refresh Balance'}
      </button>

      {error && (
        <div className="bc-feedback error" style={{ marginTop: '0.75rem' }}>
          ✕ {error}
        </div>
      )}

      {!publicKey && (
        <div className="bc-note" style={{ marginTop: '1rem' }}>
          Connect your wallet to see your XLM balance.
        </div>
      )}

      {publicKey && balance === '0.0000' && (
        <div className="bc-note" style={{ marginTop: '1rem' }}>
          Zero balance? Fund via{' '}
          <a href={`https://friendbot.stellar.org/?addr=${publicKey}`} target="_blank" rel="noreferrer">
            Stellar Friendbot ↗
          </a>
        </div>
      )}

    </div>
  )
}

