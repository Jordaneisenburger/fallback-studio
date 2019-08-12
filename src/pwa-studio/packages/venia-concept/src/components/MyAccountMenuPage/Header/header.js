import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from '../../../classify';
import Trigger from '../../Trigger';
import Icon from '../../Icon';
import { X as CloseIcon } from 'react-feather';
import UserInformation from '../UserInformation';
import defaultClasses from './header.css';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            closeButton: PropTypes.string,
            header: PropTypes.string
        }),
        onClose: PropTypes.func,
        user: PropTypes.shape({
            email: PropTypes.string,
            firstname: PropTypes.string,
            lastname: PropTypes.string,
            fullname: PropTypes.string
        })
    };

    render() {
        const { user, onClose, classes } = this.props;

        return (
            <div className={classes.root}>
                <UserInformation user={user} />
                <Trigger
                    classes={{ root: classes.closeButton }}
                    action={onClose}
                >
                    <Icon src={CloseIcon} />
                </Trigger>
            </div>
        );
    }
}

export default classify(defaultClasses)(Header);
