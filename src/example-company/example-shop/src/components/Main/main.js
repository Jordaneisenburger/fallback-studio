import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import Footer from 'src/components/Footer';

import Header from 'parentComponents/Header';
import TopBar from 'src/components/TopBar';
import defaultClasses from 'parentComponents/Main/main.css';

const Main = props => {
    const { children, hasBeenOffline, isMasked, isOnline } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;

    useScrollLock(isMasked);

    return (
        <main className={rootClass}>
            <TopBar />
            <Header hasBeenOffline={hasBeenOffline} isOnline={isOnline} />
            <div className={pageClass}>{children}</div>
            <Footer />
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    hasBeenOffline: bool,
    isMasked: bool,
    isOnline: bool
};
