import { describe, it, expect } from 'vitest'
import { classifyError } from '@/lib/contract-helper'

describe('classifyError — 3 error types', () => {

  it('classifies wallet not found', () => {
    const result = classifyError(new Error('No Freighter extension found'))
    expect(result.status).toBe('error')
    expect(result.errorType).toBe('wallet_not_found')
  })

  it('classifies user rejected', () => {
    const result = classifyError(new Error('User rejected the transaction request'))
    expect(result.status).toBe('error')
    expect(result.errorType).toBe('user_rejected')
  })

  it('classifies insufficient balance', () => {
    const result = classifyError(new Error('Transaction failed: insufficient balance'))
    expect(result.status).toBe('error')
    expect(result.errorType).toBe('insufficient_balance')
  })

  it('classifies unknown errors', () => {
    const result = classifyError(new Error('Some random unexpected error xyz'))
    expect(result.errorType).toBe('unknown')
  })

  it('handles non-Error thrown strings', () => {
    const result = classifyError('rejected by wallet')
    expect(result.errorType).toBe('user_rejected')
  })

})
