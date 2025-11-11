import { describe, it, expect } from 'vitest'
import { createSearcher } from '../../api/index.js'

describe('createSearcher', () => {
  it('exists and is a function', () => {
    expect(createSearcher).toBeTypeOf('function')
  })

  it('throws error when not implemented', () => {
    expect(() => createSearcher([], '', {})).toThrow('createSearcher not implemented yet')
  })
})
