import { useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useChartInteraction } from './chart-interaction'

function Probe({ count = 5, onEscape }: { count?: number; onEscape?: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const { activeIndex, isKeyboard, svgProps } = useChartInteraction({
    svgRef,
    count,
    paddingLeft: 0,
    paddingRight: 0,
    onEscape,
  })
  return (
    <div>
      <svg ref={svgRef} data-testid="svg" role="img" aria-label="probe" {...svgProps} />
      <output data-testid="state">{`${activeIndex}|${isKeyboard}`}</output>
    </div>
  )
}

const state = () => screen.getByTestId('state').textContent

describe('useChartInteraction', () => {
  it('selects the latest point on keyboard focus and clears on blur', () => {
    render(<Probe count={5} />)
    const svg = screen.getByTestId('svg')

    expect(state()).toBe('null|false')
    fireEvent.focus(svg)
    expect(state()).toBe('4|true')
    fireEvent.blur(svg)
    expect(state()).toBe('null|false')
  })

  it('does not jump to the latest point when focus comes from a pointer press', () => {
    render(<Probe count={5} />)
    const svg = screen.getByTestId('svg')

    fireEvent.pointerDown(svg)
    fireEvent.focus(svg)
    expect(state()).toBe('null|false')
  })

  it('steps with arrows and jumps with Home/End, clamped to the data', () => {
    render(<Probe count={3} />)
    const svg = screen.getByTestId('svg')
    fireEvent.focus(svg)
    expect(state()).toBe('2|true')

    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(state()).toBe('1|true')
    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    fireEvent.keyDown(svg, { key: 'ArrowLeft' })
    expect(state()).toBe('0|true')

    fireEvent.keyDown(svg, { key: 'End' })
    expect(state()).toBe('2|true')
    fireEvent.keyDown(svg, { key: 'ArrowRight' })
    expect(state()).toBe('2|true')
    fireEvent.keyDown(svg, { key: 'Home' })
    expect(state()).toBe('0|true')
  })

  it('Escape clears the active point and stops propagating only while active', () => {
    const onEscape = vi.fn()
    const outerKeyDown = vi.fn()
    render(
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- test probe for event propagation
      <div onKeyDown={outerKeyDown}>
        <Probe count={3} onEscape={onEscape} />
      </div>
    )
    const svg = screen.getByTestId('svg')
    fireEvent.focus(svg)
    expect(state()).toBe('2|true')

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(state()).toBe('null|false')
    expect(onEscape).toHaveBeenCalledTimes(1)
    expect(outerKeyDown).not.toHaveBeenCalled()

    fireEvent.keyDown(svg, { key: 'Escape' })
    expect(outerKeyDown).toHaveBeenCalledTimes(1)
  })

  it('tracks pointer position and marks the interaction as non-keyboard', () => {
    render(<Probe count={4} />)
    const svg = screen.getByTestId('svg')
    vi.spyOn(svg, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 400,
      top: 0,
      height: 100,
      right: 400,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)

    fireEvent.mouseMove(svg, { clientX: 0 })
    expect(state()).toBe('0|false')
    fireEvent.mouseMove(svg, { clientX: 399 })
    expect(state()).toBe('3|false')
    fireEvent.mouseLeave(svg)
    expect(state()).toBe('null|false')
  })

  it('clamps the active index when the point count shrinks', () => {
    const { rerender } = render(<Probe count={5} />)
    const svg = screen.getByTestId('svg')
    fireEvent.focus(svg)
    expect(state()).toBe('4|true')

    rerender(<Probe count={2} />)
    expect(state()).toBe('1|true')
  })
})
