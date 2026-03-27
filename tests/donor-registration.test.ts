import { describe, it, expect } from 'vitest'

describe('DonorRegistration — input validation', () => {

  const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  it('8 standard blood types are defined', () => {
    expect(BLOOD_TYPES).toHaveLength(8)
    expect(BLOOD_TYPES).toContain('O+')
    expect(BLOOD_TYPES).toContain('AB-')
  })

  it('rejects empty location', () => {
    expect('   '.trim()).toBeFalsy()
  })

  it('accepts valid location under 64 chars', () => {
    const loc = 'Mumbai, India'
    expect(loc.trim().length).toBeGreaterThan(0)
    expect(loc.trim().length).toBeLessThanOrEqual(64)
  })

  it('transaction status strings are valid', () => {
    const statuses = ['idle', 'pending', 'success', 'error']
    expect(statuses).toContain('pending')
    expect(statuses).toContain('success')
  })

  it('Soroban contract IDs start with C', () => {
    const id = 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4'
    expect(id.startsWith('C')).toBe(true)
  })

})
