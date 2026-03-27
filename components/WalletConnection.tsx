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
    kitInstance = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: 'FREIGHTER',
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
    </div>
  )
}
