'use client'

import { useEffect, useState } from 'react'
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  FREIGHTER_ID,
} from '@creit.tech/stellar-wallets-kit'

interface WalletConnectionProps {
  onConnect: (publicKey: string, kit: StellarWalletsKit) => void
  onDisconnect: () => void
}

let kit: StellarWalletsKit | null = null

function initKit() {
  if (!kit) {
    kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    })
  }
  return kit
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('bc_wallet')
    if (stored) {
      setPublicKey(stored)
      onConnect(stored, initKit())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('📱 Initializing wallet kit...')
      const walletKit = initKit()

      console.log('🔌 Opening wallet modal...')
      await walletKit.openModal({
        onWalletSelected: (option) => {
          console.log('✅ Selected:', option.id)
          walletKit.setWallet(option.id)
        },
      })

      console.log('⏳ Getting address...')
      const { address } = await walletKit.getAddress()

      if (!address) {
        throw new Error('No address returned')
      }

      console.log('🎉 Connected:', address)

      setPublicKey(address)
      localStorage.setItem('bc_wallet', address)
      onConnect(address, walletKit)
    } catch (err: any) {
      console.error('❌ Error:', err)
      const msg = err?.message || String(err)
      setError(msg.includes('rejected') ? 'Connection rejected' : msg)
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    kit = null
    setPublicKey(null)
    localStorage.removeItem('bc_wallet')
    onDisconnect()
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
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#00e87a' }} />
            <span>{publicKey.slice(0, 6)}···{publicKey.slice(-6)}</span>
          </div>
          <button
            className="bc-btn bc-btn-ghost"
            onClick={handleDisconnect}
            style={{ marginTop: '0.5rem' }}
          >
            Disconnect
          </button>
        </>
      )}

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
          🔌 {error}
        </div>
      )}
    </div>
  )
}
