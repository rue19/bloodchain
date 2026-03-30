/**
 * Stellar Helper - Blockchain Logic with Stellar Wallets Kit
 * ⚠️ DO NOT MODIFY THIS FILE! ⚠️
 */

import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  FreighterModule,
  xBullModule,
  LobstrModule,
  AlbedoModule,
} from '@creit.tech/stellar-wallets-kit'
import {
  Horizon,
  Networks,
  TransactionBuilder,
  BASE_FEE,
  Operation,
  Asset,
  Memo,
} from '@stellar/stellar-sdk'

// ✅ CRITICAL: Never initialize at module level — Next.js SSR will crash
// Kit must be created inside a function that only runs in browser
let _kit: StellarWalletsKit | null = null

function getKit(): StellarWalletsKit {
  if (typeof window === 'undefined') {
    throw new Error('Wallet kit can only be used in browser environment')
  }
  if (!_kit) {
    _kit = new StellarWalletsKit({
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
  return _kit
}

export const TESTNET_RPC = 'https://soroban-testnet.stellar.org'
export const NETWORK_PASSPHRASE = Networks.TESTNET

// Horizon server for classic Stellar operations (payments, balance)
const server = new Horizon.Server('https://horizon-testnet.stellar.org')

export class StellarHelper {
  private kit: StellarWalletsKit | null;
  public publicKey: string | null = null;

  constructor() {
    // ✅ Don't initialize kit here - defer to first use in browser
    this.kit = null;
  }

  private getKitInstance(): StellarWalletsKit {
    if (!this.kit) {
      this.kit = getKit();
    }
    return this.kit;
  }

  isFreighterInstalled(): boolean {
    return true;
  }

  async connectWallet(): Promise<string> {
    try {
      // ✅ CRITICAL API PATTERN: getAddress() must be called INSIDE onWalletSelected
      // after setWallet, not after openModal resolves
      let connectedAddress: string | null = null

      const kit = this.getKitInstance()
      await kit.openModal({
        onWalletSelected: async (option) => {
          console.log('Wallet selected:', option.id);
          kit.setWallet(option.id);
          
          // Get address while wallet is active in callback
          const { address } = await kit.getAddress();
          connectedAddress = address;
        }
      });

      if (!connectedAddress) {
        throw new Error('Wallet bağlanamadı');
      }

      this.publicKey = connectedAddress;
      return connectedAddress;
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      throw new Error('Wallet bağlantısı başarısız: ' + error.message);
    }
  }

  async getBalance(publicKey: string): Promise<{
    xlm: string;
    assets: Array<{ code: string; issuer: string; balance: string }>;
  }> {
    const account = await server.loadAccount(publicKey);
    
    const xlmBalance = account.balances.find(
      (b: any) => b.asset_type === 'native'
    );

    const assets = account.balances
      .filter((b: any) => b.asset_type !== 'native')
      .map((b: any) => ({
        code: b.asset_code,
        issuer: b.asset_issuer,
        balance: b.balance,
      }));

    return {
      xlm: xlmBalance && 'balance' in xlmBalance ? xlmBalance.balance : '0',
      assets,
    };
  }

  async sendPayment(params: {
    from: string;
    to: string;
    amount: string;
    memo?: string;
  }): Promise<{ hash: string; success: boolean }> {
    const account = await server.loadAccount(params.from);

    const transactionBuilder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    }).addOperation(
      Operation.payment({
        destination: params.to,
        asset: Asset.native(),
        amount: params.amount,
      })
    );

    if (params.memo) {
      transactionBuilder.addMemo(Memo.text(params.memo));
    }

    const transaction = transactionBuilder.setTimeout(180).build();
    const kit = this.getKitInstance();

    // Wallet Kit ile imzala
    const { signedTxXdr } = await kit.signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    const transactionToSubmit = TransactionBuilder.fromXDR(
      signedTxXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(
      transactionToSubmit
    );

    return {
      hash: (result as any).hash,
      success: (result as any).successful,
    };
  }

  async getRecentTransactions(
    publicKey: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const txs = await server
        .transactions()
        .forAccount(publicKey)
        .limit(limit)
        .order('desc')
        .call()
      return (txs as any).records
    } catch {
      return []
    }
  }

  getExplorerLink(hash: string, type: 'tx' | 'account' = 'tx'): string {
    const network = 'testnet'
    return `https://stellar.expert/explorer/${network}/${type}/${hash}`
  }

  formatAddress(address: string, startChars: number = 4, endChars: number = 4): string {
    if (address.length <= startChars + endChars) {
      return address
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
  }

  disconnect() {
    this.publicKey = null
    return true
  }
}

// Export standalone functions for use outside the class
export async function getBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey)
    const xlmBalance = account.balances.find(
      (b: any) => b.asset_type === 'native'
    )
    return xlmBalance ? parseFloat((xlmBalance as any).balance).toFixed(2) : '0.00'
  } catch (e) {
    console.error('getBalance error:', e)
    return '0.00'
  }
}

export async function sendPayment(
  kit: StellarWalletsKit,
  fromKey: string,
  toKey: string,
  amount: string,
  memo?: string
): Promise<string> {
  const account = await server.loadAccount(fromKey)
  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: toKey,
        asset: Asset.native(),
        amount: amount,
      })
    )
    .setTimeout(30)

  if (memo) tx = tx.addMemo(Memo.text(memo))

  const built = tx.build()
  const { signedTxXdr } = await kit.signTransaction(built.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: fromKey,
  })

  const result = await server.submitTransaction(
    TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE)
  )
  return (result as any).hash
}

export async function getTransactionHistory(publicKey: string): Promise<Array<{
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
}>> {
  try {
    const payments = await server
      .payments()
      .forAccount(publicKey)
      .order('desc')
      .limit(10)
      .call()

    return (payments as any).records.map((payment: any) => ({
      id: payment.id,
      type: payment.type,
      amount: payment.amount,
      asset: payment.asset_type === 'native' ? 'XLM' : payment.asset_code,
      from: payment.from,
      to: payment.to,
      createdAt: payment.created_at,
      hash: payment.transaction_hash,
    }))
  } catch {
    return []
  }
}

// ✅ Export singleton instance for Level 1 components (BalanceDisplay, PaymentForm, etc.)
// Lazy initialized - only created when first accessed in browser
let _stellar: StellarHelper | null = null

export function getStellar(): StellarHelper {
  if (!_stellar) {
    _stellar = new StellarHelper()
  }
  return _stellar
}

// Create a lazy proxy so components can do "import { stellar }" without SSR issues
export const stellar = new Proxy(
  {},
  {
    get(_, prop: string | symbol) {
      return (getStellar() as any)[prop]
    },
  }
) as any

export { getKit }