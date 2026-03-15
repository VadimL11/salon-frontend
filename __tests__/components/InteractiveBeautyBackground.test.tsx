import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import InteractiveBeautyBackground from '@/components/ui/InteractiveBeautyBackground'

describe('InteractiveBeautyBackground', () => {
  it('renders without crashing even with complex DOM logic and matchMedia dependencies', () => {
    // Relies on vitest.setup.ts mocking matchMedia
    const { container } = render(<InteractiveBeautyBackground />)
    
    // We expect the DOM elements responsible for particles and icons to exist
    // Even though they are deeply nested in framer-motion markup.
    expect(container).toBeTruthy()
    
    // Verify our container div structure
    const particleContainer = container.querySelector('div')
    expect(particleContainer).toBeInTheDocument()
  })
})
