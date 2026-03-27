'use client'

import { useState } from 'react'
import { stellar } from '@/lib/stellar-helper'

interface PaymentFormProps {
  publicKey: string | null
  onSendSuccess: () => void
}

type FeedbackState = { type: 'success' | 'error' | 'loading'; message: string; hash?: string } | null

export default function PaymentForm({ publicKey, onSendSuccess }: PaymentFormProps) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [txCount, setTxCount] = useState(0)
  const [txSuccess, setTxSuccess] = useState(0)

  const handleSend = async () => {
    if (!publicKey) return
    if (!recipient.trim()) return setFeedback({ type: 'error', message: 'Enter a recipient address.' })
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return setFeedback({ type: 'error', message: 'Enter a valid XLM amount.' })
    if (recipient.trim() === publicKey)
      return setFeedback({ type: 'error', message: "Can't send to your own address." })

    setLoading(true)
    setTxCount(n => n + 1)
    setFeedback({ type: 'loading', message: 'Building & signing transaction...' })

    try {
      const result = await stellar.sendPayment({
        from: publicKey,
        to: recipient.trim(),
        amount: String(parseFloat(amount).toFixed(7)),
        memo: memo.trim() || undefined,
      })

      const explorerLink = stellar.getExplorerLink(result.hash, 'tx')
      setTxSuccess(n => n + 1)
      setFeedback({
        type: 'success',
        message: `✓ Transaction confirmed!\n\nHash: ${result.hash}`,
        hash: explorerLink,
      })
      setRecipient('')
      setAmount('')
      setMemo('')
      onSendSuccess()
    } catch (err: any) {
      const msg = err.message || String(err)
      setFeedback({
        type: 'error',
        message: msg.includes('declined') || msg.includes('rejected')
          ? '✕ Transaction rejected in wallet.'
          : `✕ Error: ${msg}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bc-panel bc-panel-full">
      <div className="bc-label">03 · Send XLM Transaction</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left: Inputs */}
        <div>
          <div className="bc-field">
            <label>Recipient Address</label>
            <input
              type="text"
              placeholder="G... Stellar public key"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              disabled={!publicKey || loading}
            />
          </div>
          <div className="bc-field">
            <label>Amount (XLM)</label>
            <input
              type="number"
              placeholder="e.g. 10"
              min="0.0000001"
              step="any"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              disabled={!publicKey || loading}
            />
          </div>
          <div className="bc-field">
            <label>Memo (Optional — max 28 chars)</label>
            <input
              type="text"
              placeholder="e.g. BloodChain donor reward"
              maxLength={28}
              value={memo}
              onChange={e => setMemo(e.target.value)}
              disabled={!publicKey || loading}
            />
          </div>
          <button
            className="bc-btn bc-btn-primary"
            onClick={handleSend}
            disabled={!publicKey || loading}
          >
            {loading ? <><span className="bc-spinner" /> Signing...</> : 'Send XLM →'}
          </button>
        </div>

        {/* Right: Feedback + stats */}
        <div>
          {feedback && (
            <div className={`bc-feedback ${feedback.type}`}>
              {feedback.message}
              {feedback.hash && (
                <>
                  {'\n\n'}
                  <a href={feedback.hash} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--green)', textDecoration: 'underline' }}>
                    View on Stellar Expert ↗
                  </a>
                </>
              )}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <div>
              <div className="stat-val">{txCount}</div>
              <div className="stat-label">TXS SENT</div>
            </div>
            <div>
              <div className="stat-val">{txSuccess}</div>
              <div className="stat-label">CONFIRMED</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bc-panel-full { grid-column: 1 / -1; }
        .bc-field { margin-bottom: 1rem; }
        .bc-field label {
          display: block;
          font-family: 'DM Mono', monospace; font-size: 0.68rem;
          color: var(--muted); letter-spacing: 0.15em;
          margin-bottom: 0.4rem; text-transform: uppercase;
        }
        .bc-field input {
          width: 100%; background: var(--off);
          border: 1px solid var(--red-dim); border-radius: 8px;
          color: var(--white); font-family: 'DM Mono', monospace;
          font-size: 0.82rem; padding: 0.75rem 1rem; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .bc-field input:focus {
          border-color: var(--red);
          box-shadow: 0 0 0 3px var(--red-glow);
        }
        .bc-field input::placeholder { color: var(--muted); }
        .bc-field input:disabled { opacity: 0.4; cursor: not-allowed; }
        .bc-feedback { white-space: pre-wrap; }
        .stat-val {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem; color: var(--white); line-height: 1;
        }
        .stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem; color: var(--muted);
          letter-spacing: 0.15em; margin-top: 0.25rem;
        }
      `}</style>
    </div>
  )
}

