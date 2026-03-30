'use client'

import { useEffect, useState } from 'react'
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'

interface WalletConnectionProps {
  onConnect: (publicKey: string, kit: StellarWalletsKit) => void
  onDisconnect: () => void
}

let kitInstance: StellarWalletsKit | null = null

function getKit() {
  if (!kitInstance) {
    try {
      kitInstance = new StellarWalletsKit({
        network: WalletNetwork.TESTNET,
        selectedWalletId: 'FREIGHTER',
        modules: allowAllModules(),
      })
    } catch (err) {
      console.error('Failed to initialize wallet kit:', err)
      kitInstance = null
    }
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
      if (kit) {
        setPublicKey(stored)
        onConnect(stored, kit)
      }
    }
  }, [onConnect])

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    setErrorType(null)
    
    console.log('🔌 Attempting to connect wallet...')
    
    try {
      const kit = getKit()
      if (!kit) {
        throw new Error('Wallet kit initialization failed')
      }

      console.log('📱 Opening wallet modal...')
      
      // Try direct connection first
      try {
        const { address } = await kit.getAddress()
        console.log('✅ Direct connection successful:', address)
        setPublicKey(address)
        localStorage.setItem('bc_wallet_pk', address)
        onConnect(address, kit)
        return
      } catch (directErr) {
        console.log('📋 Direct connection failed, trying modal:', directErr)
      }

      // Fall back to modal
      await kit.openModal({
        onWalletSelected: async (option) => {
          console.log('👝 Wallet selected:', option.id)
          kit.setWallet(option.id)
          const { address } = await kit.getAddress()
          console.log('✅ Address obtained:', address)
          setPublicKey(address)
          localStorage.setItem('bc_wallet_pk', address)
          onConnect(address, kit)
        },
      })
    } catch (err: any) {
      console.error('❌ Wallet connection error:', err)
      const msg: string = err?.message ?? String(err)
      
      if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('not installed') || msg.toLowerCase().includes('freighter')) {
        setError('Freighter wallet not found. Install the Freighter browser extension first.')
        setErrorType('wallet_not_found')
      } else if (msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('declined') || msg.toLowerCase().includes('cancelled')) {
        setError('Wallet connection was rejected. Try again.')
        setErrorType('user_rejected')
      } else if (msg.toLowerCase().includes('timeout')) {
        setError('Wallet connection timed out. Make sure Freighter is open and try again.')
        setErrorType('wallet_not_found')
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
    </div>
  )
}
