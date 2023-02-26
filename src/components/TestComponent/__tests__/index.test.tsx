import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

import { TestComponent } from '../Test'

describe('Home', () => {
  it('renders a heading', () => {
    render(<TestComponent />)

    const heading = screen.getByText('Test')

    expect(heading)
  })
})
