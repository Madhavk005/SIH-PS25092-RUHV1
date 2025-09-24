import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from './header'

// Mock the session context
jest.mock('@/lib/contexts/session-context', () => ({
  useSession: jest.fn(() => ({
    isAuthenticated: false,
    logout: jest.fn(),
    user: null,
  })),
}))

// Mock the child components
jest.mock('./theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}))

jest.mock('@/components/auth/sign-in-button', () => ({
  SignInButton: () => <div data-testid="sign-in-button">Sign In</div>,
}))

jest.mock('@/components/safenet/sos-button', () => ({
  SOSButton: ({ variant }: { variant: string }) => (
    <div data-testid={`sos-button-${variant}`}>SOS Button</div>
  ),
}))

describe('Header', () => {
  it('renders the main header with logo and navigation', () => {
    render(<Header />)

    // Check logo and branding
    expect(screen.getByText('Ruh V1')).toBeInTheDocument()
    expect(screen.getByText('Your mental health Companion')).toBeInTheDocument()

    // Check navigation items
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('About Ruh V1')).toBeInTheDocument()
  })

  it('renders SOS button in header variant', () => {
    render(<Header />)

    expect(screen.getByTestId('sos-button-header')).toBeInTheDocument()
  })

  it('renders theme toggle', () => {
    render(<Header />)

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
  })

  it('shows sign in button when not authenticated', () => {
    render(<Header />)

    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
  })

  it('shows dashboard link and logout button when authenticated', () => {
    // Mock authenticated state
    const mockLogout = jest.fn()
    const mockUseSession = jest.fn(() => ({
      isAuthenticated: true,
      logout: mockLogout,
      user: { name: 'Test User' },
    }))

    // Update the mock
    const sessionContextMock = require('@/lib/contexts/session-context')
    sessionContextMock.useSession.mockImplementation(mockUseSession)

    render(<Header />)

    expect(screen.getByText('Start Chat')).toBeInTheDocument()
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: '' }) // Icon button
    expect(menuButton).toBeInTheDocument()

    // Menu should be closed initially - desktop nav visible
    expect(screen.getByText('Features')).toBeInTheDocument()

    // Click menu button
    fireEvent.click(menuButton)

    // Mobile menu should now be visible - look for mobile menu items
    // Target the mobile Features link specifically by its unique class
    const mobileFeaturesLink = document.querySelector('a[href="/features"].py-3')
    expect(mobileFeaturesLink).toBeInTheDocument()
  })

  it('closes mobile menu when navigation link is clicked', () => {
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: '' })
    fireEvent.click(menuButton)

    // Get the mobile menu Features link (the one in the mobile menu)
    const mobileFeaturesLink = document.querySelector('a[href="/features"].py-3')
    expect(mobileFeaturesLink).toBeInTheDocument()
    fireEvent.click(mobileFeaturesLink!)

    // Menu should close after navigation - check that menu button shows Menu icon again
    // This indicates the menu has been closed
    const menuIcon = document.querySelector('.lucide-menu')
    expect(menuIcon).toBeInTheDocument()
  })

  it('renders mobile start chat button when authenticated', () => {
    // Mock authenticated state
    const mockLogout = jest.fn()
    const mockUseSession = jest.fn(() => ({
      isAuthenticated: true,
      logout: mockLogout,
      user: { name: 'Test User' },
    }))

    // Update the mock
    const sessionContextMock = require('@/lib/contexts/session-context')
    sessionContextMock.useSession.mockImplementation(mockUseSession)

    render(<Header />)

    const menuButton = screen.getByRole('button', { name: '' })
    fireEvent.click(menuButton)

    // Look for the mobile Start Chat button specifically
    const startChatButtons = screen.getAllByText('Start Chat')
    const mobileStartChatButton = startChatButtons.find(button =>
      button.closest('.md\\:hidden') !== null
    )

    expect(mobileStartChatButton).toBeInTheDocument()
  })
})
