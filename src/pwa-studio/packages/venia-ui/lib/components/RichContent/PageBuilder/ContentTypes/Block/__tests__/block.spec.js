import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Block from '../block';
import * as config from '../../../config';

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(src => src),
    withRouter: jest.fn(arg => arg)
}));

jest.mock('../../../../../../classify');

test('renders a Block component', () => {
    const blockProps = {
        richContent: ''
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a Block component with all props configured and Page Builder rich content', () => {
    const MockRow = () => 'Row';
    config.default = jest.fn().mockImplementation(contentType => {
        if (contentType === 'row') {
            return {
                configAggregator: () => {},
                component: MockRow
            };
        }
    });

    const blockProps = {
        richContent:
            '<div data-content-type="row" data-appearance="contained" data-element="main"><div data-enable-parallax="0" data-parallax-speed="0.5" data-background-images="{}" data-element="inner" style="justify-content: flex-start; display: flex; flex-direction: column; background-position: left top; background-size: cover; background-repeat: no-repeat; background-attachment: scroll; border-style: solid; border-color: rgb(255, 0, 0); border-width: 5px; border-radius: 2px; margin: 0px 0px 10px; padding: 10px;"></div></div>',
        textAlign: 'right',
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '15px',
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.root.findByType(MockRow)).toBeTruthy();
});

test('renders a Block component with HTML content', () => {
    const blockProps = {
        richContent: '<h1>Testing HTML content</h1>'
    };
    const component = createTestInstance(<Block {...blockProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
