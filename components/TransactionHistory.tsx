'use client'

import { useEffect, useState } from 'react'
import { stellar } from '@/lib/stellar-helper'

interface TransactionHistoryProps {
  publicKey: string | null
  refreshTrigger: number
}

interface TxItem {
  id: string
  type: string
  amount?: string
  asset?: string
  from?: string
  to?: string
  createdAt: string
  hash: string
}

export default function TransactionHistory({ publicKey, refreshTrigger }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<TxItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Local activity log for this session
  const [sessionLog] = useState<{ time: string; msg: string; type: string }[]>([
    { time: '--:--:--', msg: 'Waiting for wallet connection...', type: '' }
  ])

  useEffect(() => {
    if (!publicKey) { setTransactions([]); return }
    fetchTxHistory()
  }, [publicKey, refreshTrigger])

  const fetchTxHistory = async () => {
    if (!publicKey) return
    setLoading(true)
    setError(null)
    try {
      const txs = await stellar.getRecentTransactions(publicKey, 10)
      setTransactions(txs || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('en-US', { hour12: false })
    } catch { return '--:--:--' }
  }

  const shortHash = (hash: string) => `${hash.slice(0, 8)}...${hash.slice(-8)}`

  return (
    <div className="bc-panel bc-panel-full">
      <div className="bc-label">04 · Activity Log</div>

      {loading && (
        <div style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>
          <span className="bc-spinner" style={{ marginRight: '0.5rem' }} />
          Loading transactions...
        </div>
      )}

      {error && <div className="bc-feedback error">✕ {error}</div>}

      {!publicKey && (
        <div style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>
          Connect wallet to see transaction history.
        </div>
      )}

      {transactions.length > 0 && (
        <ul className="tx-log-list">
          {transactions.map(tx => (
            <li key={tx.hash}>
              <span className="log-time">{formatTime(tx.createdAt)}</span>
              <span className="log-msg ok">
                <a
                  href={stellar.getExplorerLink(tx.hash, 'tx')}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--green)', textDecoration: 'none' }}
                >
                  {shortHash(tx.hash)} ↗
                </a>
                {tx.type === 'payment' ? ` · ${tx.asset || 'XLM'} ${tx.amount}` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      {publicKey && !loading && transactions.length === 0 && !error && (
        <div style={{ color: 'var(--muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>
          No transactions found yet. Send your first XLM above!
        </div>
      )}

      <style>{`
        .tx-log-list {
          list-style: none;
          max-height: 200px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--red-dim) transparent;
        }
        .tx-log-list li {
          font-family: 'DM Mono', monospace; font-size: 0.72rem;
          color: var(--muted); padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          display: flex; gap: 0.75rem; align-items: flex-start;
        }
        .log-time { color: var(--red-dim); flex-shrink: 0; font-size: 0.65rem; }
        .log-msg { color: var(--white); opacity: 0.7; }
        .log-msg.ok { color: var(--green); opacity: 1; }
        .log-msg.err { color: var(--accent); opacity: 1; }
      `}</style>
    </div>
  )
}

