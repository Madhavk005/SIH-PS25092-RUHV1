import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SOSButton } from './sos-button'

// Mock the dialog component
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => open ? <div data-testid="sos-dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: any) => <div data-testid="dialog-description">{children}</div>,
}))

// Mock the card component
jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: any) => <div data-testid="card-title">{children}</div>,
}))

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})

describe('SOSButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock successful geolocation
    mockGeolocation.getCurrentPosition.mockImplementation((success) =>
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
        },
      })
    )
  })

  it('renders SOS button with correct text', () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    expect(button).toBeInTheDocument()
  })

  it('renders floating variant correctly', () => {
    render(<SOSButton variant="floating" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6')
    expect(button).toHaveClass('animate-pulse')
  })

  it('renders header variant correctly', () => {
    render(<SOSButton variant="header" />)

    const button = screen.getByRole('button', { name: /sos/i })
    expect(button).toHaveClass('text-red-600')
  })

  it('opens SOS dialog when clicked', async () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText('Emergency SOS')).toBeInTheDocument()
    })
  })

  it('shows countdown before sending SOS', async () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Emergency SOS')).toBeInTheDocument()
    })

    // Check countdown text
    await waitFor(() => {
      expect(screen.getByText(/Sending SOS in 3 seconds/i)).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/Sending SOS in 2 seconds/i)).toBeInTheDocument()
    })
  })

  it('sends SOS after countdown', async () => {
    // Mock window.location.href
    const originalLocation = window.location
    delete (window as any).location
    ;(window as any).location = { href: '' }

    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/SOS alert has been sent/i)).toBeInTheDocument()
    })

    expect(window.location.href).toBe('tel:911')

    // Restore original location
    ;(window as any).location = originalLocation
  })

  it('displays location information in dialog', async () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Emergency SOS')).toBeInTheDocument()
    })

    // Wait for countdown to finish and location info to appear
    await waitFor(() => {
      expect(screen.getByText(/Your Location/i)).toBeInTheDocument()
    })

    // Check location information
    expect(screen.getByText(/Lat: 40.7128, Lng: -74.0060/i)).toBeInTheDocument()
  })

  it('displays emergency numbers in dialog', async () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Emergency SOS')).toBeInTheDocument()
    })

    // Wait for countdown to finish and emergency numbers to appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /police/i })).toBeInTheDocument()
    })

    // Check for emergency service buttons
    expect(screen.getByRole('button', { name: /police/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fire/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /medical/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /poison control/i })).toBeInTheDocument()
  })

  it('can cancel SOS before countdown finishes', async () => {
    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByText('Emergency SOS')).toBeInTheDocument()
    })

    // Cancel by closing the dialog
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)

    // Dialog should be closed
    await waitFor(() => {
      expect(screen.queryByText('Emergency SOS')).not.toBeInTheDocument()
    })
  })

  it('handles geolocation errors gracefully', () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) =>
      error({ message: 'Location not available' })
    )

    render(<SOSButton />)

    const button = screen.getByRole('button', { name: /emergency sos/i })
    fireEvent.click(button)

    // Should still work even without location
    expect(button).toBeInTheDocument()
  })
})
