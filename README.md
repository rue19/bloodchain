# 🩸 BloodChain — Emergency Blood Network

### Stellar Journey to Mastery · Level 1 White Belt

**Status:** ✅ Level 1 Complete  
**Network:** Stellar Testnet  
**Built with:** Next.js 14 · TypeScript · Tailwind CSS · @creit.tech/stellar-wallets-kit · @stellar/stellar-sdk

---

## 🚀 What This Is

BloodChain is a decentralized emergency blood donor registry built on the Stellar blockchain. 

**Level 1** establishes the blockchain foundation:
- Wallet connection via Freighter/Stellar Wallets Kit
- Real-time XLM balance display
- XLM payment transactions with memo support
- Transaction history with Stellar Expert explorer links
- BloodChain design system (dark, medical-emergency aesthetic)

This Level 1 White Belt implementation is the architectural foundation for higher belt levels that will add donor registration, matching algorithms, and reward tokenomics.

---

## ✨ Level 1 Features

- ✅ **Freighter Wallet Integration** — Connect/disconnect via Stellar Wallets Kit
- ✅ **Balance Display** — Real-time XLM balance on Stellar Testnet
- ✅ **Send Payments** — Full XLM transaction flow with memo support
- ✅ **Transaction Feedback** — Success/error states with Stellar Expert links
- ✅ **Activity Log** — View recent transactions
- ✅ **BloodChain Design** — Custom dark theme with medical aesthetic
- ✅ **Responsive Layout** — Mobile-friendly (single column on < 640px)
- ✅ **Type-Safe** — Full TypeScript implementation

---

## 🏗️ Project Structure

```
bloodchain/
├── app/
│   ├── globals.css              ← BloodChain design tokens & animations
│   ├── layout.tsx               ← Root layout with metadata
│   └── page.tsx                 ← Main dashboard (orchestrates all panels)
├── components/
│   ├── WalletConnection.tsx     ← Panel 01: Connect/disconnect wallet
│   ├── BalanceDisplay.tsx       ← Panel 02: XLM balance with refresh
│   ├── PaymentForm.tsx          ← Panel 03: Send XLM transaction
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
