// lib/contract-helper.ts
import * as StellarSdk from '@stellar/stellar-sdk'

// ─── CONFIG ─────────────────────────────────────────────────
// Update this with your deployed contract ID after: stellar contract deploy ...
export const CONTRACT_ID = 'CCCCFK4TVKDTPKLLMLI2I4BDHWYNCKTWXIU3UJ2JIFXVXZAK4CX66RQD'
export const TESTNET_RPC = 'https://soroban-testnet.stellar.org'
export const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET

// ─── TYPES ──────────────────────────────────────────────────
export interface DonorRecord {
  address: string
  blood_type: string
  location: string
  registered_at: number
  is_available: boolean
}

export type TxStatus = 'idle' | 'pending' | 'success' | 'error'

export interface ContractCallResult<T> {
  status: 'ok' | 'error'
  data?: T
  txHash?: string
  error?: string
  errorType?: 'wallet_not_found' | 'user_rejected' | 'insufficient_balance' | 'unknown'
}

// ─── SOROBAN SERVER ──────────────────────────────────────────
function getServer() {
  return new StellarSdk.SorobanRpc.Server(TESTNET_RPC)
}

// ─── ERROR CLASSIFIER ───────────────────────────────────────
export function classifyError(err: unknown): ContractCallResult<never> {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase()

  if (
    msg.includes('no freighter') ||
    msg.includes('not found') ||
    msg.includes('wallet not installed') ||
    msg.includes('is not defined')
  ) {
    return {
      status: 'error',
      error: 'Wallet not found. Please install Freighter or another Stellar wallet.',
      errorType: 'wallet_not_found',
    }
  }

  if (
    msg.includes('user declined') ||
    msg.includes('rejected') ||
    msg.includes('user rejected') ||
    msg.includes('cancelled')
  ) {
    return {
      status: 'error',
      error: 'Transaction rejected by user.',
      errorType: 'user_rejected',
    }
  }

  if (
    msg.includes('insufficient') ||
    msg.includes('balance') ||
    msg.includes('underfunded')
  ) {
    return {
      status: 'error',
      error: 'Insufficient XLM balance. You need at least 1 XLM to call a contract.',
      errorType: 'insufficient_balance',
    }
  }

  // Handle wallet communication errors
  if (
    msg.includes('timeout') ||
    msg.includes('channel closed') ||
    msg.includes('message channel closed') ||
    msg.includes('connection interrupted') ||
    msg.includes('wallet connection interrupted')
  ) {
    return {
      status: 'error',
      error: 'Wallet communication timeout. Ensure Freighter is open and try again.',
      errorType: 'wallet_not_found',
    }
  }

  return {
    status: 'error',
    error: err instanceof Error ? err.message : 'An unknown error occurred.',
    errorType: 'unknown',
  }
}

// ─── REGISTER DONOR ─────────────────────────────────────────
export async function registerDonor(
  publicKey: string,
  bloodType: string,
  location: string,
  signTransaction: (xdr: string, opts: { networkPassphrase: string }) => Promise<{ signedTxXdr: string }>
): Promise<ContractCallResult<string>> {
  try {
    const server = getServer()
    const account = await server.getAccount(publicKey)

    const contract = new StellarSdk.Contract(CONTRACT_ID)

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '200000',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'register_donor',
          StellarSdk.Address.fromString(publicKey).toScVal(),
          StellarSdk.xdr.ScVal.scvString(bloodType),
          StellarSdk.xdr.ScVal.scvString(location),
        )
      )
      .setTimeout(30)
      .build()

    const simResult = await server.simulateTransaction(tx)
    if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
      throw new Error(`Simulation failed: ${simResult.error}`)
    }

    const preparedTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simResult).build()

    // Sign with timeout and error handling for wallet communication
    let signedTxXdr: string
    try {
      const signResult = await Promise.race([
        signTransaction(preparedTx.toXDR(), {
          networkPassphrase: NETWORK_PASSPHRASE,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Wallet signing timeout - please try again')), 45000)
        ),
      ]) as { signedTxXdr: string }
      signedTxXdr = signResult.signedTxXdr
    } catch (signErr: any) {
      const msg = (signErr?.message ?? String(signErr)).toLowerCase()
      if (msg.includes('timeout') || msg.includes('closed') || msg.includes('channel')) {
        throw new Error('Wallet connection interrupted. Please ensure Freighter is open and try again.')
      }
      throw signErr
    }

    const submitResult = await server.sendTransaction(
      StellarSdk.TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE)
    )

    if (submitResult.status === 'ERROR') {
      throw new Error(`Submit error: ${submitResult.errorResult?.toXDR('base64')}`)
    }

    const txHash = submitResult.hash
    let getResult = await server.getTransaction(txHash)
    let attempts = 0

    while (
      getResult.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.NOT_FOUND &&
      attempts < 20
    ) {
      await new Promise(r => setTimeout(r, 1500))
      getResult = await server.getTransaction(txHash)
      attempts++
    }

    if (getResult.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      return { status: 'ok', data: txHash, txHash }
    } else {
      throw new Error(`Transaction failed: ${getResult.status}`)
    }

  } catch (err) {
    return classifyError(err)
  }
}

// ─── GET DONOR (read-only) ───────────────────────────────────
export async function getDonor(address: string): Promise<ContractCallResult<DonorRecord | null>> {
  try {
    const server = getServer()
    const randomKeypair = StellarSdk.Keypair.random()
    const account = new StellarSdk.Account(randomKeypair.publicKey(), '0')

    const contract = new StellarSdk.Contract(CONTRACT_ID)

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'get_donor',
          StellarSdk.Address.fromString(address).toScVal(),
        )
      )
      .setTimeout(30)
      .build()

    const simResult = await server.simulateTransaction(tx)

    if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
      return { status: 'ok', data: null }
    }

    const returnVal = (simResult as StellarSdk.SorobanRpc.Api.SimulateTransactionSuccessResponse).result?.retval
    if (!returnVal) return { status: 'ok', data: null }

    const donor = parseDonorRecord(returnVal)
    return { status: 'ok', data: donor }

  } catch (err) {
    return classifyError(err)
  }
}

// ─── GET DONOR COUNT (read-only) ────────────────────────────
export async function getDonorCount(): Promise<ContractCallResult<number>> {
  try {
    const server = getServer()
    const randomKeypair = StellarSdk.Keypair.random()
    const account = new StellarSdk.Account(randomKeypair.publicKey(), '0')

    const contract = new StellarSdk.Contract(CONTRACT_ID)

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(contract.call('get_donor_count'))
      .setTimeout(30)
      .build()

    const simResult = await server.simulateTransaction(tx)

    if (StellarSdk.SorobanRpc.Api.isSimulationError(simResult)) {
      return { status: 'ok', data: 0 }
    }

    const retval = (simResult as StellarSdk.SorobanRpc.Api.SimulateTransactionSuccessResponse).result?.retval
    const count = retval ? parseU32(retval) : 0
    return { status: 'ok', data: count }

  } catch (err) {
    return classifyError(err)
  }
}

// ─── HELPERS ─────────────────────────────────────────────────

function parseU32(val: StellarSdk.xdr.ScVal): number {
  try { return val.u32() } catch { return 0 }
}

function parseStr(val: StellarSdk.xdr.ScVal): string {
  try { return val.str().toString() } catch {
    try { return Buffer.from(val.bytes()).toString('utf-8') } catch { return '' }
  }
}

function parseDonorRecord(val: StellarSdk.xdr.ScVal): DonorRecord | null {
  try {
    if (val.switch() === StellarSdk.xdr.ScValType.scvVoid()) return null
    const map = val.map()
    if (!map) return null

    const get = (key: string) => {
      const entry = map.find(e => {
        try { return e.key().sym().toString() === key } catch { return false }
      })
      return entry ? entry.val() : null
    }

    return {
      address: (() => { try { return StellarSdk.Address.fromScVal(get('address')!).toString() } catch { return '' } })(),
      blood_type: get('blood_type') ? parseStr(get('blood_type')!) : '',
      location: get('location') ? parseStr(get('location')!) : '',
      registered_at: (() => { try { return Number(get('registered_at')!.u64().toString()) } catch { return 0 } })(),
      is_available: (() => { try { const scVal = get('is_available')!; return (scVal as any).b?.toString() === 'true' } catch { return false } })(),
    }
  } catch { return null }
}

// ─── EXPLORER LINKS ──────────────────────────────────────────
export function getContractExplorerLink(contractId: string) {
  return `https://stellar.expert/explorer/testnet/contract/${contractId}`
}

export function getTxExplorerLink(txHash: string) {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`
}
