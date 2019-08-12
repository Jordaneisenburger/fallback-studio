import React, { Component } from 'react';
import { shape, string } from 'prop-types';

import Icon from '../../Icon';
import { Filter as FilterIcon } from 'react-feather';
import classify from '../../../classify';
import defaultClasses from './filter.css';

const FILTER_ICON_ATTRS = {
    width: 16,
    color: 'rgb(0, 134, 138)'
};

class Filter extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            filterIconContainer: string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.filterIconContainer}>
                    <Icon src={FilterIcon} attrs={FILTER_ICON_ATTRS} />
                </div>
                <span>Filter by...</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(Filter);
