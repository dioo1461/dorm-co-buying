import React from 'react'
import 'react-native'
import { render, fireEvent } from '@testing-library/react-native'
import Home from 'screens/Home'

describe('Home', () => {
    it('renders screen Home', () => {
        const screen = render(<Home />)
        const json = screen.toJSON()
        expect(json).toMatchSnapshot()
    })

    it('displays title properly', () => {
        const screen = render(<Home/>)
        const title = screen.getByText('home')
    })
})
