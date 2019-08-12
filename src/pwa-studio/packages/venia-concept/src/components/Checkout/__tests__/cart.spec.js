import React from 'react';
import testRenderer from 'react-test-renderer';
import Cart from '../cart';

jest.mock('../../../classify');

test('renders a Cart component', () => {
    const props = {
        beginCheckout: jest.fn(),
        ready: true,
        submitting: false
    };
    const component = testRenderer.create(<Cart {...props} />);
    expect(component.toJSON()).toMatchSnapshot();
});
