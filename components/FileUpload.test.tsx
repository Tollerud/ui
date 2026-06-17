import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FileUpload } from './FileUpload'

describe('FileUpload', () => {
  it('renders label and file input', () => {
    render(<FileUpload label="Compose file" accept=".yml,.yaml" onFilesChange={vi.fn()} />)

    expect(screen.getByText('Compose file')).toBeInTheDocument()
    const input = screen.getByLabelText('Compose file')
    expect(input).toHaveAttribute('type', 'file')
  })

  it('renders custom drop zone labels for i18n', () => {
    render(
      <FileUpload
        clickLabel="Klikk for å laste opp"
        dragLabel="eller dra og slipp"
        onFilesChange={vi.fn()}
      />
    )

    expect(screen.getByText('Klikk for å laste opp')).toBeInTheDocument()
    expect(screen.getByText('eller dra og slipp')).toBeInTheDocument()
  })

  it('hides drag hint when dragLabel is empty', () => {
    render(<FileUpload clickLabel="Browse files" dragLabel="" onFilesChange={vi.fn()} />)

    expect(screen.getByText('Browse files')).toBeInTheDocument()
    expect(screen.queryByText(/drag and drop/i)).not.toBeInTheDocument()
  })
})
