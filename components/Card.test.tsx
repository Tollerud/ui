import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardChange,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card'

describe('Card', () => {
  it('renders children with accent border when accent is set', () => {
    render(<Card accent>Content</Card>)
    expect(screen.getByText('Content')).toHaveClass('border-tollerud-yellow/25')
  })

  it('sets data-density when density prop is provided', () => {
    render(
      <Card density="compact" data-testid="card">
        Dense
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveAttribute('data-density', 'compact')
  })

  it('keeps default padding for unstructured cards', () => {
    render(
      <Card data-testid="card">
        Body
      </Card>
    )
    expect(screen.getByTestId('card')).toHaveClass('p-6')
    expect(screen.getByTestId('card')).not.toHaveClass('p-0')
  })

  it('removes shell padding and styles header/footer bands for structured cards', () => {
    render(
      <Card data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Deploy</CardTitle>
          <CardDescription>emma.tollerud.no</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter data-testid="footer">Actions</CardFooter>
      </Card>
    )

    expect(screen.getByTestId('card')).toHaveClass('p-0')
    expect(screen.getByTestId('header').className).toMatch(/color-mix/)
    expect(screen.getByTestId('footer').className).toMatch(/color-mix/)
    expect(screen.getByTestId('header').className).not.toMatch(/noir-950/)
    expect(screen.getByRole('heading', { name: 'Deploy' })).toBeInTheDocument()
    expect(screen.getByText('emma.tollerud.no')).toBeInTheDocument()
  })

  it('keeps raised surface background on structured card content', () => {
    render(
      <Card data-testid="card">
        <CardHeader>Header</CardHeader>
        <CardContent data-testid="content">Body</CardContent>
      </Card>,
    )

    expect(screen.getByTestId('card')).toHaveClass('bg-tollerud-surface-raised')
    expect(screen.getByTestId('content')).toHaveClass('bg-tollerud-surface-raised')
  })

  it('renders CardHeader actions with CardChange', () => {
    render(
      <Card>
        <CardHeader actions={<CardChange value="+12%" direction="up" />}>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Last 24h</CardDescription>
        </CardHeader>
        <CardContent>42</CardContent>
      </Card>,
    )

    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('+12%')).toHaveClass('text-tollerud-success')
  })

  it('tints header bands when accent is border-only', () => {
    render(
      <Card accent data-testid="card">
        <CardHeader data-testid="header">
          <CardTitle>Highlighted</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )

    expect(screen.getByTestId('card')).toHaveAttribute('data-accent', 'accent')
    expect(screen.getByTestId('header').className).toMatch(/tollerud-yellow/)
  })
})
