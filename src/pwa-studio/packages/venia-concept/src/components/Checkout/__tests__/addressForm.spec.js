import React from 'react';
import testRenderer from 'react-test-renderer';
import AddressForm from '../addressForm';

jest.mock('../../../classify');

const mockCancel = jest.fn();
const mockSubmit = jest.fn();
const defaultProps = {
    cancel: mockCancel,
    submit: mockSubmit
};

beforeEach(() => {
    mockCancel.mockReset();
    mockSubmit.mockReset();
});

test('renders an AddressForm component', () => {
    const component = testRenderer.create(<AddressForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders validation block with message if address is incorrect', () => {
    const props = {
        ...defaultProps,
        isAddressInvalid: true,
        invalidAddressMessage: 'whoops'
    };
    const component = testRenderer.create(<AddressForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('does not renders validation block with message if address is incorrect but no incorrect address message', () => {
    const props = {
        ...defaultProps,
        isAddressInvalid: true
    };
    const component = testRenderer.create(<AddressForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('cancel instance function calls props cancel function', () => {
    const { root } = testRenderer.create(<AddressForm {...defaultProps} />);

    const button = root.findAllByProps({ className: 'button' })[0];
    button.props.onClick();
    expect(mockCancel).toHaveBeenCalled();
});
