import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from '@/store/useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state before each test
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.endSession()
    })
  })

  it('initializes with default UA language', () => {
    const { result } = renderHook(() => useAppStore())
    expect(result.current.language).toBe('UA')
  })

  it('updates language correctly', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setLanguage('DE')
    })
    expect(result.current.language).toBe('DE')
  })

  // Booking Flow
  it('updates booking category and resets service/master', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setCategory('hair', 'Hair Styling')
    })
    expect(result.current.selectedCategorySlug).toBe('hair')
    expect(result.current.selectedCategoryName).toBe('Hair Styling')
    expect(result.current.selectedService).toBeNull()
    expect(result.current.selectedMaster).toBeNull()
  })

  it('updates service and resets master', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setService('haircut-female')
    })
    expect(result.current.selectedService).toBe('haircut-female')
    expect(result.current.selectedMaster).toBeNull()
  })

  it('updates master', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setMaster('anna')
    })
    expect(result.current.selectedMaster).toBe('anna')
  })

  it('clears booking details', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setCategory('hair', 'Hair Styling')
      result.current.setService('cut')
      result.current.setMaster('anna')
      result.current.clearBooking()
    })
    expect(result.current.selectedCategorySlug).toBeNull()
    expect(result.current.selectedService).toBeNull()
    expect(result.current.selectedMaster).toBeNull()
  })

  // Cart
  it('adds an item to cart', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
    })
    expect(result.current.cart.length).toBe(1)
    expect(result.current.cart[0]).toEqual({
      id: 'drink-1',
      name: 'Coffee',
      price: 4.5,
      quantity: 1,
    })
  })

  it('increments quantity if item already exists in cart', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
    })
    expect(result.current.cart.length).toBe(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('removes an item from cart', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.removeFromCart('drink-1')
    })
    expect(result.current.cart.length).toBe(0)
  })

  it('updates quantity of an item', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.updateQuantity('drink-1', 5)
    })
    expect(result.current.cart[0].quantity).toBe(5)
  })

  it('removes item if quantity is updated to 0', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.updateQuantity('drink-1', 0)
    })
    expect(result.current.cart.length).toBe(0)
  })

  it('clears cart entirely', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.addToCart({ id: 'drink-2', name: 'Water', price: 2.5 })
      result.current.clearCart()
    })
    expect(result.current.cart.length).toBe(0)
  })

  // End Session
  it('resets all booking and cart data on endSession', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setLanguage('GB')
      result.current.setCategory('hair', 'Hair')
      result.current.addToCart({ id: 'drink-1', name: 'Coffee', price: 4.5 })
      result.current.endSession()
    })
    
    expect(result.current.language).toBe('UA') // Should reset lang to default
    expect(result.current.selectedCategorySlug).toBeNull()
    expect(result.current.cart).toEqual([])
  })
})
