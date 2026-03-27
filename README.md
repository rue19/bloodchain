# 🩸 BloodChain — Emergency Blood Donor Registry
### Stellar Journey to Mastery · Level 3 Orange Belt

**Live Demo:** https://your-bloodchain.vercel.app

---

## What This Is

BloodChain is a decentralized emergency blood donor registry on Stellar Soroban testnet.
Donors register on-chain with blood type and location. Anyone can query the registry.
The live stats panel polls the smart contract every 8 seconds.

---

## Level 2 + Level 3 Features

- ✅ Multi-wallet connect via StellarWalletsKit (Freighter, xBull, Lobstr, WalletConnect)
- ✅ Soroban smart contract deployed on Stellar testnet
- ✅ `register_donor` — writes donor record to contract (requires wallet signature)
- ✅ `get_donor` — reads donor record (no signing needed)
- ✅ `get_donor_count` — real-time polling every 8 seconds
- ✅ Transaction status tracking: idle → pending → success/error with progress bar
- ✅ 3 error types: wallet_not_found · user_rejected · insufficient_balance
- ✅ 15 Vitest unit tests passing
- ✅ Loading indicators and animated progress bar

---

## Smart Contract

**Deployed Contract Address:**
PASTE_YOUR_CONTRACT_ID_HERE

**Contract on Stellar Expert:**
https://stellar.expert/explorer/testnet/contract/PASTE_YOUR_CONTRACT_ID_HERE

**Transaction Hash (registration call):**
PASTE_YOUR_FIRST_TX_HASH_HERE

**Verify on Stellar Expert:**
https://stellar.expert/explorer/testnet/tx/PASTE_YOUR_TX_HASH_HERE

---

## Screenshots

### Wallet Options Modal
![wallet options](./screenshots/wallet-modal.png)

### Donor Registration Success
![registration](./screenshots/registration-success.png)

### Test Output (15 tests passing)
![tests](./screenshots/test-output.png)

---

## Demo Video

https://youtu.be/YOUR_VIDEO_ID

(1 minute: connect → register → live count update → donor lookup)

---

## Stack

Next.js 14 · TypeScript · Tailwind CSS · @creit.tech/stellar-wallets-kit  
@stellar/stellar-sdk v12 · Soroban SDK 21 (Rust) · Vitest

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/bloodchain
cd bloodchain && npm install
# Paste your CONTRACT_ID into lib/contract-helper.ts
npm run dev
```

## Run Tests

```bash
npm test
```

## Deploy Contract

```bash
cd contract
stellar contract build
stellar keys generate --global bloodchain-deployer --network testnet
stellar keys fund bloodchain-deployer --network testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/bloodchain_registry.wasm \
  --source bloodchain-deployer \
  --network testnet
```

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

## 🔗 Useful Links

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
