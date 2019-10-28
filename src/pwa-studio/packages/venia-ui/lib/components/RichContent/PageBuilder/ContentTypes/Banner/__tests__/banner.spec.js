import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Banner from '../banner';
import { act } from 'react-test-renderer';
import { Link } from '@magento/venia-drivers';

jest.mock('@magento/venia-drivers', () => ({
    resourceUrl: jest.fn(url => url),
    Link: jest.fn(() => null),
    withRouter: jest.fn(arg => arg)
}));

jest.mock('../../../../../../classify');

window.matchMedia = jest.fn().mockImplementation(() => {
    return {
        matches: false
    };
});

test('renders an empty Banner component', () => {
    const component = createTestInstance(<Banner />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a configured poster Banner component', () => {
    const bannerProps = {
        appearance: 'poster',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: true,
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'gear/bags.html',
        linkType: 'category',
        openInNewTab: true,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'always',
        showOverlay: 'hover',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a configured collage-left Banner component', () => {
    const bannerProps = {
        appearance: 'collage-left',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: false,
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'gear/bags.html',
        linkType: 'category',
        openInNewTab: false,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'hover',
        showOverlay: 'always',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a configured collage-left Banner component on mobile', () => {
    window.matchMedia = jest.fn().mockImplementation(() => {
        return {
            matches: true
        };
    });

    const bannerProps = {
        appearance: 'collage-left',
        backgroundColor: 'blue',
        backgroundAttachment: 'scroll',
        backgroundPosition: 'center center',
        backgroundRepeat: false,
        backgroundSize: 'cover',
        border: 'solid',
        borderColor: 'rgb(0,0,0)',
        borderRadius: '15px',
        borderWidth: '1px',
        buttonText: 'Shop Bags',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        cssClasses: [],
        desktopImage: 'desktop-image.jpg',
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: true,
        marginBottom: '1px',
        marginLeft: '2px',
        marginRight: '3px',
        marginTop: '4px',
        minHeight: '300px',
        mobileImage: 'mobile-image.jpg',
        overlayColor: 'rgb(0,0,0,0.5)',
        paddingBottom: '40px',
        paddingLeft: '40px',
        paddingRight: '40px',
        paddingTop: '40px',
        showButton: 'hover',
        showOverlay: 'never',
        textAlign: 'right'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('on hover displays button and overlay', () => {
    const bannerProps = {
        appearance: 'collage-left',
        buttonType: 'primary',
        content:
            '<h1><span style="color: #ffffff; background-color: #000000;">A new way of shopping</span></h1><p><span style="color: #ffffff; background-color: #000000;">Experience the best way of shopping today!</span></p>',
        link: 'https://www.adobe.com',
        linkType: 'default',
        openInNewTab: false,
        overlayColor: 'rgb(0,0,0,0.5)',
        showButton: 'hover',
        showOverlay: 'hover'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    act(() => {
        component.toTree().rendered.props.onMouseEnter();
    });
    expect(component.toJSON()).toMatchSnapshot();

    act(() => {
        component.toTree().rendered.props.onMouseLeave();
    });
    expect(component.toJSON()).toMatchSnapshot();
});

test('generates an internal <Link /> when URL is internal', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const bannerProps = {
        link: 'http://magento.com/test-product.html',
        linkType: 'product',
        openInNewTab: false,
        showButton: 'always',
        buttonText: 'Shop Bags',
        buttonType: 'primary'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    const button = component.root.findByType(Link);
    expect(button.props.to).toEqual('/test-product.html');
});

test('dragging is prevented on banner link', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const bannerProps = {
        link: 'http://magento.com/test-product.html',
        linkType: 'product',
        openInNewTab: false,
        showButton: 'always',
        buttonText: 'Shop Bags',
        buttonType: 'primary'
    };
    const component = createTestInstance(<Banner {...bannerProps} />);
    const button = component.root.findByType(Link);
    const event = {
        preventDefault: jest.fn()
    };
    button.props.onDragStart(event);
    expect(event.preventDefault).toHaveBeenCalled();
});
