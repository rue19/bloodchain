import { describe, it, expect } from 'vitest'
import {
  CONTRACT_ID,
  TESTNET_RPC,
  NETWORK_PASSPHRASE,
  getContractExplorerLink,
  getTxExplorerLink,
} from '@/lib/contract-helper'

describe('contract-helper — config and utilities', () => {

  it('CONTRACT_ID is set (not the placeholder)', () => {
    expect(CONTRACT_ID).toBeTruthy()
    expect(CONTRACT_ID).not.toBe('PASTE_YOUR_CONTRACT_ID_HERE')
  })

  it('TESTNET_RPC points to Soroban testnet', () => {
    expect(TESTNET_RPC).toContain('testnet')
    expect(TESTNET_RPC).toContain('soroban')
  })

  it('NETWORK_PASSPHRASE is Stellar testnet', () => {
    expect(NETWORK_PASSPHRASE).toContain('Test SDF Network')
  })

  it('getContractExplorerLink generates correct URL', () => {
    const url = getContractExplorerLink('CXYZ')
    expect(url).toContain('testnet')
    expect(url).toContain('CXYZ')
    expect(url).toContain('stellar.expert')
  })

  it('getTxExplorerLink generates correct tx URL', () => {
    const url = getTxExplorerLink('abc123')
    expect(url).toContain('testnet')
    expect(url).toContain('/tx/')
    expect(url).toContain('abc123')
  })

})
