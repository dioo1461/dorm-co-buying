import { render } from '@testing-library/react-native'
import React from 'react'
import 'react-native'
import Signup from 'screens/auth/Login'

describe('Signup', () => {
    it('renders screen Signup', () => {
        const screen = render(<Signup />)
        const json = screen.toJSON()
        expect(json).toMatchSnapshot()
    })

    it('displays title properly', () => {
        const screen = render(<Signup />)
        const title = screen.getByText('Signup')
    })
})
