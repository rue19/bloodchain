'use client'

import { useEffect, useState, useRef } from 'react'
import { getDonorCount, getContractExplorerLink, CONTRACT_ID } from '@/lib/contract-helper'

interface LiveStatsProps {
  refreshTrigger?: number
}

export default function LiveStats({ refreshTrigger = 0 }: LiveStatsProps) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('—')
  const [pulse, setPulse] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchCount = async () => {
    const result = await getDonorCount()
    if (result.status === 'ok' && result.data !== undefined) {
      setCount(prev => {
        if (prev !== null && prev !== result.data) {
          setPulse(true)
          setTimeout(() => setPulse(false), 1200)
        }
        return result.data!
      })
    }
    setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }))
    setLoading(false)
  }

  useEffect(() => {
    fetchCount()
    intervalRef.current = setInterval(fetchCount, 8000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  useEffect(() => {
    if (refreshTrigger > 0) fetchCount()
  }, [refreshTrigger])

  return (
    <div className="bc-panel" style={{ textAlign: 'center' }}>
      <div className="bc-label">07 · Live Registry</div>

      <div className={`live-count ${pulse ? 'pulse-red' : ''}`}>
        {loading
          ? <span className="bc-spinner" style={{ width: 24, height: 24 }} />
          : <span>{count ?? '—'}</span>
        }
      </div>
      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
        registered donors
      </p>

      <div style={{
        marginTop: '0.75rem', fontFamily: 'DM Mono, monospace',
        fontSize: '0.62rem', color: 'var(--muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem'
      }}>
        <span style={{ color: 'var(--red)', animation: 'blink 2s ease infinite' }}>●</span>
        LIVE · Updated {lastUpdated}
      </div>

      <a href={getContractExplorerLink(CONTRACT_ID)} target="_blank" rel="noreferrer"
        style={{
          display: 'block', marginTop: '0.75rem',
          fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
          color: 'var(--muted)', textDecoration: 'none',
        }}>
        {CONTRACT_ID.slice(0, 10)}…{CONTRACT_ID.slice(-6)} ↗
      </a>

      <style>{`
        .live-count {
          font-family: 'Bebas Neue', sans-serif; font-size: 4rem; line-height: 1;
          color: var(--red); display: flex; align-items: center;
          justify-content: center; min-height: 4rem;
        }
        .pulse-red { animation: pulse-red-once 1.2s ease; }
        @keyframes pulse-red-once {
          0%   { text-shadow: none; }
          50%  { text-shadow: 0 0 40px var(--red); color: var(--accent); }
          100% { text-shadow: none; }
        }
      `}</style>
    </div>
  )
}
