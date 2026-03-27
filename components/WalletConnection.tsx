'use client'

import { useEffect, useState } from 'react'
import {
  StellarWalletsKit,
  WalletNetwork,
  WalletType,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'

interface WalletConnectionProps {
  onConnect: (publicKey: string, kit: StellarWalletsKit) => void
  onDisconnect: () => void
}

let kitInstance: StellarWalletsKit | null = null

function getKit() {
  if (!kitInstance) {
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: WalletType.FREIGHTER,
      modules: allowAllModules(),
    })
  }
  return kitInstance
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('bc_wallet_pk')
    if (stored) {
      const kit = getKit()
      setPublicKey(stored)
      onConnect(stored, kit)
    }
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    setErrorType(null)
    try {
      const kit = getKit()
      await kit.openModal({
        onWalletSelected: async (option) => {
          kit.setWallet(option.id)
          const { address } = await kit.getAddress()
          setPublicKey(address)
          localStorage.setItem('bc_wallet_pk', address)
          onConnect(address, kit)
        },
      })
    } catch (err: any) {
      const msg: string = err?.message ?? String(err)
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('not installed')) {
        setError('Wallet not found. Install Freighter extension first.')
        setErrorType('wallet_not_found')
      } else if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('declined')) {
        setError('Wallet connection rejected by user.')
        setErrorType('user_rejected')
      } else {
        setError(`Connection failed: ${msg}`)
        setErrorType('unknown')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    kitInstance = null
    localStorage.removeItem('bc_wallet_pk')
    setPublicKey(null)
    setError(null)
    onDisconnect()
  }

  const shortKey = (pk: string) => `${pk.slice(0, 6)}···${pk.slice(-6)}`

  return (
    <div className="bc-panel">
      <div className="bc-label">01 · Wallet</div>

      {!publicKey ? (
        <>
          <button className="bc-btn bc-btn-primary" onClick={handleConnect} disabled={loading}>
            {loading ? <><span className="bc-spinner" /> Connecting…</> : '⬡ Connect Wallet'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem', fontFamily: 'DM Mono, monospace' }}>
            Freighter · xBull · Lobstr · WalletConnect
          </p>
        </>
      ) : (
        <>
          <div className="wallet-connected">
            <span className="bc-dot-green" />
            <span className="wallet-addr">{shortKey(publicKey)}</span>
          </div>
          <button className="bc-btn bc-btn-ghost" style={{ marginTop: '0.75rem' }} onClick={handleDisconnect}>
            Disconnect
          </button>
        </>
      )}

      {error && (
        <div className="bc-feedback error" style={{ marginTop: '0.75rem' }} data-error-type={errorType}>
          {errorType === 'wallet_not_found' && '🔌 '}
          {errorType === 'user_rejected' && '✋ '}
          {error}
        </div>
      )}

      <style>{`
        .wallet-connected {
          display: flex; align-items: center; gap: 0.5rem;
          background: var(--green-dim); border: 1px solid rgba(0,232,122,0.2);
          border-radius: 6px; padding: 0.5rem 0.75rem;
        }
        .bc-dot-green {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green); animation: pulse-green 2s ease infinite; flex-shrink: 0;
        }
        .wallet-addr { font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--green); }
      `}</style>
    </div>
  )
}
      .bc-label {
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem;
        color: var(--muted);
        letter-spacing: 0.18em;
        text-transform: uppercase;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .bc-label::before { content: ''; width: 16px; height: 1px; background: var(--red); }
      .status-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: var(--muted); flex-shrink: 0;
        transition: background 0.3s, box-shadow 0.3s;
      }
      .status-dot.connected {
        background: var(--green);
        box-shadow: 0 0 10px var(--green);
        animation: pulse-green 2s ease infinite;
      }
      .wallet-addr {
        font-family: 'DM Mono', monospace;
        font-size: 0.78rem; color: var(--white);
        overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      }
      .wallet-addr.empty { color: var(--muted); font-style: italic; }
      .testnet-chip {
        display: inline-flex; align-items: center; gap: 0.4rem;
        background: rgba(232,0,45,0.1); border: 1px solid var(--red-dim);
        border-radius: 100px; padding: 0.25rem 0.7rem;
        font-family: 'DM Mono', monospace; font-size: 0.65rem;
        color: var(--red); letter-spacing: 0.12em;
      }
      .testnet-chip::before {
        content: ''; width: 6px; height: 6px; border-radius: 50%;
        background: var(--red); animation: blink 1.4s step-end infinite;
      }
      .bc-btn {
        font-family: 'DM Mono', monospace; font-size: 0.78rem;
        letter-spacing: 0.12em; text-transform: uppercase;
        border: none; border-radius: 8px; padding: 0.75rem 1.5rem;
        cursor: pointer; transition: all 0.2s;
        display: inline-flex; align-items: center; gap: 0.5rem;
      }
      .bc-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      .bc-btn-primary { background: var(--red); color: var(--white); }
      .bc-btn-primary:hover:not(:disabled) {
        background: var(--accent);
        box-shadow: 0 4px 20px var(--red-glow);
        transform: translateY(-1px);
      }
      .bc-btn-ghost {
        background: transparent; color: var(--muted);
        border: 1px solid var(--red-dim);
      }
      .bc-btn-ghost:hover { border-color: var(--red); color: var(--white); }
      .bc-spinner {
        width: 14px; height: 14px; border: 2px solid currentColor;
        border-top-color: transparent; border-radius: 50%;
        animation: spin 0.7s linear infinite; display: inline-block;
      }
      .bc-feedback {
        padding: 0.9rem 1rem; border-radius: 8px;
        font-family: 'DM Mono', monospace; font-size: 0.75rem; line-height: 1.6;
        animation: fadeUp 0.3s ease;
      }
      .bc-feedback.success {
        background: var(--green-dim); border: 1px solid rgba(0,232,122,0.2); color: var(--green);
      }
      .bc-feedback.error {
        background: rgba(232,0,45,0.08); border: 1px solid var(--red-dim); color: var(--accent);
      }
      .bc-feedback.loading {
        background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); color: var(--muted);
      }
      .bc-note {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        border-radius: 8px; padding: 1rem;
        font-family: 'DM Mono', monospace; font-size: 0.72rem;
        color: var(--muted); line-height: 1.7;
      }
      .bc-note a { color: var(--red); text-decoration: none; }
      .bc-note a:hover { text-decoration: underline; }
    `}</style>
  )
}
