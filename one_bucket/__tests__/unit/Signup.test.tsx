import React from 'react';
import 'react-native';
import {render, fireEvent} from '@testing-library/react-native';
import Signup from 'screens/Login';

describe('Signup', () => {
    it('renders screen Signup', () => {
        const screen = render(<Signup />);
        const json = screen.toJSON();
        expect(json).toMatchSnapshot();
    });

    it('displays title properly', () => {
        const screen = render(<Signup />);
        const title = screen.getByText('Signup');
    });
});
