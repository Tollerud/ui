import { describe, expect, it, vi, afterEach } from 'vitest'
import { dropdownPlacementClasses, getDropdownPlacement, getFloatingDropdownCoords } from './dropdown-placement'

function mockRect(top: number, height: number): DOMRect {
  const bottom = top + height
  return {
    top,
    bottom,
    left: 0,
    right: 100,
    width: 100,
    height,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect
}

describe('getDropdownPlacement', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('opens downward when there is room below', () => {
    const anchor = document.createElement('div')
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(mockRect(100, 32))
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    expect(getDropdownPlacement(anchor, null, { maxHeight: 200 })).toBe('bottom')
  })

  it('opens upward when space below is tight and space above is larger', () => {
    const anchor = document.createElement('div')
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(mockRect(760, 32))
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    expect(getDropdownPlacement(anchor, null, { maxHeight: 200 })).toBe('top')
  })

  it('prefers the side with more space when neither fits fully', () => {
    const anchor = document.createElement('div')
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(mockRect(360, 32))
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    expect(getDropdownPlacement(anchor, null, { maxHeight: 500 })).toBe('bottom')
  })
})

describe('dropdownPlacementClasses', () => {
  it('maps placement to tailwind anchor utilities', () => {
    expect(dropdownPlacementClasses('bottom')).toContain('top-full')
    expect(dropdownPlacementClasses('top')).toContain('bottom-full')
  })
})

describe('getFloatingDropdownCoords', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('positions below the anchor when opening downward', () => {
    const anchor = document.createElement('div')
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(mockRect(100, 32))
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    const coords = getFloatingDropdownCoords(anchor, null, { maxHeight: 200 })
    expect(coords.placement).toBe('bottom')
    expect(coords.top).toBe(136)
    expect(coords.left).toBe(0)
    expect(coords.width).toBe(100)
  })

  it('positions above the anchor when opening upward', () => {
    const anchor = document.createElement('div')
    vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(mockRect(760, 32))
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    const coords = getFloatingDropdownCoords(anchor, null, { maxHeight: 200 })
    expect(coords.placement).toBe('top')
    expect(coords.top).toBe(556)
  })
})
