# 🩸 BloodChain — Level 1 White Belt
## Complete Coding Assistant Guide

> **Stack:** Next.js 14 · TypeScript · Tailwind CSS · @creit.tech/stellar-wallets-kit · @stellar/stellar-sdk  
> **Base repo to clone:** https://github.com/Halfgork/stellar-frontend-challenge  
> **Goal:** Replace all placeholder UI with the BloodChain design system. DO NOT touch `lib/stellar-helper.ts`.

---

## 0. CRITICAL RULES (Read First)

1. **NEVER modify `lib/stellar-helper.ts`** — this file handles all Stellar blockchain logic.
2. **NEVER write your own transaction/wallet logic** — use the `stellar` object from `lib/stellar-helper.ts`.
3. **DO** replace everything in `app/`, `components/`, and `app/globals.css` with BloodChain's design.
4. All Stellar operations go through `import { stellar } from '@/lib/stellar-helper'`.
5. Always use **Testnet**, never Mainnet.

---

## 1. SETUP

```bash
git clone https://github.com/Halfgork/stellar-frontend-challenge bloodchain
cd bloodchain
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## 2. FINAL PROJECT STRUCTURE

After your changes, the repo should look like this:

```
bloodchain/
├── app/
│   ├── globals.css          ← BloodChain design tokens & base styles
│   ├── layout.tsx           ← Root layout with fonts + metadata
│   └── page.tsx             ← Main dashboard (orchestrates all panels)
├── components/
│   ├── WalletConnection.tsx    ← Panel 01: connect/disconnect wallet
│   ├── BalanceDisplay.tsx      ← Panel 02: XLM balance
│   ├── PaymentForm.tsx         ← Panel 03: Send XLM transaction
│   ├── TransactionHistory.tsx  ← Panel 04: Activity log
│   └── BonusFeatures.tsx       ← (keep as-is or extend)
├── lib/
│   └── stellar-helper.ts    ← ⚠️ DO NOT TOUCH
└── package.json
```

---

## 3. DESIGN SYSTEM (Implement in `app/globals.css`)

Replace the entire contents of `app/globals.css` with this:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --red: #e8002d;
  --red-dim: #8a001a;
  --red-glow: rgba(232, 0, 45, 0.18);
  --white: #f5f0eb;
  --off: #1a0808;
  --mid: #2d1010;
  --muted: #5a2a2a;
  --accent: #ff4444;
  --green: #00e87a;
  --green-dim: rgba(0, 232, 122, 0.12);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--off);
  color: var(--white);
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Grain overlay */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1000;
  opacity: 0.5;
}

/* Scanline animation */
body::after {
  content: '';
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--red), transparent);
  animation: scanline 3s ease-in-out infinite;
  z-index: 999;
  opacity: 0.4;
  pointer-events: none;
}

@keyframes scanline {
  0%   { top: 0;     opacity: 0;   }
  10%  {             opacity: 0.4; }
  90%  {             opacity: 0.4; }
  100% { top: 100vh; opacity: 0;   }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 6px var(--green); }
  50%       { box-shadow: 0 0 18px var(--green); }
}

@keyframes blink {
  0%, 100% { opacity: 1;   }
  50%       { opacity: 0.2; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Heartbeat SVG path draw */
@keyframes drawHB {
  to { stroke-dashoffset: 0; }
}

.animate-fadeUp { animation: fadeUp 0.6s ease both; }
.animate-fadeUp-delay { animation: fadeUp 0.6s ease both 0.2s; }
```

---

## 4. ROOT LAYOUT (`app/layout.tsx`)

Replace the full file:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BloodChain — Emergency Blood Network',
  description: 'A verified blood donor registry on Stellar blockchain. Level 1 White Belt.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

## 5. MAIN PAGE (`app/page.tsx`)

This is the dashboard shell. It imports all 4 components and wires them together via shared state.

```tsx
'use client'

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
          <PaymentForm publicKey={publicKey} onSendSuccess={handleSendSuccess} />
          <TransactionHistory publicKey={publicKey} refreshTrigger={refreshTrigger} />
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
```

---

## 6. SHARED COMPONENT STYLE PATTERN

Every component uses this panel pattern. Copy this base for each:

```tsx
// Shared panel wrapper pattern used in ALL components

// CSS-in-JSX approach - add these as a <style jsx> block inside each component
// OR move to globals.css

/*
.panel {
  background: var(--mid);
  border: 1px solid var(--red-dim);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.panel:hover {
  border-color: var(--red);
  box-shadow: 0 0 24px var(--red-glow);
}
.panel.full-width { grid-column: 1 / -1; }

.panel-label {
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
.panel-label::before {
  content: '';
  width: 16px; height: 1px;
  background: var(--red);
}
*/
```

---

## 7. `components/WalletConnection.tsx`

**Props interface:**
```ts
interface WalletConnectionProps {
  onConnect: (publicKey: string) => void
  onDisconnect: () => void
}
```

**What it does:**
- Shows a connect button that opens the Stellar Wallets Kit modal
- Shows wallet address (shortened) with a green pulsing dot when connected
- Shows a disconnect button when connected
- Shows "Install Freighter" link note when no wallet is detected

**Stellar helper calls to use:**
```ts
import { stellar } from '@/lib/stellar-helper'

// Connect (opens multi-wallet modal)
const pk = await stellar.connectWallet()
// Returns the public key string on success

// Disconnect
stellar.disconnect()

// Format address for display
stellar.formatAddress(pk, 6, 6) // → "GABCD...WXYZ"
```

**Full component implementation:**
```tsx
'use client'

import { useState } from 'react'
import { stellar } from '@/lib/stellar-helper'

interface WalletConnectionProps {
  onConnect: (publicKey: string) => void
  onDisconnect: () => void
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setLoading(true)
    setError(null)
    try {
      const pk = await stellar.connectWallet()
      setPublicKey(pk)
      onConnect(pk)
    } catch (err: any) {
      setError(err.message || 'Connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    stellar.disconnect()
    setPublicKey(null)
    setError(null)
    onDisconnect()
  }

  return (
    <div className="bc-panel">
      <div className="bc-label">01 · Wallet</div>

      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <span className={`status-dot ${publicKey ? 'connected' : ''}`} />
        <span className={`wallet-addr ${!publicKey ? 'empty' : ''}`}>
          {publicKey ? stellar.formatAddress(publicKey, 6, 6) : 'Not connected'}
        </span>
        {publicKey && <span className="testnet-chip">TESTNET</span>}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {!publicKey ? (
          <button className="bc-btn bc-btn-primary" onClick={handleConnect} disabled={loading}>
            {loading ? <><span className="bc-spinner" /> Connecting...</> : 'Connect Wallet'}
          </button>
        ) : (
          <button className="bc-btn bc-btn-ghost" onClick={handleDisconnect}>
            Disconnect
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bc-feedback error" style={{ marginTop: '0.75rem' }}>
          ✕ {error}
        </div>
      )}

      {/* Freighter note */}
      <div className="bc-note" style={{ marginTop: '1rem' }}>
        Need a wallet?{' '}
        <a href="https://www.freighter.app/" target="_blank" rel="noreferrer">
          freighter.app
        </a>{' '}
        · Set it to <strong>Testnet</strong> before connecting.
      </div>

      <Styles />
    </div>
  )
}

// Component-scoped styles
function Styles() {
  return (
    <style>{`
      .bc-panel {
        background: var(--mid);
        border: 1px solid var(--red-dim);
        border-radius: 12px;
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .bc-panel:hover {
        border-color: var(--red);
        box-shadow: 0 0 24px var(--red-glow);
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
```

---

## 8. `components/BalanceDisplay.tsx`

**Props interface:**
```ts
interface BalanceDisplayProps {
  publicKey: string | null
  refreshTrigger: number  // increment this from parent to force a refresh
}
```

**Stellar helper calls:**
```ts
const { xlm, assets } = await stellar.getBalance(publicKey)
// xlm: string (e.g. "1042.3500000")
// assets: array of other Stellar assets (ignore for L1)
```

**Full implementation:**
```tsx
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

      <style>{`
        .balance-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3.5rem; line-height: 1;
          color: var(--white); letter-spacing: 0.04em;
          transition: color 0.3s;
        }
        .balance-num.loaded { color: var(--red); }
        .balance-unit {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem; color: var(--muted);
          letter-spacing: 0.2em; margin-top: 0.3rem;
        }
      `}</style>
    </div>
  )
}
```

---

## 9. `components/PaymentForm.tsx`

**Props interface:**
```ts
interface PaymentFormProps {
  publicKey: string | null
  onSendSuccess: () => void  // called after successful tx to refresh balance
}
```

**Stellar helper call:**
```ts
const result = await stellar.sendPayment({
  from: publicKey,       // sender's public key
  to: recipientAddress,  // G... address
  amount: "10.5",        // string, XLM amount
  memo: "BloodChain"     // optional memo (max 28 chars)
})
// result.hash → transaction hash string on success
// Throws on failure — catch the error

// Get explorer link from hash:
const link = stellar.getExplorerLink(result.hash, 'tx')
```

**Full implementation:**
```tsx
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
    // full-width panel — in page.tsx give this component grid-column: 1 / -1
    // by wrapping it: <div style={{ gridColumn: '1 / -1' }}><PaymentForm ... /></div>
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
```

> **Note:** Wrap `<PaymentForm>` in `page.tsx` with a full-width div:
> ```tsx
> <div style={{ gridColumn: '1 / -1' }}>
>   <PaymentForm publicKey={publicKey} onSendSuccess={handleSendSuccess} />
> </div>
> ```

---

## 10. `components/TransactionHistory.tsx`

**Props interface:**
```ts
interface TransactionHistoryProps {
  publicKey: string | null
  refreshTrigger: number
}
```

**Stellar helper call:**
```ts
const transactions = await stellar.getRecentTransactions(publicKey, 10)
// Returns array of transaction objects, each with:
// tx.hash, tx.created_at, tx.source_account, tx.memo, etc.

const link = stellar.getExplorerLink(tx.hash, 'tx')
```

**Full implementation:**
```tsx
'use client'

import { useEffect, useState } from 'react'
import { stellar } from '@/lib/stellar-helper'

interface TransactionHistoryProps {
  publicKey: string | null
  refreshTrigger: number
}

interface TxItem {
  hash: string
  created_at: string
  source_account: string
  memo?: string
  [key: string]: any
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
              <span className="log-time">{formatTime(tx.created_at)}</span>
              <span className="log-msg ok">
                <a
                  href={stellar.getExplorerLink(tx.hash, 'tx')}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--green)', textDecoration: 'none' }}
                >
                  {shortHash(tx.hash)} ↗
                </a>
                {tx.memo ? ` · ${tx.memo}` : ''}
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
```

---

## 11. `app/page.tsx` — Final Wiring of Full-Width Panels

Update the panel grid section in page.tsx to handle full-width panels:

```tsx
<div className="panel-grid animate-fadeUp-delay">
  <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
  <BalanceDisplay publicKey={publicKey} refreshTrigger={refreshTrigger} />
  {/* PaymentForm and TransactionHistory span full width */}
  <div style={{ gridColumn: '1 / -1' }}>
    <PaymentForm publicKey={publicKey} onSendSuccess={handleSendSuccess} />
  </div>
  <div style={{ gridColumn: '1 / -1' }}>
    <TransactionHistory publicKey={publicKey} refreshTrigger={refreshTrigger} />
  </div>
</div>
```

---

## 12. `next.config.js` — Required for Stellar Wallets Kit

The Stellar Wallets Kit uses browser-only APIs. Add this to avoid SSR issues:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig
```

If this file already exists in the repo, check if it already has webpack config — if so, just merge the `resolve.fallback` block.

---

## 13. TESTING CHECKLIST

Run through this before submitting:

```
[ ] npm run dev starts without errors
[ ] Page loads with BloodChain nav + hero + 4 panels
[ ] Heartbeat SVG animates on load
[ ] "Connect Wallet" opens Stellar Wallets Kit modal
[ ] After connecting: green pulsing dot appears, address shows (shortened)
[ ] Balance fetches automatically after connect
[ ] Balance shows correct XLM with 4 decimal places
[ ] "Refresh Balance" button works
[ ] Disconnect button works and resets all panels
[ ] Auto-reconnects if Freighter is already connected on page load
[ ] Send form validates: empty recipient, invalid amount, self-send
[ ] Send opens Freighter/wallet signing modal
[ ] After signing: success state shows tx hash + Stellar Expert link
[ ] After reject: error state shows "rejected" message
[ ] Balance refreshes after successful send
[ ] Transaction history shows past txs with explorer links
[ ] No console errors
[ ] Mobile layout: single column on < 640px
```

---

## 14. GITHUB SUBMISSION SETUP

```bash
# Create your own repo
gh repo create bloodchain --public
git remote set-url origin https://github.com/YOUR_USERNAME/bloodchain
git add .
git commit -m "feat: BloodChain Level 1 White Belt - Stellar wallet + balance + transaction"
git push origin main
```

**README.md for your repo** — add a section:

```md
# 🩸 BloodChain — Emergency Blood Network
### Stellar Journey to Mastery · Level 1 White Belt

**Live Demo:** [your-vercel-url]

## What This Is
BloodChain is a decentralized emergency blood donor registry built on Stellar.
Level 1 establishes the blockchain foundation: wallet connection, balance display,
and XLM transactions — which will evolve into donor registration and reward tokens in higher belts.

## Level 1 Features
- ✅ Freighter wallet connect/disconnect via Stellar Wallets Kit
- ✅ Real-time XLM balance display (Stellar Testnet)
- ✅ Send XLM transactions with memo support
- ✅ Transaction feedback with Stellar Expert explorer link
- ✅ Transaction history display
- ✅ BloodChain design system (dark, medical-emergency aesthetic)

## Stack
Next.js 14 · TypeScript · Tailwind CSS · @creit.tech/stellar-wallets-kit · @stellar/stellar-sdk

## Run Locally
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/bloodchain
cd bloodchain && npm install && npm run dev
\`\`\`
```

---

## 15. LEVEL PROGRESSION PLAN (Future Belts)

Keep this in mind as you build L1 — the architecture supports it:

| Belt | BloodChain Feature to Add |
|------|--------------------------|
| L2 Yellow | Donor registration form → smart contract call · Blood request events · Multi-wallet support |
| L3 Orange | Complete donor ↔ patient matching mini-dApp · Map/location UI |
| L4 Green | ZK-verified donation history on-chain · Reward token (custom Stellar asset) logic |
| L5 Blue | Production MVP · Real users · Geolocation matching · Onboard 5 real donors |
| L6 Black | Scale to 20 users · Analytics dashboard · Demo Day pitch deck |

---

*Guide written for BloodChain · Stellar Journey to Mastery · Level 1 White Belt*
