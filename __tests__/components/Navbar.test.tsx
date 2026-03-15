import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Navbar from '@/components/Navbar'

describe('Navbar', () => {
  it('renders standard navigation links correctly', () => {
    render(<Navbar />)
    
    expect(screen.getByText('SALON')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Clients' })).toHaveAttribute('href', '/clients')
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Book Now' })).toHaveAttribute('href', '/booking')
  })
})
