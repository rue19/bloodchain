'use client'

import { useState, useEffect } from 'react'
import { StellarWalletsKit, ISupportedWallet, WalletNetwork, FREIGHTER_ID, FreighterModule, xBullModule, LobstrModule, AlbedoModule } from '@creit.tech/stellar-wallets-kit'
import { getBalance } from '../lib/stellar-helper'

interface WalletConnectionProps {
  onConnect: (publicKey: string, kit: StellarWalletsKit) => void
  onDisconnect: () => void
}

// ✅ CRITICAL: Kit must be lazy-initialized in browser only
let _kitInstance: StellarWalletsKit | null = null

function getKit(): StellarWalletsKit {
  if (typeof window === 'undefined') {
    throw new Error('Wallet kit requires browser environment')
  }
  if (!_kitInstance) {
    _kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: [
        new FreighterModule(),
        new xBullModule(),
        new LobstrModule(),
        new AlbedoModule(),
      ],
    })
  }
  return _kitInstance
}

export default function WalletConnection({
  onConnect,
  onDisconnect,
}: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // ✅ Only run in browser — prevents SSR crash
  useEffect(() => {
    setMounted(true)
    // Restore session from localStorage
    const saved = localStorage.getItem('bc_wallet')
    if (saved) {
      restoreSession(saved)
    }
  }, [])

  async function restoreSession(key: string) {
    try {
      const bal = await getBalance(key)
      setPublicKey(key)
      setBalance(bal)
      const kit = getKit()
      onConnect(key, kit)
    } catch {
      localStorage.removeItem('bc_wallet')
    }
  }

  const handleConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      const kit = getKit()

      // ✅ THE CORRECT PATTERN per official README:
      // getAddress() must be called INSIDE onWalletSelected, after setWallet
      // This is where the wallet is actually active and can return the address
      await kit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          try {
            // Step 1: Set the wallet the user selected
            kit.setWallet(option.id)

            // Step 2: Get address while wallet is active in callback
            const { address } = await kit.getAddress()

            // Step 3: Fetch balance
            const bal = await getBalance(address)

            // Step 4: Update state
            setPublicKey(address)
            setBalance(bal)
            localStorage.setItem('bc_wallet', address)
            onConnect(address, kit)
          } catch (innerErr: any) {
            console.error('❌ Error in wallet selection:', innerErr)
            setError(innerErr?.message || 'Failed to get wallet address')
          }
        },
      })
    } catch (err: any) {
      // User closed the modal — not a real error, don't show it
      if (
        err?.message?.toLowerCase().includes('modal') ||
        err?.message?.toLowerCase().includes('closed') ||
        err?.message?.toLowerCase().includes('cancel') ||
        err?.message?.toLowerCase().includes('user rejected')
      ) {
        return
      }
      console.error('❌ Connect error:', err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setPublicKey(null)
    setBalance(null)
    setError(null)
    localStorage.removeItem('bc_wallet')
    onDisconnect()
  }

  const handleRefreshBalance = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const bal = await getBalance(publicKey)
      setBalance(bal)
    } finally {
      setLoading(false)
    }
  }

  const shortKey = (key: string) =>
    `${key.slice(0, 6)}...${key.slice(-4)}`

  // ✅ Don't render wallet UI during SSR
  if (!mounted) {
    return (
      <div className="bc-panel">
        <div className="bc-label">01 · Wallet</div>
        <div className="text-sm text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bc-panel">
      <div className="bc-label">01 · Wallet</div>

      {!publicKey ? (
        <>
          <button
            className="bc-btn bc-btn-primary"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? <>🔄 Connecting...</> : '⬡ Connect Wallet'}
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
            Freighter · xBull · Lobstr
          </p>
          {error && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(232,0,45,0.1)',
                color: '#e8002d',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}
            >
              ❌ {error}
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00e87a', animation: 'pulse 2s infinite' }} />
            <span className="bc-mono">{shortKey(publicKey)}</span>
          </div>
          
          {balance && (
            <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--muted)' }}>Balance: </span>
              <span style={{ fontWeight: 'bold' }}>{balance} XLM</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="bc-btn bc-btn-ghost"
              onClick={handleRefreshBalance}
              disabled={loading}
              style={{ fontSize: '0.75rem', flex: 1 }}
            >
              ↻ Refresh
            </button>
            <button
              className="bc-btn bc-btn-ghost"
              onClick={handleDisconnect}
              style={{ fontSize: '0.75rem', flex: 1 }}
            >
              Disconnect
            </button>
          </div>
        </>
      )}
    </div>
  )
}
