'use client';

import { useState } from 'react'
import WalletConnection from '@/components/WalletConnection'
import BalanceDisplay from '@/components/BalanceDisplay'
import PaymentForm from '@/components/PaymentForm'
import TransactionHistory from '@/components/TransactionHistory'

export default function Home() {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  // Trigger balance refresh after a successful send
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleConnect = (pk: string) => setPublicKey(pk)
  const handleDisconnect = () => setPublicKey(null)
  const handleSendSuccess = () => setRefreshTrigger(n => n + 1)

  return (
    <>
      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="nav-bar">
        <div className="logo">
          {/* Blood drop SVG icon */}
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M18 3C18 3 6 10 6 19.5C6 25.85 11.37 31 18 31C24.63 31 30 25.85 30 19.5C30 10 18 3 18 3Z"
              fill="#e8002d" opacity="0.9"
            />
            <path
              d="M10 20 L14 20 L16 16 L18 24 L20 18 L22 20 L26 20"
              stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span className="logo-text">
            BLOOD<span style={{ color: 'var(--red)' }}>CHAIN</span>
          </span>
        </div>
        <div className="belt-badge">
          <span className="belt-dot" />
          WHITE BELT · LEVEL 1
        </div>
      </nav>

      {/* ── MAIN ────────────────────────────────────── */}
      <main className="main-container">

        {/* Hero */}
        <div className="hero animate-fadeUp">
          <p className="hero-tag">⬡ Stellar Testnet · Builder Challenge</p>
          <h1 className="hero-h1">
            EMERGENCY<br />
            <span style={{ color: 'var(--red)' }}>BLOOD</span><br />
            NETWORK
          </h1>
          {/* Heartbeat line */}
          <div className="hb-line">
            <svg viewBox="0 0 520 48" fill="none">
              <path
                d="M0 24 H80 L95 8 L110 40 L125 4 L140 44 L155 24 H520"
                stroke="#e8002d" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{
                  strokeDasharray: 600,
                  strokeDashoffset: 600,
                  animation: 'drawHB 1.8s ease forwards 0.3s',
                }}
              />
            </svg>
          </div>
          <p className="hero-sub">
            Connect your Freighter wallet, check your XLM balance, and send your first
            on-chain transaction on Stellar Testnet — the foundation of a decentralized
            blood donor registry.
          </p>
        </div>

        {/* Panel Grid */}
        <div className="panel-grid animate-fadeUp-delay">
          <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
          <BalanceDisplay publicKey={publicKey} refreshTrigger={refreshTrigger} />
          <div style={{ gridColumn: '1 / -1' }}>
            <PaymentForm publicKey={publicKey} onSendSuccess={handleSendSuccess} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <TransactionHistory publicKey={publicKey} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>

      {/* Inline styles for layout (add to globals.css if you prefer) */}
      <style jsx>{`
        .nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2.5rem;
          border-bottom: 1px solid var(--red-dim);
          background: rgba(26,8,8,0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .logo { display: flex; align-items: center; gap: 0.75rem; }
        .logo-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem;
          letter-spacing: 0.08em;
          color: var(--white);
          line-height: 1;
        }
        .belt-badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: var(--white);
          background: var(--mid);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          padding: 0.3rem 0.7rem;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .belt-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #fff;
          display: inline-block;
          box-shadow: 0 0 6px rgba(255,255,255,0.7);
        }
        .main-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 2rem 6rem;
        }
        .hero { margin-bottom: 3rem; }
        .hero-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: var(--red);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .hero-h1 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 8vw, 5.5rem);
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin-bottom: 1rem;
        }
        .hb-line {
          width: 100%; max-width: 520px;
          height: 48px; margin: 1.5rem 0; overflow: hidden;
        }
        .hb-line svg { width: 100%; height: 100%; }
        .hero-sub {
          font-size: 0.95rem;
          color: var(--muted);
          font-weight: 300;
          max-width: 480px;
          line-height: 1.7;
        }
        .panel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        @media (max-width: 640px) {
          .panel-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
