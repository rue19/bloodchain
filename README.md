# 🩸 BloodChain — Emergency Blood Donor Registry
### Stellar Journey to Mastery · Level 3 Orange Belt

**Live on Stellar Testnet** ✅ | **All Tests Passing** ✅ | **Contract Deployed** ✅

---

## ⭐ Submission Checklist

### ✅ Requirements Met
- ✅ **Mini-dApp Fully Functional** — Complete blood donor registry with contract integration  
- ✅ **15+ Tests Passing** — All Vitest tests passing (donor-registration, error-handling, contract-helper)
- ✅ **README Complete** — Comprehensive documentation with all features, testing, deployment info
- ✅ **4+ Meaningful Commits** — Git history shows development progression
- ✅ **Public GitHub Repository** — https://github.com/rue19/bloodchain

### 📋 Documentation Ready

**Test Output Screenshot:**
```
 RUN  v0.34.6 /home/shrin/Desktop/bloodchain

 ✓ tests/donor-registration.test.ts (5)
 ✓ tests/error-handling.test.ts (5)
 ✓ tests/contract-helper.test.ts (5)

 Test Files  3 passed (3)
      Tests  15 passed (15)
   Start at  21:03:22
   Duration  4.67s
```

**Live Demo Link (Deploy using steps below):**
- 🔗 To be added after Vercel deployment (see [Quick Deploy to Vercel](#-quick-deploy-to-vercel) section)
- **Format:** `https://bloodchain-yourname.vercel.app`
- **What to verify:** Can connect wallet, register donor, view live stats, lookup donors

**Demo Video (1-minute):**
- 📹 To be recorded using steps below (see [Recording Your Demo Video](#-recording-your-demo-video-1-minute) section)
- **Format:** YouTube unlisted video link
- **What to show:** Wallet connection → donor registration → tx confirmation → live stats → donor lookup

---

## What This Is

BloodChain is a decentralized emergency blood donor registry built on Stellar Soroban smart contracts. 
Donors register on-chain with their blood type and location. The live stats panel polls the contract every 8 seconds 
to show real-time donor registrations.

**Level 3 includes all Level 2 features plus:**
- ✅ Fully deployed Soroban smart contract on Stellar Testnet
- ✅ Multi-wallet support (Freighter, xBull, Lobstr, WalletConnect)
- ✅ Real-time contract polling every 8 seconds
- ✅ Complete error handling (3 error types)
- ✅ 15 passing Vitest unit tests
- ✅ Transaction status tracking with progress indicators
- ✅ Explorer links for transactions and contracts

---

## Deployed Contract

**Contract Address (Testnet):**
```
CCCCFK4TVKDTPKLLMLI2I4BDHWYNCKTWXIU3UJ2JIFXVXZAK4CX66RQD
```

**View on Stellar Expert:**
https://stellar.expert/explorer/testnet/contract/CCCCFK4TVKDTPKLLMLI2I4BDHWYNCKTWXIU3UJ2JIFXVXZAK4CX66RQD

**Deployment Transactions:**
- **WASM Upload:** [dca52a44c20aa10e5147cabae8b4d739760b06e0c23c72609c55fada4d6d419b](https://stellar.expert/explorer/testnet/tx/dca52a44c20aa10e5147cabae8b4d739760b06e0c23c72609c55fada4d6d419b)
- **Contract Deploy:** [441abad59250d15bbb51c38eca3073d7fb11e1de989853a76da30848984b8154](https://stellar.expert/explorer/testnet/tx/441abad59250d15bbb51c38eca3073d7fb11e1de989853a76da30848984b8154)

---

## Level 2 + Level 3 Features

### Smart Contract (Soroban/Rust)
- ✅ `register_donor(address, blood_type, location)` — Write donor to contract storage
- ✅ `get_donor_count()` — Returns total registered donors (0 at genesis)
- ✅ Deployed on **Stellar Testnet** using soroban-sdk v22.0.7
- ✅ Built with **wasm32v1-none** target (no reference-types)

### Frontend Components
- ✅ **WalletConnection** — Multi-wallet modal (Freighter, xBull, Lobstr, WalletConnect)
- ✅ **BalanceDisplay** — Real-time XLM balance with refresh
- ✅ **DonorRegistration** — Blood type selector + location input + animated progress bar
- ✅ **DonorLookup** — Query and display donor records from contract
- ✅ **LiveStats** — Real-time donor count with 8-second polling
- ✅ **PaymentForm** — Send XLM transactions (Level 1 retained)
- ✅ **TransactionHistory** — View recent transactions (Level 1 retained)

### Error Handling
- ✅ **wallet_not_found** — Wallet not installed or accessible
- ✅ **user_rejected** — User declined transaction in wallet
- ✅ **insufficient_balance** — Account doesn't have enough XLM (need ≥1 XLM)
- ✅ **unknown** — Other errors with descriptive messages

### Testing & Quality
- ✅ 15 Vitest unit tests (all passing)
- ✅ Error classification tests (5 tests)
- ✅ Contract helper utilities tests (5 tests)
- ✅ Donor registration validation tests (5 tests)

---

## Test Results

```
✓ tests/donor-registration.test.ts  (5 tests) 21ms
✓ tests/error-handling.test.ts      (5 tests) 38ms
✓ tests/contract-helper.test.ts     (5 tests) 21ms

Test Files  3 passed (3)
Tests       15 passed (15)
Duration    3.57s
```

**To verify:** `npm test`

---

## Stack

**Blockchain:**
- Stellar Testnet (SDF Network)
- Soroban Smart Contracts (Rust)
- soroban-sdk v22.0.7

**Frontend:**
- Next.js 14
- TypeScript
- React 18.3
- Tailwind CSS
- @creit.tech/stellar-wallets-kit
- @stellar/stellar-sdk v12.3+

**Testing:**
- Vitest v0.34.6
- jsdom

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/bloodchain
cd bloodchain
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

### 3. Connect Wallet
- Install [Freighter Wallet](https://freighter.app) (or use xBull, Lobstr, WalletConnect)
- Set to **Testnet**
- Click "⬡ Connect Wallet"

### 4. Fund Your Account
- Get testnet XLM from [Stellar Friendbot](https://developers.stellar.org/docs/tools/friendbot)
- Need at least 1 XLM to call the contract

### 5. Register as Donor
- Select blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Enter location (e.g. "Mumbai, India")
- Click "🩸 Register as Donor"
- Approve in your wallet
- Wait for transaction confirmation

### 6. View Live Stats
- Panel 07 shows real-time donor count
- Updates every 8 seconds from contract
- Displays "LIVE · Updated HH:MM:SS"

### 7. Look Up Donors
- Panel 06: Enter a Stellar address (G...)
- View blood type, location, registration date, availability status

---

## Run Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on file changes)
npm test:watch

# Coverage report
npm test:coverage
```

---

## Project Structure

```
bloodchain/
├── contract/                        ← Soroban smart contract
│   ├── Cargo.toml
│   ├── src/lib.rs
│   └── target/wasm32v1-none/...    ← Compiled WASM
├── app/
│   ├── globals.css                  ← BloodChain design + L3 classes
│   ├── layout.tsx
│   └── page.tsx                     ← Main dashboard
├── components/
│   ├── WalletConnection.tsx         ← Multi-wallet modal
│   ├── BalanceDisplay.tsx
│   ├── PaymentForm.tsx
│   ├── TransactionHistory.tsx
│   ├── DonorRegistration.tsx        ← NEW: Register on contract
│   ├── DonorLookup.tsx              ← NEW: Query contract
│   └── LiveStats.tsx                ← NEW: Real-time polling
├── lib/
│   ├── stellar-helper.ts            ← Level 1 (XLM payments)
│   └── contract-helper.ts           ← NEW: Soroban contract calls
├── tests/
│   ├── error-handling.test.ts
│   ├── contract-helper.test.ts
│   └── donor-registration.test.ts
├── vitest.config.ts
├── package.json
└── README.md
```

---

## Design System

**Colors (Dark Medical Emergency Theme):**
- Primary Red: `#e8002d` (blood red, emergency)
- Accent: `#ff4444` (bright alert)
- Green: `#00e87a` (success/available)
- Background: `#1a0808` (very dark)
- Mid: `#2d1010` (card background)
- Muted: `#5a2a2a` (lighter text)

**Fonts:**
- Display: Bebas Neue (titles, numbers)
- Body: DM Sans (regular text)
- Monospace: DM Mono (addresses, tech text)

**Components:**
- `.bc-panel` — Card container with hover glow
- `.bc-btn-primary` — Main action button (red)
- `.bc-btn-ghost` — Secondary button (outline)
- `.bc-spinner` — Loading indicator
- `.bc-feedback` — Success/error messages
- `.bc-input` — Form inputs
- `.bc-label` — Field labels

---

## Key Files

### Contract
- [contract/src/lib.rs](contract/src/lib.rs) — Soroban smart contract source
- [contract/Cargo.toml](contract/Cargo.toml) — Dependencies & build config

### Frontend Integration
- [lib/contract-helper.ts](lib/contract-helper.ts) — All Soroban RPC calls
- [components/DonorRegistration.tsx](components/DonorRegistration.tsx) — Registration form
- [components/DonorLookup.tsx](components/DonorLookup.tsx) — Lookup interface
- [components/LiveStats.tsx](components/LiveStats.tsx) — Polling dashboard

### Tests
- [tests/error-handling.test.ts](tests/error-handling.test.ts) — Error classification
- [tests/contract-helper.test.ts](tests/contract-helper.test.ts) — Config & utilities
- [tests/donor-registration.test.ts](tests/donor-registration.test.ts) — Input validation

---

## How Soroban Integration Works

### Frontend Flow
1. **User connects wallet** → `WalletConnection.tsx` opens StellarWalletsKit modal
2. **User registers as donor** → `DonorRegistration` collects blood type + location
3. **Contract call initiated** → `registerDonor()` in `contract-helper.ts` builds XDR
4. **Wallet signs** → `kit.signTransaction(xdr)` asks user approval
5. **Transaction submitted** → Server sends signed TX to Soroban RPC
6. **Polling for result** → Waits up to 30 seconds for confirmation
7. **Success feedback** → Shows tx hash with Stellar Expert link
8. **LiveStats updates** → `get_donor_count()` polled every 8 seconds

### Contract Functions
```typescript
register_donor(donor: Address, blood_type: String, location: String) → bool
  - Requires wallet signature
  - Stores blood type (location in memo/events for now)
  - Increments donor count
  - Emits REGISTER event

get_donor_count() → u32
  - Read-only query
  - Returns total registered donors
  - Updates every 8 seconds in frontend
```

---

## Deployment Info

### Build & Deploy Commands

**Build contract for testnet:**
```bash
cd contract
cargo build --target wasm32v1-none --release
# Output: target/wasm32v1-none/release/bloodchain_registry.wasm
```

**Deploy to testnet:**
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/bloodchain_registry.wasm \
  --source bloodchain-deployer \
  --network testnet
```

**Verify deployment:**
```bash
stellar contract invoke \
  --id CCCCFK4TVKDTPKLLMLI2I4BDHWYNCKTWXIU3UJ2JIFXVXZAK4CX66RQD \
  --source bloodchain-deployer \
  --network testnet \
  -- get_donor_count
# Returns: 0
```

### Important Notes
- Contract uses **wasm32v1-none** target to avoid reference-types compatibility issues with testnet
- soroban-sdk **22.0.7** with no `alloc` feature (keeps WASM small & compatible)
- Minimum 1 XLM required in account to call contract
- Testnet funds reset periodically, redeploy if needed

---

## Future Enhancements (Level 4+)

- [ ] Donor availability matching algorithm
- [ ] Medical history storage (encrypted)
- [ ] Reward tokens for donations
- [ ] Integration with blood bank systems
- [ ] Geographic proximity filtering
- [ ] Emergency alerts & notifications
- [ ] Mobile app (React Native)
- [ ] Mainnet deployment

---

## Troubleshooting

### "Wallet not found"
- Install [Freighter](https://freighter.app) or use xBull/Lobstr
- Refresh page after installing
- Check browser extension is enabled

### "Insufficient balance"
- Need at least 1 XLM on testnet
- Get XLM from [Stellar Friendbot](https://developers.stellar.org/docs/tools/friendbot)
- Fund with public key (G...)

### "Transaction rejected by user"
- Check Freighter prompt in wallet extension
- Confirm transaction details
- Try again

### Contract call fails
- Verify contract address is set in [lib/contract-helper.ts](lib/contract-helper.ts)
- Check Stellar Testnet status
- View error in browser DevTools console

---

## License

MIT License - See LICENSE file

---

## Support

Questions? Issues? Check out:
- [Stellar Developers Discord](https://discord.gg/6P6mVL)
- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Docs](https://soroban.stellar.org/)
- [GitHub Issues](https://github.com/YOUR_USERNAME/bloodchain/issues)

---

**Built with ❤️ for the Stellar Builder Challenge**


---
│   └── TransactionHistory.tsx   ← Panel 04: Activity log
├── lib/
│   └── stellar-helper.ts        ← Stellar blockchain logic (DO NOT MODIFY)
├── next.config.js               ← Webpack config for Stellar SDK
└── package.json
```

---

## 🎨 Design System

**Colors:**
- `--red`: #e8002d (Primary, emergency theme)
- `--green`: #00e87a (Success)
- `--white`: #f5f0eb (Text)
- `--off`: #1a0808 (Background)
- `--mid`: #2d1010 (Panel background)
- `--muted`: #5a2a2a (Disabled text)

**Fonts:**
- Bebas Neue (Headlines)
- DM Mono (Code, labels, numbers)
- DM Sans (Body)

**Animations:**
- Grain overlay + scanline effect
- Heartbeat SVG on hero
- Pulse-green on wallet connection indicator
- Smooth fade-up transitions

---

## 📦 Stack

| Package | Purpose |
|---------|---------|
| **Next.js 14** | React framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility styling |
| **@creit.tech/stellar-wallets-kit** | Multi-wallet connection |
| **@stellar/stellar-sdk** | Blockchain operations |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Freighter wallet installed ([freighter.app](https://www.freighter.app/))
- Freighter set to **Testnet**

### Local Setup

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/bloodchain.git
cd bloodchain

# Install dependencies
npm install

# Start dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## ⚙️ Usage

1. **Connect Your Wallet**
   - Click "Connect Wallet" button
   - Select Freighter (or another Stellar wallet)
   - Approve the connection in your wallet

2. **View Your Balance**
   - XLM balance appears automatically
   - Click "↻ Refresh Balance" to update manually

3. **Fund Your Account (if balance is 0)**
   - Click the **Friendbot** link in Panel 02
   - This funds your testnet account with 10 XLM

4. **Send Your First Transaction**
   - Enter a recipient address (G...)
   - Enter amount in XLM
   - (Optional) Add a memo
   - Click "Send XLM →"
   - Approve in your wallet
   - See transaction hash and Stellar Expert link

5. **View Transaction History**
   - Recent transactions appear in Panel 04
   - Click explorer links to see details on Stellar Expert

---

## 🧪 Testing Checklist

Before deployment, verify:

- [ ] App loads at http://localhost:3000
- [ ] BloodChain nav + hero display correctly
- [ ] Heartbeat SVG animates
- [ ] "Connect Wallet" opens wallet modal
- [ ] Green pulsing dot appears after connection
- [ ] Address shows shortened format
- [ ] Balance fetches automatically
- [ ] Refresh button works
- [ ] Disconnect clears all panels
- [ ] Form validates inputs (empty fields, self-send, invalid amount)
- [ ] Wallet signing modal appears
- [ ] Success state shows tx hash + explorer link
- [ ] Failure state shows error message
- [ ] Balance refreshes after successful send
- [ ] Transaction history shows past txs
- [ ] No console errors
- [ ] Mobile layout works (< 640px)

---

## � Quick Deploy to Vercel

Get your live demo link in 3 steps:

### Step 1: Connect to Vercel
```bash
# Option A: Via Vercel Web
# 1. Go to https://vercel.com
# 2. Sign up / Log in
# 3. Click "New Project"
# 4. Select "Import Git Repository"
# 5. Choose: https://github.com/rue19/bloodchain
# 6. Click "Deploy"

# Option B: Via Vercel CLI
npm i -g vercel
cd /home/shrin/Desktop/bloodchain
vercel
# Follow prompts, choose "Vercel" account and project name
```

### Step 2: Wait for Deployment
- Takes ~2 minutes
- Vercel automatically detects Next.js
- No config needed!

### Step 3: Get Your Live Link
- After deployment completes, you'll get: `https://bloodchain-xyz.vercel.app`
- Copy this URL and add it to the README in the "✅ Submission Checklist" section

### Your Live Demo Checklist
- ✅ Visit deployed URL
- ✅ Can connect wallet (testnet)
- ✅ Can register as donor
- ✅ Can see live stats polling
- ✅ Can look up donors
- ✅ Works on mobile

---

## 📹 Recording Your Demo Video (1-minute)

### What to Show (60 seconds max)
```
0:00-0:05    Homepage & UI overview
0:05-0:10    Connect wallet (Freighter)
0:10-0:25    Register as donor (blood type + location)
0:25-0:40    Show transaction confirmation
0:40-0:50    View live stats updating
0:50-1:00    Look up a donor record
```

### Easy Recording Tools

**Option 1: ScreenFlow (Mac) - Recommended**
```bash
# Built-in on macOS
# 1. Open ScreenFlow
# 2. Click "New"
# 3. Select area or full screen
# 4. Press "Start Recording"
# 5. Perform demo steps above
# 6. Stop & export as MP4
# 7. Upload to YouTube (unlisted)
```

**Option 2: OBS Studio (All Platforms) - Free**
```bash
# Download: https://obsproject.com
# 1. Add "Display Capture" source
# 2. Click "Start Recording"
# 3. Perform demo steps
# 4. Click "Stop Recording"
# 5. File saved to Videos folder
# 6. Upload to YouTube (unlisted)
```

**Option 3: ShareX (Windows) - Fast**
```bash
# Download: https://getsharex.com
# 1. Open ShareX
# 2. Click "Capture" → "Screen capture"
# 3. Perform demo steps
# 4. Right-click video → "Upload" → YouTube (unlisted)
```

### Demo Script (Speak while recording)
```
"BloodChain is a decentralized blood donor registry on Stellar.
Here's the interface with all 7 panels.

I'm connecting my wallet using Freighter...
[Click wallet button, approve in wallet]

Now I'll register as a donor with O+ blood type and my location...
[Fill form, click register, approve transaction]

Here's the confirmed transaction on Stellar Explorer...
[Show success screen with tx link]

Panel 07 shows real-time donor count, polling every 8 seconds...
[Wait 8 seconds, show it updates]

I can look up any donor by address...
[Enter address, show donor record with blood type and location]

That's BloodChain - decentralized, real-time, and live on Stellar Testnet!"
```

### Upload Your Video
1. Go to https://youtube.com/upload
2. Upload the video (unlisted)
3. Copy the video URL (e.g., `https://youtu.be/abc123xyz`)
4. Add to README "✅ Submission Checklist" section

---

## �🔗 Useful Links

- **Freighter Wallet:** https://www.freighter.app/
- **Stellar Testnet Friendbot:** https://friendbot.stellar.org/
- **Stellar Expert (Explorer):** https://stellar.expert/
- **Stellar Docs:** https://developers.stellar.org/
- **Stellar Wallets Kit:** https://github.com/creit-tech/stellar-wallets-kit

---

## 📚 Level Progression

This is **Level 1 White Belt**. Future levels will add:

| Level | Feature | Description |
|-------|---------|-------------|
| L1 | Foundation | Wallet + balance + send XLM ✅ |
| L2 | Donor Registry | Registration form · Blood request events |
| L3 | Matching | Donor ↔ patient matching mini-dApp · Map UI |
| L4 | ZK + Tokens | ZK-verified history · Custom reward token |
| L5 | Production MVP | Real users · 5 live donors · Analytics |
| L6 | Scale & Demo | 20+ users · Demo Day pitch |

---

## ⚠️ CRITICAL RULES

1. **NEVER modify `lib/stellar-helper.ts`** — contains all blockchain logic
2. **NEVER write custom transaction/wallet code** — use the `stellar` object
3. **ALWAYS use Testnet** — never test on Mainnet
4. **KEEP sensitive data secure** — never commit `.env` with private keys

---

## 📝 License

MIT · BloodChain · Stellar Journey to Mastery

---

## 🤝 Contributing

This is a learning project. To contribute:
1. Fork the repo
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add feature'`)
4. Push to your fork
5. Open a Pull Request

---

## 📧 Questions?

- Read the [BLOODCHAIN_L1_GUIDE.md](./BLOODCHAIN_L1_GUIDE.md) for complete spec
- Check Stellar docs at https://developers.stellar.org/
- Open an issue if you find bugs

---

**Built with ❤️ for the Stellar community · Level 1 White Belt**
