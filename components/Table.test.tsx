import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table'

describe('Table', () => {
  it('renders a semantic table with header and body rows', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ingrediens</TableHead>
            <TableHead align="right">For 8</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Laks, filet</TableCell>
            <TableCell align="right">3,2 kg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Ingrediens')).toBeInTheDocument()
    expect(screen.getByText('3,2 kg')).toBeInTheDocument()
  })

  it('applies tone color to a cell', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell tone="accent">5,6 kg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('5,6 kg')).toHaveClass('text-tollerud-yellow')
  })

  it('applies highlight tint to a row', () => {
    render(
      <Table>
        <TableBody>
          <TableRow highlight data-testid="row">
            <TableCell>Grillet laks med sitron</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByTestId('row')).toHaveClass('bg-tollerud-yellow/[0.03]')
  })

  it('renders a caption', () => {
    render(
      <Table>
        <TableCaption>Skalert for 14 gjester</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Sitron</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Skalert for 14 gjester')).toBeInTheDocument()
  })
})
