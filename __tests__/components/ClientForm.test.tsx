import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ClientForm from '@/components/ClientForm'

describe('ClientForm', () => {
  it('renders "Add New Client" when no initial data is provided', () => {
    render(<ClientForm onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Add New Client')).toBeInTheDocument()
  })

  it('renders "Edit Client" when initial data is provided', () => {
    const initialData = { name: 'John Doe', email: 'john@example.com', phone: '1234567890' }
    render(<ClientForm initialData={initialData} onSave={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Edit Client')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument()
  })

  it('calls onSave with correct data when form is submitted', () => {
    const handleSave = vi.fn()
    render(<ClientForm onSave={handleSave} onCancel={vi.fn()} />)
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0987654321' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Save Client/i }))
    
    expect(handleSave).toHaveBeenCalledTimes(1)
    expect(handleSave).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '0987654321'
    })
  })

  it('calls onCancel when Cancel button is clicked', () => {
    const handleCancel = vi.fn()
    render(<ClientForm onSave={vi.fn()} onCancel={handleCancel} />)
    
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })
})
