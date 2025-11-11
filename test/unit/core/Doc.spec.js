import { describe, it, expect } from 'vitest'
import { Doc } from '../../../core/Doc.js'

describe('Doc', () => {
  it('returns source and empty highlight/explain by default', () => {
    const d = new Doc({ source: { title: 'Moby' } })
    expect(d.source()).toEqual({ title: 'Moby' })
    expect(d.highlight('1', 'title', '<b>', '</b>')).toEqual('')
    expect(() => d.explain('1')).toThrow(/NotSupported/)
  })

  it('returns source data when provided', () => {
    const sourceData = { id: '1', title: 'Moby Dick', author: 'Herman Melville' }
    const d = new Doc({ source: sourceData })
    expect(d.source()).toEqual(sourceData)
  })

  it('returns empty string for highlight when not present', () => {
    const d = new Doc({ source: { title: 'Moby' } })
    expect(d.highlight('1', 'title', '<b>', '</b>')).toEqual('')
  })

  it('returns highlighted text when present', () => {
    const d = new Doc({
      source: { title: 'Moby' },
      highlight: {
        '1': {
          title: ['Moby <b>Dick</b>']
        }
      }
    })
    expect(d.highlight('1', 'title', '<b>', '</b>')).toEqual('Moby <b>Dick</b>')
  })

  it('returns highlighted text with multiple fragments', () => {
    const d = new Doc({
      source: { title: 'Moby' },
      highlight: {
        '1': {
          title: ['Moby', 'Dick']
        }
      }
    })
    expect(d.highlight('1', 'title', '<b>', '</b>')).toEqual('<b>Moby</b> <b>Dick</b>')
  })

  it('returns explain data when present', () => {
    const explainData = { raw: 'some explanation data' }
    const d = new Doc({
      source: { title: 'Moby' },
      explain: {
        '1': explainData
      }
    })
    expect(d.explain('1')).toEqual(explainData)
  })

  it('throws NotSupported error when explain not present', () => {
    const d = new Doc({ source: { title: 'Moby' } })
    expect(() => d.explain('1')).toThrow('NotSupported')
  })
})
