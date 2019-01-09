import React, { Component } from 'react';

import classify from 'parentSrc/classify';
import defaultClasses from './topbar.scss';
import {shape, string} from "prop-types";

class TopBar extends Component {
    static propTypes = {
        classes: shape({
            root: string
        })
    };

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>
                A custom react component on top of venia-concept
            </div>
        );
    }
}

export default classify(defaultClasses)(TopBar);
