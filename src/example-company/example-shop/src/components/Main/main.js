import React, { Component } from 'react';
import { bool, shape, string } from 'prop-types';

import classify from 'src/classify';

//Uncomment to use venia-concept footer again
//import Footer from 'parentComponents/Footer';

import Footer from 'src/components/Footer';

import Header from 'parentComponents/Header';
import TopBar from 'src/components/TopBar';
import defaultClasses from 'parentComponents/Main/main.css';

class Main extends Component {
    static propTypes = {
        classes: shape({
            page: string,
            page_masked: string,
            root: string,
            root_masked: string
        }),
        isMasked: bool
    };

    get classes() {
        const { classes, isMasked } = this.props;
        const suffix = isMasked ? '_masked' : '';

        return ['page', 'root'].reduce(
            (acc, val) => ({ ...acc, [val]: classes[`${val}${suffix}`] }),
            {}
        );
    }

    render() {
        const { classes, props } = this;
        const { children } = props;

        return (
            <main className={classes.root}>
                <TopBar />
                <Header />
                <div className={classes.page}>{children}</div>
                <Footer />
            </main>
        );
    }
}

export default classify(defaultClasses)(Main);
